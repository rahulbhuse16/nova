import type { Request, Response as ExpressResponse } from "express";
import Groq from "groq-sdk";
import { ENV } from "../config/env";

/* ============================================================================
 * Nova Travel AI — controller
 * ----------------------------------------------------------------------------
 * Responsibility: gather trustworthy, real-world context from a handful of
 * keyed/keyless APIs, rank and normalize it, and feed the best possible
 * context into Groq so it can act as a grounded travel consultant. This file
 * does NOT book anything and does NOT let the model invent places — every
 * hotel/restaurant/attraction the model is allowed to mention must already
 * exist in the context we hand it.
 *
 * Data sources (all live, no more Nominatim / Overpass):
 *   - Geoapify Reverse Geocoding  → city/state/country/timezone
 *   - Geoapify Places API         → hotels, restaurants, attractions, etc.
 *   - Open-Meteo                  → current + hourly + daily forecast
 *   - REST Countries              → currency, languages, region, driving side
 *
 * Env vars required:
 *   GROQ_API_KEY       — https://console.groq.com
 *   GEOAPIFY_API_KEY   — https://www.geoapify.com/ (free tier: 3000 req/day)
 *   GROQ_MODEL         — optional override, defaults to llama-3.3-70b-versatile
 *
 * File layout (search for these section headers):
 *   §1  Config
 *   §2  Public contract types (unchanged — this is what the frontend expects)
 *   §3  Internal domain types
 *   §4  Utilities (logger, cache, retry, timeout, concurrency limiter)
 *   §5  Geoapify client (geocoding + places)
 *   §6  Open-Meteo client
 *   §7  REST Countries client
 *   §8  Normalization + ranking (dedupe, distance sort, interest sort)
 *   §9  Context builder (fan-out + graceful degradation)
 *   §10 Prompt builder (system prompt)
 *   §11 Groq client + response normalization
 *   §12 Request validation
 *   §13 Controller
 * ==========================================================================*/

/* ============================================================================
 * §1 Config
 * ==========================================================================*/

const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const GROQ_TEMPERATURE = 0.2;

const GEOAPIFY_API_KEY = ENV.GEOAPIFY_API_KEY ?? "";
// NOTE: Geoapify's Geocoding API (v1) and Places API (v2) are versioned
// independently — don't assume they share a version, they don't.
const GEOAPIFY_GEOCODE_URL = "https://api.geoapify.com/v1/geocode";
const GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places";

const DEFAULT_TIMEOUT_MS = 8000;
const PLACES_TIMEOUT_MS = 9000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

/** Cap on concurrent outbound requests to Geoapify, to stay well inside
 *  free-tier rate limits even when many categories fan out in parallel. */
const GEOAPIFY_MAX_CONCURRENCY = 4;

/** How long normalized responses stay cached in-process. Trip context for
 *  the same coordinates rarely changes minute to minute, so this absorbs
 *  bursts (retries, double-clicks) without hammering upstream APIs. */
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ============================================================================
 * §2 Public contract types — MUST stay in lockstep with the frontend's
 * GeneratedItinerary type in travelSlice.ts. Nothing in this rewrite changes
 * the response shape the UI already consumes.
 * ==========================================================================*/

interface TripPreferences {
  destination: { name: string; country: string; lat: number; lng: number };
  dates: { startDate: string; endDate: string; nights: number; label: string };
  travellers: { type: string; count: number };
  budget: { tier: "budget" | "balanced" | "luxury"; currency: string; amount: number };
  transport: string;
  accommodation: { type: string; preferences: string[] };
  interests: string[];
}

interface GeneratedItinerary {
  overview: string;
  tripScore: number;
  travelMood: string;
  budgetEstimate: {
    total: number;
    currency: string;
    breakdown: { label: string; amount: number }[];
  };
  weatherSummary: {
    condition: string;
    tempHighC: number;
    tempLowC: number;
    advice: string;
  };
  dailyTimeline: {
    day: number;
    title: string;
    activities: { time: string; title: string; description: string; icon: string }[];
  }[];
  placesToVisit: { name: string; category: string; description: string }[];
  restaurants: { name: string; cuisine: string; priceRange: string; description: string }[];
  packingChecklist: string[];
  importantTips: string[];
  quickFacts: { label: string; value: string }[];
  emergencyContacts: { label: string; value: string }[];
  aiRecommendations: string[];
}

/* ============================================================================
 * §3 Internal domain types
 * ==========================================================================*/

type PlaceCategory =
  | "Hotel"
  | "Restaurant"
  | "Attraction"
  | "Museum"
  | "Shopping"
  | "Park"
  | "Hospital"
  | "BusStation"
  | "TrainStation"
  | "Airport"
  | "Parking"
  | "Viewpoint"
  | "Beach"
  | "Entertainment"
  | "Nightlife";

interface NormalizedPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  distanceMeters: number;
  address?: string;
  cuisine?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  /** Populated by the interest-ranking pass; higher = more relevant. */
  relevanceScore: number;
}

