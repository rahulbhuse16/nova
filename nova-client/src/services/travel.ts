import axios, { AxiosError } from "axios";
import type { Destination, TripInput, GeneratedItinerary } from "../redux/travel";
import api from "@/api/api";

/* ==================================================================
 * Nova Travel Planner — service layer
 *
 * generateItinerary() now calls the real Nova Travel AI backend
 * (Express controller + Groq) over HTTP via axios.
 *
 * searchDestinations() stays local — the backend only exposes trip
 * planning (POST /api/travel/plan), not a destination search endpoint,
 * so the curated list below still powers the map's search/autocomplete.
 * ================================================================== */



/* ------------------------------------------------------------------ */
/* Curated destination list (stands in for a geocoding/search API)     */
/* ------------------------------------------------------------------ */

export const CURATED_DESTINATIONS: Destination[] = [
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { id: "bali", name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.092 },
  { id: "new-york", name: "New York City", country: "United States", lat: 40.7128, lng: -74.006 },
  { id: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { id: "santorini", name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { id: "kyoto", name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { id: "marrakech", name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811 },
  { id: "queenstown", name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626 },
  { id: "lisbon", name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  { id: "barcelona", name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { id: "banff", name: "Banff", country: "Canada", lat: 51.1784, lng: -115.5708 },
  { id: "goa", name: "Goa", country: "India", lat: 15.2993, lng: 74.124 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { id: "machu-picchu", name: "Cusco", country: "Peru", lat: -13.5319, lng: -71.9675 },
  { id: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  { id: "zermatt", name: "Zermatt", country: "Switzerland", lat: 46.0207, lng: 7.7491 },
  { id: "maldives", name: "Malé", country: "Maldives", lat: 4.1755, lng: 73.5093 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
];

/** Local, in-memory "search" over the curated list — no network request. */
export function searchDestinations(query: string): Promise<Destination[]> {
  const q = query.trim().toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!q) {
        resolve(CURATED_DESTINATIONS.slice(0, 6));
        return;
      }
      resolve(
        CURATED_DESTINATIONS.filter(
          (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
        ).slice(0, 8)
      );
    }, 220);
  });
}

/* ------------------------------------------------------------------ */
/* AI "thinking" stages — surfaced by the UI while the request is in   */
/* flight. Cosmetic only; they cycle on a timer independent of when    */
/* the actual response arrives (see AIPlanningStep in travel.tsx).     */
/* ------------------------------------------------------------------ */

export const AI_THINKING_STAGES: string[] = [
  "Analyzing destination...",
  "Checking travel style...",
  "Optimizing itinerary...",
  "Finding hidden gems...",
  "Balancing budget...",
  "Estimating travel time...",
  "Preparing your personalized experience...",
];

/* ------------------------------------------------------------------ */
/* Real itinerary generation — POST /api/travel/plan                   */
/* Body: TripInput. Response: GeneratedItinerary. Both shapes match     */
/* the backend controller's TripPreferences / GeneratedItinerary types. */
/* ------------------------------------------------------------------ */

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ error?: string }>;

    if (axiosErr.code === "ECONNABORTED") {
      return "Nova's planning is taking longer than expected. Please try again.";
    }
    if (!axiosErr.response) {
      return "Couldn't reach Nova's planning service. Check your connection and try again.";
    }

    const serverMessage = axiosErr.response.data?.error;
    if (serverMessage) return serverMessage;

    if (axiosErr.response.status === 400) return "Some trip details are missing or invalid.";
    if (axiosErr.response.status >= 500) return "Nova's planning service ran into a problem. Please try again.";
  }
  return err instanceof Error ? err.message : "Nova couldn't finish planning this trip.";
}

/** Calls the real Nova Travel AI backend to generate a personalized itinerary. */
export async function generateItinerary(input: TripInput): Promise<GeneratedItinerary> {
  try {
    const { data } = await api.post<GeneratedItinerary>("/travel-planner/", input);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}