interface ReverseGeocodeResult {
  formattedAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
}

interface WeatherContext {
  timezone?: string;
  isForecastClamped: boolean;
  current?: {
    temperatureC?: number;
    windSpeedKph?: number;
    isDay?: boolean;
    weatherCode?: number;
  };
  daily: {
    date: string;
    weatherCode?: number;
    tempMaxC?: number;
    tempMinC?: number;
    precipitationChancePct?: number;
    windSpeedMaxKph?: number;
    uvIndexMax?: number;
    sunrise?: string;
    sunset?: string;
  }[];
}

interface CountryInfoContext {
  officialName?: string;
  capital?: string;
  region?: string;
  languages: string[];
  currencyCode?: string;
  currencyName?: string;
  timezones?: string[];
  drivingSide?: "left" | "right";
  flag?: string;
}

interface TripContext {
  destination: TripPreferences["destination"];
  reverseGeocode: ReverseGeocodeResult | null;
  weather: WeatherContext | null;
  countryInfo: CountryInfoContext | null;
  nearbyHotels: NormalizedPlace[];
  nearbyRestaurants: NormalizedPlace[];
  attractions: NormalizedPlace[];
  museums: NormalizedPlace[];
  shopping: NormalizedPlace[];
  parks: NormalizedPlace[];
  hospitals: NormalizedPlace[];
  transport: {
    busStations: NormalizedPlace[];
    trainStations: NormalizedPlace[];
    airports: NormalizedPlace[];
    parking: NormalizedPlace[];
  };
  viewpoints: NormalizedPlace[];
  beaches: NormalizedPlace[];
  entertainment: NormalizedPlace[];
  nightlife: NormalizedPlace[];
  tripPreferences: {
    dates: TripPreferences["dates"];
    travellers: TripPreferences["travellers"];
    budget: TripPreferences["budget"];
    transport: TripPreferences["transport"];
    accommodation: TripPreferences["accommodation"];
    interests: TripPreferences["interests"];
  };
  /** Data-quality flags surfaced to the model so it can be transparent
   *  about gaps instead of inventing content to fill them. */
  dataGaps: string[];
}

/* ============================================================================
 * §4 Utilities — logging, caching, retry, timeout, concurrency limiter
 * ==========================================================================*/

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) =>
    console.log(`[travelAiController] ${msg}`, meta ?? ""),
  warn: (msg: string, meta?: Record<string, unknown>) =>
    console.warn(`[travelAiController] ${msg}`, meta ?? ""),
  error: (msg: string, meta?: Record<string, unknown>) =>
    console.error(`[travelAiController] ${msg}`, meta ?? ""),
};

/** Minimal in-memory TTL cache. Process-local by design — this is meant to
 *  absorb bursts within a single server instance, not to be a distributed
 *  cache. Swap for Redis if you scale horizontally. */
class TtlCache<T> {
  private readonly store = new Map<string, { value: T; expiresAt: number }>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}

const httpCache = new TtlCache<unknown>();

/** Aborts a fetch after `timeoutMs` so one slow upstream can never hang the
 *  whole request. */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Retries transient failures (network errors, 429, 5xx) with exponential
 *  backoff + jitter. Never retries on 4xx client errors other than 429 —
 *  those won't succeed on retry and just waste the timeout budget. */
async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxRetries = MAX_RETRIES
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs);
      if (res.ok) return res;

      const isRetryable = res.status === 429 || res.status >= 500;
      if (!isRetryable || attempt === maxRetries) return res;

      const retryAfterHeader = res.headers.get("Retry-After");
      const delayMs = retryAfterHeader
        ? Number(retryAfterHeader) * 1000
        : RETRY_BASE_DELAY_MS * 2 ** attempt + Math.random() * 150;

      logger.warn(`Retrying after ${res.status}`, { url: safeUrlForLog(url), attempt, delayMs });
      await sleep(delayMs);
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
      const delayMs = RETRY_BASE_DELAY_MS * 2 ** attempt + Math.random() * 150;
      await sleep(delayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed after retries");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Strips API keys out of URLs before they hit logs. */
function safeUrlForLog(url: string): string {
  return url.replace(/([?&]apiKey=)[^&]+/i, "$1***");
}

/** Simple counting semaphore so we never fire more than N Geoapify requests
 *  at once, regardless of how many categories a trip fans out to. */
class ConcurrencyLimiter {
  private active = 0;
  private readonly queue: (() => void)[] = [];

  constructor(private readonly max: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }
    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

const geoapifyLimiter = new ConcurrencyLimiter(GEOAPIFY_MAX_CONCURRENCY);

/** Fetches JSON with retry + timeout + cache, wrapped so a single failing
 *  source never throws out of the aggregation layer — callers get `null`
 *  and a warning in the logs instead of a crashed request. */
async function safeFetchJson<T>(
  cacheKey: string,
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T | null> {
  const cached = httpCache.get(cacheKey) as T | undefined;
  if (cached !== undefined) return cached;

  try {
    const res = await fetchWithRetry(url, init, timeoutMs);
    if (!res.ok) {
      logger.warn(`Non-OK response`, { url: safeUrlForLog(url), status: res.status });
      return null;
    }
    const data = (await res.json()) as T;
    httpCache.set(cacheKey, data, CACHE_TTL_MS);
    return data;
  } catch (err) {
    logger.warn(`Fetch failed`, { url: safeUrlForLog(url), error: (err as Error).message });
    return null;
  }
}

/** Great-circle distance in meters — used for "sort by distance" and to cap
 *  obviously-wrong results the Places API occasionally returns at radius edges. */
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ============================================================================
 * §5 Geoapify client — reverse geocoding + places
 * ==========================================================================*/

/** Geoapify Places category codes. Kept as a single source of truth so the
 *  interest-ranking pass and the fan-out list can't drift apart. Reference:
 *  https://apidocs.geoapify.com/docs/places/#categories */
const GEOAPIFY_CATEGORIES = {
  hotels: "accommodation.hotel,accommodation.hostel,accommodation.apartment,accommodation.guest_house",
  luxuryHotels: "accommodation.hotel",
  restaurants: "catering.restaurant",
  attractions: "tourism.attraction,tourism.sights",
  museums: "entertainment.museum,entertainment.culture",
  shopping: "commercial.shopping_mall,commercial.marketplace",
  parks: "leisure.park",
  hospitals: "healthcare.hospital,healthcare.clinic_or_praxis",
  busStations: "public_transport.bus",
  trainStations: "public_transport.train,public_transport.subway",
  airports: "airport",
  parking: "parking",
  viewpoints: "tourism.attraction.viewpoint",
  beaches: "beach",
  entertainment: "entertainment.zoo,entertainment.aquarium,entertainment.theme_park",
  nightlife: "catering.bar,catering.pub,entertainment.nightclub",
} as const;

const INTEREST_TO_CATEGORY_WEIGHT: Record<string, Partial<Record<PlaceCategory, number>>> = {
  food: { Restaurant: 3 },
  foodie: { Restaurant: 3 },
  adventure: { Park: 2, Viewpoint: 2, Attraction: 1.5 },
  nature: { Park: 3, Viewpoint: 2, Beach: 2 },
  photography: { Viewpoint: 3, Attraction: 1.5, Beach: 1.5 },
  nightlife: { Nightlife: 3 },
  luxury: { Hotel: 2.5, Restaurant: 1.5 },
  kids: { Park: 2, Entertainment: 3 },
  family: { Park: 2, Entertainment: 2.5 },
  culture: { Museum: 3, Attraction: 1.5 },
  history: { Museum: 3, Attraction: 2 },
  shopping: { Shopping: 3 },
  relaxation: { Beach: 2.5, Park: 1.5 },
  beach: { Beach: 3 },
};

async function geoapifyReverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  if (!GEOAPIFY_API_KEY) {
    logger.warn("GEOAPIFY_API_KEY is not set — skipping reverse geocoding");
    return null;
  }

  const url = `${GEOAPIFY_GEOCODE_URL}/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
  const cacheKey = `geocode:${lat.toFixed(4)},${lng.toFixed(4)}`;

  const data = await safeFetchJson<any>(cacheKey, url);
  const result = data?.results?.[0];
  if (!result) return null;

  return {
    formattedAddress: result.formatted,
    city: result.city ?? result.county,
    state: result.state,
    country: result.country,
    countryCode: (result.country_code as string | undefined)?.toUpperCase(),
    timezone: result.timezone?.name,
  };
}

/** Fetches one Places category and normalizes results. Distance is computed
 *  client-side (Geoapify doesn't return it directly for circle filters) so
 *  downstream ranking has a consistent, comparable number across categories. */
async function geoapifyFetchCategory(
  lat: number,
  lng: number,
  radiusMeters: number,
  categories: string,
  categoryLabel: PlaceCategory,
  limit = 20
): Promise<NormalizedPlace[]> {
  if (!GEOAPIFY_API_KEY) return [];

  const url =
    `${GEOAPIFY_PLACES_URL}?categories=${encodeURIComponent(categories)}` +
    `&filter=circle:${lng},${lat},${radiusMeters}` +
    `&bias=proximity:${lng},${lat}` +
    `&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;

  const cacheKey = `places:${categoryLabel}:${lat.toFixed(4)},${lng.toFixed(4)}:${radiusMeters}`;

  const data = await geoapifyLimiter.run(() =>
    safeFetchJson<any>(cacheKey, url, {}, PLACES_TIMEOUT_MS)
  );

  const features: any[] = data?.features ?? [];

  return features
    .map((f): NormalizedPlace | null => {
      const props = f.properties ?? {};
      const placeLat = props.lat ?? f.geometry?.coordinates?.[1];
      const placeLon = props.lon ?? f.geometry?.coordinates?.[0];
      if (!props.name || placeLat == null || placeLon == null) return null;

      return {
        id: props.place_id ?? `${categoryLabel}-${placeLat}-${placeLon}-${props.name}`,
        name: props.name as string,
        category: categoryLabel,
        lat: placeLat,
        lon: placeLon,
        distanceMeters: Math.round(haversineMeters(lat, lng, placeLat, placeLon)),
        address: props.formatted,
        cuisine: props.catering?.cuisine ?? props.details?.cuisine,
        website: props.website,
        phone: props.contact?.phone,
        openingHours: props.opening_hours,
        relevanceScore: 0,
      };
    })
    .filter((p): p is NormalizedPlace => p !== null);
}

/* ============================================================================
 * §6 Open-Meteo client
 * ==========================================================================*/

async function fetchWeather(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string
): Promise<WeatherContext | null> {
  // Open-Meteo's free forecast endpoint only covers ~16 days ahead. For
  // trips further out, clamp to the nearest available window so the model
  // still gets a useful near-term signal instead of an API error — and we
  // flag the clamp so the prompt can be honest about it.
  const today = new Date();
  const maxForecastDate = new Date(today);
  maxForecastDate.setDate(maxForecastDate.getDate() + 15);

  const clamp = (iso: string) => {
    const d = new Date(iso);
    return d > maxForecastDate ? maxForecastDate.toISOString().slice(0, 10) : iso;
  };

  const isClamped = new Date(startDate) > maxForecastDate;
  const start = clamp(startDate);
  const end = clamp(endDate) < start ? start : clamp(endDate);

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,wind_speed_10m,is_day,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,` +
    `wind_speed_10m_max,uv_index_max,sunrise,sunset` +
    `&timezone=auto&start_date=${start}&end_date=${end}`;

  const cacheKey = `weather:${lat.toFixed(3)},${lng.toFixed(3)}:${start}:${end}`;
  const data = await safeFetchJson<any>(cacheKey, url);
  if (!data) return null;

  return {
    timezone: data.timezone,
    isForecastClamped: isClamped,
    current: data.current
      ? {
          temperatureC: data.current.temperature_2m,
          windSpeedKph: data.current.wind_speed_10m,
          isDay: data.current.is_day === 1,
          weatherCode: data.current.weather_code,
        }
      : undefined,
    daily: (data.daily?.time ?? []).map((date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code?.[i],
      tempMaxC: data.daily.temperature_2m_max?.[i],
      tempMinC: data.daily.temperature_2m_min?.[i],
      precipitationChancePct: data.daily.precipitation_probability_mean?.[i],
      windSpeedMaxKph: data.daily.wind_speed_10m_max?.[i],
      uvIndexMax: data.daily.uv_index_max?.[i],
      sunrise: data.daily.sunrise?.[i],
      sunset: data.daily.sunset?.[i],
    })),
  };
}

/* ============================================================================
 * §7 REST Countries client
 * ==========================================================================*/

/** ISO country codes that drive on the left. Small, stable list — cheaper
 *  and more reliable than parsing REST Countries' inconsistent `car.side`
 *  field, which is missing for some countries. */
const LEFT_HAND_DRIVE_COUNTRY_CODES = new Set([
  "GB", "IE", "AU", "NZ", "JP", "IN", "ZA", "TH", "SG", "MY", "ID", "PK",
  "KE", "TZ", "UG", "MZ", "NA", "BW", "ZW", "LS", "SZ", "MT", "CY", "HK",
  "MO", "BD", "LK", "NP", "BT", "BN", "FJ", "PG", "JM", "BB", "BS", "TT",
]);

async function fetchCountryInfo(
  countryName: string,
  countryCode?: string
): Promise<CountryInfoContext | null> {
  function normalize(data: any): CountryInfoContext | null {
    if (!data) return null;
    const currencyCode = data.currencies ? Object.keys(data.currencies)[0] : undefined;
    const cca2 = data.cca2 as string | undefined;

    return {
      officialName: data.name?.official,
      capital: data.capital?.[0],
      region: data.region,
      languages: data.languages ? Object.values(data.languages) as string[] : [],
      currencyCode,
      currencyName: currencyCode ? data.currencies[currencyCode]?.name : undefined,
      timezones: data.timezones,
      drivingSide: cca2 && LEFT_HAND_DRIVE_COUNTRY_CODES.has(cca2) ? "left" : "right",
      flag: data.flag,
    };
  }

  const fields = "name,cca2,currencies,timezones,capital,region,languages,flag";
  const headers = { Accept: "application/json" };

  if (countryCode) {
    const url = `https://restcountries.com/v3.1/alpha/${countryCode}?fields=${fields}`;
    const data = await safeFetchJson<any>(`country:alpha:${countryCode}`, url, { headers });
    if (data && !Array.isArray(data)) return normalize(data);
  }

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=${fields}`;
  const data = await safeFetchJson<any[]>(`country:name:${countryName}`, url, { headers });
  return normalize(Array.isArray(data) ? data[0] : null);
}

/* ============================================================================
 * §8 Normalization + ranking
 * ==========================================================================*/

/** Removes near-duplicate places (same name within ~40m of each other),
 *  which Geoapify occasionally returns when a POI has multiple entrances
 *  or is tagged in more than one dataset. */
function dedupePlaces(places: NormalizedPlace[]): NormalizedPlace[] {
  const seen: NormalizedPlace[] = [];

  for (const place of places) {
    const isDuplicate = seen.some(
      (existing) =>
        existing.name.trim().toLowerCase() === place.name.trim().toLowerCase() &&
        haversineMeters(existing.lat, existing.lon, place.lat, place.lon) < 40
    );
    if (!isDuplicate) seen.push(place);
  }

  return seen;
}

/** Scores places against the traveller's stated interests, then sorts by
 *  (relevance desc, distance asc) so the most interest-aligned *and*
 *  convenient options surface first — exactly what gets truncated into
 *  the AI context, so ranking quality directly controls output quality. */
function rankByInterests(places: NormalizedPlace[], interests: string[]): NormalizedPlace[] {
  const normalizedInterests = interests.map((i) => i.toLowerCase().trim());

  const scored = places.map((place) => {
    let score = 0;
    for (const interest of normalizedInterests) {
      const weightMap = INTEREST_TO_CATEGORY_WEIGHT[interest];
      score += weightMap?.[place.category] ?? 0;
    }
    // Small proximity bonus so equally-relevant places still favor the
    // closer option, without letting distance override real interest match.
    const proximityBonus = Math.max(0, 1 - place.distanceMeters / 8000);
    return { ...place, relevanceScore: score + proximityBonus };
  });

  return scored.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
    return a.distanceMeters - b.distanceMeters;
  });
}

function processPlaces(places: NormalizedPlace[], interests: string[], limit: number): NormalizedPlace[] {
  return rankByInterests(dedupePlaces(places), interests).slice(0, limit);
}

/* ============================================================================
 * §9 Context builder — fans out every source in parallel, never lets a
 * single failure take down the request, and records what's missing so the
 * prompt can be transparent about gaps.
 * ==========================================================================*/

async function buildTripContext(trip: TripPreferences): Promise<TripContext> {
  const { lat, lng } = trip.destination;
  const { interests } = trip;
  const dataGaps: string[] = [];

  if (!GEOAPIFY_API_KEY) {
    dataGaps.push("Places and geocoding data unavailable (missing Geoapify API key).");
  }

  // Reverse geocode first — its ISO country code turns the country lookup
  // into a single unambiguous request instead of a fuzzy name search.
  const reverseGeocode = await geoapifyReverseGeocode(lat, lng);
  if (!reverseGeocode) dataGaps.push("Reverse geocoding failed; using destination name as-is.");

  const wantsLuxury = trip.budget.tier === "luxury" || trip.accommodation.preferences.includes("luxury");
  const hotelCategories = wantsLuxury ? GEOAPIFY_CATEGORIES.luxuryHotels : GEOAPIFY_CATEGORIES.hotels;

  const [
    weather,
    countryInfo,
    hotels,
    restaurants,
    attractions,
    museums,
    shopping,
    parks,
    hospitals,
    busStations,
    trainStations,
    airports,
    parking,
    viewpoints,
    beaches,
    entertainment,
    nightlife,
  ] = await Promise.all([
    fetchWeather(lat, lng, trip.dates.startDate, trip.dates.endDate),
    fetchCountryInfo(trip.destination.country, reverseGeocode?.countryCode),
    geoapifyFetchCategory(lat, lng, 5000, hotelCategories, "Hotel"),
    geoapifyFetchCategory(lat, lng, 3000, GEOAPIFY_CATEGORIES.restaurants, "Restaurant"),
    geoapifyFetchCategory(lat, lng, 6000, GEOAPIFY_CATEGORIES.attractions, "Attraction"),
    geoapifyFetchCategory(lat, lng, 6000, GEOAPIFY_CATEGORIES.museums, "Museum"),
    geoapifyFetchCategory(lat, lng, 4000, GEOAPIFY_CATEGORIES.shopping, "Shopping"),
    geoapifyFetchCategory(lat, lng, 4000, GEOAPIFY_CATEGORIES.parks, "Park"),
    geoapifyFetchCategory(lat, lng, 6000, GEOAPIFY_CATEGORIES.hospitals, "Hospital", 5),
    geoapifyFetchCategory(lat, lng, 4000, GEOAPIFY_CATEGORIES.busStations, "BusStation", 5),
    geoapifyFetchCategory(lat, lng, 8000, GEOAPIFY_CATEGORIES.trainStations, "TrainStation", 5),
    geoapifyFetchCategory(lat, lng, 30000, GEOAPIFY_CATEGORIES.airports, "Airport", 3),
    geoapifyFetchCategory(lat, lng, 3000, GEOAPIFY_CATEGORIES.parking, "Parking", 5),
    geoapifyFetchCategory(lat, lng, 8000, GEOAPIFY_CATEGORIES.viewpoints, "Viewpoint"),
    geoapifyFetchCategory(lat, lng, 15000, GEOAPIFY_CATEGORIES.beaches, "Beach"),
    geoapifyFetchCategory(lat, lng, 8000, GEOAPIFY_CATEGORIES.entertainment, "Entertainment"),
    geoapifyFetchCategory(lat, lng, 4000, GEOAPIFY_CATEGORIES.nightlife, "Nightlife"),
  ]);

  if (!weather) dataGaps.push("Weather forecast unavailable for these dates.");
  if (!countryInfo) dataGaps.push("Country reference data unavailable.");
  if (hotels.length === 0) dataGaps.push("No hotels found near this destination in our data source.");
  if (restaurants.length === 0) dataGaps.push("No restaurants found near this destination in our data source.");

  return {
    destination: trip.destination,
    reverseGeocode,
    weather,
    countryInfo,
    nearbyHotels: processPlaces(hotels, interests, 12),
    nearbyRestaurants: processPlaces(restaurants, interests, 15),
    attractions: processPlaces(attractions, interests, 15),
    museums: processPlaces(museums, interests, 8),
    shopping: processPlaces(shopping, interests, 6),
    parks: processPlaces(parks, interests, 8),
    hospitals: processPlaces(hospitals, interests, 5),
    transport: {
      busStations: processPlaces(busStations, interests, 5),
      trainStations: processPlaces(trainStations, interests, 5),
      airports: processPlaces(airports, interests, 3),
      parking: processPlaces(parking, interests, 5),
    },
    viewpoints: processPlaces(viewpoints, interests, 8),
    beaches: processPlaces(beaches, interests, 6),
    entertainment: processPlaces(entertainment, interests, 8),
    nightlife: processPlaces(nightlife, interests, 8),
    tripPreferences: {
      dates: trip.dates,
      travellers: trip.travellers,
      budget: trip.budget,
      transport: trip.transport,
      accommodation: trip.accommodation,
      interests: trip.interests,
    },
    dataGaps,
  };
}

/* ============================================================================
 * §10 Prompt builder
 * ==========================================================================*/

const SYSTEM_PROMPT = `You are Nova Travel AI — a senior travel consultant persona that reasons like a team of specialists working together: a luxury travel consultant, a local guide, a budget optimizer, a weather analyst, a safety advisor, a food expert, a transportation expert, and a packing expert. You are embedded in Nova, an AI-powered Daily Operating System. Travel planning here is advisory only — you never book anything.

Your job is to turn the structured JSON context in the user message into a single, accurate, genuinely useful itinerary. That context was gathered by the application from live sources: Geoapify reverse geocoding, Geoapify Places (hotels, restaurants, attractions, museums, shopping, parks, hospitals, transport hubs, parking, viewpoints, beaches, entertainment, nightlife), Open-Meteo forecasts, and REST Countries reference data. Treat it as ground truth. Never contradict it and never ignore it.

===================
ANTI-HALLUCINATION / GROUNDING RULES — NON-NEGOTIABLE
===================
- Every named hotel in your output must come from "nearbyHotels". Every named restaurant must come from "nearbyRestaurants". Every named attraction, museum, park, viewpoint, beach, or entertainment venue must come from the matching context array. Never invent a business name, address, phone number, or rating that isn't present in the context.
- If an array is empty or a field is missing, say so plainly in the relevant output field (e.g. "no verified restaurants found near this location") instead of fabricating something to fill the gap. Check "dataGaps" in the context — it lists everything the backend already knows is missing, and you must respect it.
- General background knowledge (e.g. "this region is known for spicy street food") may only fill genuinely general, well-known gaps — never specific business names, prices, addresses, or current events you were not given.
- Use latitude/longitude and the reverse-geocoded formatted address as the source of geographic truth, not your own assumptions about the destination.

===================
REASONING STRATEGY (internal only — never output this)
===================
Before writing, silently reason through, in order: (1) weather suitability and best hours per day, (2) geographic clustering of places to minimize backtracking, (3) realistic time-of-day pacing and travel fatigue across the trip length, (4) budget allocation against the requested tier, (5) transportation efficiency for the selected mode, (6) safety and crowd considerations, (7) which supplied places best match the traveller's stated interests, (8) food style and hidden-gem potential grounded only in supplied data. Never expose this reasoning — output only the final JSON.

===================
INTEREST-DRIVEN PRIORITIZATION
===================
The places you were given have already been ranked by relevance to the traveller's interests and by distance — respect that ordering as a strong signal of what to feature first, but still use judgment (e.g. don't put five museums back-to-back even if museums rank first). Interests map roughly like this: "food" → restaurants take priority; "adventure"/"nature" → parks, viewpoints, trails; "photography" → viewpoints and scenic spots; "nightlife" → bars/clubs; "luxury" → higher-end hotels and dining; "kids"/"family" → parks, zoos, aquariums, theme parks.

===================
WEATHER OPTIMIZATION
===================
- Read the daily forecast (temperature, precipitation chance, wind, UV, sunrise/sunset) and use it to choose realistic activity timing: outdoor sightseeing on clear/low-rain hours, indoor alternatives (museums, shopping, entertainment from context) when precipitation chance is high, sun protection guidance when UV is high, and warm-clothing guidance when temperatures are low.
- If "weather.isForecastClamped" is true, the forecast was clamped to a near-term window because the trip is further out than the forecast horizon — say so plainly in "weatherSummary.advice" rather than presenting it as a confirmed forecast for the actual travel dates.

===================
ITINERARY CONSTRUCTION
===================
- Build one "dailyTimeline" entry per day (tripPreferences.dates.nights + 1), capped at 10 entries for long trips — for longer trips, cover the representative rhythm rather than every single day.
- Each day's "activities" should flow naturally (morning / afternoon / evening / optionally night) — the number of activities should reflect what's realistic, not be padded.
- Cluster geographically close places on the same day to avoid backtracking. Balance sightseeing with rest, especially for family or multi-day trips.
- Each activity needs an "icon" chosen from: "Sunrise", "Compass", "Moon", "Utensils", "Landmark", "Waves", "Mountain", "ShoppingBag", "Camera" — pick whichever best matches the activity.

===================
HOTEL SELECTION RULES
===================
- Only recommend hotels present in "nearbyHotels". Match the requested budget tier and accommodation preferences where the data allows it (e.g. don't recommend a budget-tier traveller only the priciest-sounding option if cheaper alternatives exist in the list).

===================
RESTAURANT SELECTION RULES
===================
- Only recommend restaurants present in "nearbyRestaurants". Prioritize a mix of cuisines and price points that fit the budget tier. If the array is empty, return an empty "restaurants" array and mention the gap in "importantTips" — never invent restaurants to avoid an empty list.

===================
BUDGET OPTIMIZATION
===================
- Respect the requested tier, amount, and currency. "budgetEstimate.breakdown" must have exactly these five entries, in this order: "Accommodation", "Food & dining", "Transportation", "Activities & experiences", "Miscellaneous". Amounts must sum to "budgetEstimate.total" and use the requested currency.

===================
PACKING RULES
===================
- "packingChecklist" must reflect the actual supplied weather (temperature range, rain, UV, wind), the chosen transport mode, trip length, and traveller interests — never a generic list.

===================
SAFETY & EMERGENCY RULES
===================
- "emergencyContacts" should include the destination country's general emergency number if it can be reasonably inferred from country context, general embassy-registration advice for international travel, and a placeholder for the traveller's accommodation front desk. If "hospitals" data is available, you may note the general presence of nearby hospitals without inventing specific names not present in that array. Never invent a specific phone number that wasn't supplied.

===================
TRANSPORTATION GUIDANCE
===================
- Use "transport.trainStations", "transport.busStations", "transport.airports", and "transport.parking" (only if non-empty) plus the traveller's selected transport mode and the country's driving side to give practical, grounded transportation tips — never invent specific line numbers, schedules, or fares that weren't supplied.

===================
OUTPUT FORMAT — CRITICAL
===================
Return ONLY valid JSON — no markdown, no code fences, no commentary before or after, no trailing commas. The JSON must match this schema and these exact field names:

{
  "overview": "string — 2-4 sentences summarizing this specific trip",
  "tripScore": 0,
  "travelMood": "string — a short evocative phrase",
  "budgetEstimate": {
    "total": 0,
    "currency": "string — matches tripPreferences.budget.currency",
    "breakdown": [
      { "label": "Accommodation", "amount": 0 },
      { "label": "Food & dining", "amount": 0 },
      { "label": "Transportation", "amount": 0 },
      { "label": "Activities & experiences", "amount": 0 },
      { "label": "Miscellaneous", "amount": 0 }
    ]
  },
  "weatherSummary": {
    "condition": "string",
    "tempHighC": 0,
    "tempLowC": 0,
    "advice": "string"
  },
  "dailyTimeline": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        { "time": "HH:MM", "title": "string", "description": "string", "icon": "string" }
      ]
    }
  ],
  "placesToVisit": [
    { "name": "string", "category": "string", "description": "string" }
  ],
  "restaurants": [
    { "name": "string", "cuisine": "string", "priceRange": "$ | $$ | $$$ | $$$$", "description": "string" }
  ],
  "packingChecklist": ["string"],
  "importantTips": ["string"],
  "quickFacts": [
    { "label": "string", "value": "string" }
  ],
  "emergencyContacts": [
    { "label": "string", "value": "string" }
  ],
  "aiRecommendations": ["string"]
}

Keep prose fields concise and information-dense — every sentence should earn its tokens. Ensure the JSON is complete and syntactically valid, with no extra text before or after it.`;

/* ============================================================================
 * §11 Groq client + response normalization
 * ==========================================================================*/

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1] : trimmed;
}

/** Fills in safe, clearly-labeled defaults for anything the model omitted,
 *  so a slightly incomplete model response can never crash the frontend. */
function normalizeItinerary(raw: any, trip: TripPreferences): GeneratedItinerary {
  const currency = raw?.budgetEstimate?.currency ?? trip.budget.currency;

  return {
    overview:
      typeof raw?.overview === "string"
        ? raw.overview
        : `A ${trip.dates.label.toLowerCase()} to ${trip.destination.name}.`,
    tripScore: typeof raw?.tripScore === "number" ? Math.min(100, Math.max(0, raw.tripScore)) : 80,
    travelMood: typeof raw?.travelMood === "string" ? raw.travelMood : "Open to anything",
    budgetEstimate: {
      total: typeof raw?.budgetEstimate?.total === "number" ? raw.budgetEstimate.total : trip.budget.amount,
      currency,
      breakdown: Array.isArray(raw?.budgetEstimate?.breakdown) ? raw.budgetEstimate.breakdown : [],
    },
    weatherSummary: {
      condition: raw?.weatherSummary?.condition ?? "Weather data unavailable for these dates",
      tempHighC: typeof raw?.weatherSummary?.tempHighC === "number" ? raw.weatherSummary.tempHighC : 0,
      tempLowC: typeof raw?.weatherSummary?.tempLowC === "number" ? raw.weatherSummary.tempLowC : 0,
      advice: raw?.weatherSummary?.advice ?? "Check a live forecast closer to your travel date.",
    },
    dailyTimeline: Array.isArray(raw?.dailyTimeline) ? raw.dailyTimeline : [],
    placesToVisit: Array.isArray(raw?.placesToVisit) ? raw.placesToVisit : [],
    restaurants: Array.isArray(raw?.restaurants) ? raw.restaurants : [],
    packingChecklist: Array.isArray(raw?.packingChecklist) ? raw.packingChecklist : [],
    importantTips: Array.isArray(raw?.importantTips) ? raw.importantTips : [],
    quickFacts: Array.isArray(raw?.quickFacts) ? raw.quickFacts : [],
    emergencyContacts: Array.isArray(raw?.emergencyContacts) ? raw.emergencyContacts : [],
    aiRecommendations: Array.isArray(raw?.aiRecommendations) ? raw.aiRecommendations : [],
  };
}

async function callGroqForItinerary(context: TripContext, trip: TripPreferences): Promise<GeneratedItinerary> {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: GROQ_TEMPERATURE,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(context) },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFences(content));
  } catch (err) {
    logger.error("Failed to parse Groq JSON response", { content });
    throw new Error("Nova's planning model returned an invalid response. Please try again.");
  }

  return normalizeItinerary(parsed, trip);
}

/* ============================================================================
 * §12 Request validation
 * ==========================================================================*/

function validateTripPreferences(body: unknown): body is TripPreferences {
  const b = body as any;
  return (
    b?.destination?.lat != null &&
    b?.destination?.lng != null &&
    typeof b?.destination?.name === "string" &&
    typeof b?.destination?.country === "string" &&
    !!b?.dates?.startDate &&
    !!b?.dates?.endDate &&
    typeof b?.dates?.nights === "number" &&
    !!b?.travellers?.type &&
    typeof b?.travellers?.count === "number" &&
    !!b?.budget?.tier &&
    !!b?.budget?.currency &&
    !!b?.transport &&
    !!b?.accommodation?.type &&
    Array.isArray(b?.interests)
  );
}

/* ============================================================================
 * §13 Controller
 * POST /api/travel/plan
 * Body: TripPreferences  → Response: GeneratedItinerary
 * ==========================================================================*/

export async function generateTravelPlan(req: Request, res: ExpressResponse): Promise<void> {
  if (ENV.GROQ_API_KEY) {
    res.status(500).json({ error: "Server is missing GROQ_API_KEY." });
    return;
  }
  if (!GEOAPIFY_API_KEY) {
    logger.warn("GEOAPIFY_API_KEY is not set — context will be severely degraded.");
  }

  const trip = req.body;
  if (!validateTripPreferences(trip)) {
    res.status(400).json({ error: "Missing or invalid trip preferences in request body." });
    return;
  }

  try {
    const context = await buildTripContext(trip);
    const itinerary = await callGroqForItinerary(context, trip);
    res.status(200).json(itinerary);
  } catch (err) {
    logger.error("generateTravelPlan failed", { error: (err as Error).message });
    res.status(502).json({
      error: err instanceof Error ? err.message : "Nova couldn't finish planning this trip. Please try again.",
    });
  }
}

export default generateTravelPlan;