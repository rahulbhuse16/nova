import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Globe2,
  MapPin,
  Search,
  Satellite,
  Map as MapIcon,
  CalendarDays,
  Users,
  Wallet,
  Plane,
  Train,
  Car,
  Bus,
  Shuffle,
  Building2,
  Home as HomeIcon,
  Tent,
  Crown,
  BedDouble,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Sun,
  Utensils,
  Landmark,
  Backpack,
  Info,
  Phone,
  TrendingUp,
  Compass,
  Sunrise,
  Moon,
  Heart,
  Camera,
  Music2,
  Waves,
  Mountain,
  ShoppingBag,
  Gem,
  PartyPopper,
  Baby,
  Trees,
  RefreshCcw,
  Edit3,
  Minus,
  Plus,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { StatCard } from "@/components/cards/StatCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { IconButton } from "@/components/buttons/IconButton";
import { Badge } from "@/components/shared/Badge";
import { Chip } from "@/components/shared/Chip";
import { Divider } from "@/components/shared/Divider";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { TextField } from "@/components/inputs/TextField";
import { Select } from "@/components/inputs/Select";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  nextStep,
  previousStep,
  goToStep,
  setDestination,
  setDates,
  setTravellers,
  setBudget,
  setTransport,
  setAccommodation,
  toggleInterest,
  planTripWithAI,
  saveTrip,
  resetTravelPlanner,
  selectCurrentStep,
  selectCompletedSteps,
  selectDestination,
  selectDates,
  selectTravellers,
  selectBudget,
  selectTransport,
  selectAccommodation,
  selectInterests,
  selectItinerary,
  selectLoading,
  selectSaving,
  selectError,
  selectProgressPercent,
  selectCanAdvance,
  selectTripSummary,
  TOTAL_STEPS,
  type Destination,
  type DateMode,
  type TripDates,
  type TravellerType,
  type BudgetTier,
  type TransportMode,
  type AccommodationType,
  type WizardStep,
} from "@/redux/travel";
import { searchDestinations, AI_THINKING_STAGES } from "@/services/travel";

/* ==================================================================
 * Nova Travel Planner
 * Nova plans this trip together with the user, one step at a time.
 * ================================================================== */

/* ------------------------------------------------------------------ */
/* Leaflet marker icon fix (bundlers break the default asset paths)    */
/* ------------------------------------------------------------------ */

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* ------------------------------------------------------------------ */
/* Static option data                                                  */
/* ------------------------------------------------------------------ */

const STEP_LABELS: Record<WizardStep, string> = {
  1: "Welcome",
  2: "Destination",
  3: "Dates",
  4: "Travellers",
  5: "Budget",
  6: "Transport",
  7: "Stay",
  8: "Interests",
  9: "AI Planning",
  10: "Your Trip",
};

const DATE_MODE_OPTIONS: { id: DateMode; label: string; nights: number; description: string }[] = [
  { id: "weekend", label: "Weekend", nights: 2, description: "A quick 2-night escape" },
  { id: "week", label: "Week", nights: 6, description: "7 days, 6 nights" },
  { id: "month", label: "Month", nights: 29, description: "A slow month away" },
  { id: "custom", label: "Custom", nights: 0, description: "Pick your own dates" },
];

const TRAVELLER_OPTIONS: { id: TravellerType; label: string; defaultCount: number; icon: typeof Users; description: string }[] = [
  { id: "solo", label: "Solo", defaultCount: 1, icon: Users, description: "Just you, at your own pace" },
  { id: "couple", label: "Couple", defaultCount: 2, icon: Heart, description: "Two people, one adventure" },
  { id: "family", label: "Family", defaultCount: 4, icon: HomeIcon, description: "Travel with the whole crew" },
  { id: "friends", label: "Friends", defaultCount: 5, icon: PartyPopper, description: "A group trip with your people" },
  { id: "business", label: "Business", defaultCount: 1, icon: Building2, description: "Efficient, comfortable travel" },
  { id: "custom", label: "Custom", defaultCount: 3, icon: Edit3, description: "Set your own group size" },
];

const BUDGET_TIERS: { id: BudgetTier; label: string; description: string; min: number; max: number; icon: typeof Wallet }[] = [
  { id: "budget", label: "Budget", description: "Smart spending, same great trip", min: 400, max: 1800, icon: Wallet },
  { id: "balanced", label: "Balanced", description: "Comfort without overdoing it", min: 1800, max: 5000, icon: TrendingUp },
  { id: "luxury", label: "Luxury", description: "Elevated stays and experiences", min: 5000, max: 15000, icon: Crown },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "INR", label: "INR — Indian Rupee (₹)" },
  { value: "JPY", label: "JPY — Japanese Yen (¥)" },
];

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥" };

const TRANSPORT_OPTIONS: { id: TransportMode; label: string; icon: typeof Plane; description: string }[] = [
  { id: "flight", label: "Flight", icon: Plane, description: "Fastest way there" },
  { id: "train", label: "Train", icon: Train, description: "Scenic and relaxed" },
  { id: "road-trip", label: "Road Trip", icon: Car, description: "Freedom to wander" },
  { id: "bus", label: "Bus", icon: Bus, description: "Easy on the budget" },
  { id: "mixed", label: "Mixed", icon: Shuffle, description: "Whatever fits best" },
];

const ACCOMMODATION_OPTIONS: { id: AccommodationType; label: string; icon: typeof Building2; description: string }[] = [
  { id: "hotel", label: "Hotel", icon: Building2, description: "Reliable comfort" },
  { id: "hostel", label: "Hostel", icon: BedDouble, description: "Social and affordable" },
  { id: "apartment", label: "Apartment", icon: HomeIcon, description: "Space to live like a local" },
  { id: "resort", label: "Resort", icon: Waves, description: "Everything in one place" },
  { id: "camping", label: "Camping", icon: Tent, description: "Closer to nature" },
  { id: "luxury-stay", label: "Luxury Stay", icon: Crown, description: "Elevated, all the way" },
];

const ACCOMMODATION_PREFERENCES = ["Free breakfast", "Pool", "Pet friendly", "Central location", "Quiet area", "Free cancellation"];

const INTEREST_OPTIONS: { label: string; icon: typeof Utensils }[] = [
  { label: "Food", icon: Utensils },
  { label: "Nature", icon: Trees },
  { label: "Photography", icon: Camera },
  { label: "Adventure", icon: Compass },
  { label: "Nightlife", icon: Music2 },
  { label: "Museums", icon: Landmark },
  { label: "Culture", icon: Landmark },
  { label: "Shopping", icon: ShoppingBag },
  { label: "Mountains", icon: Mountain },
  { label: "Beach", icon: Waves },
  { label: "Road Trip", icon: Car },
  { label: "Hidden Gems", icon: Gem },
  { label: "Local Experiences", icon: MapPin },
  { label: "Luxury", icon: Crown },
  { label: "Relaxation", icon: Sun },
  { label: "Kids Activities", icon: Baby },
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function computeDatesForMode(mode: DateMode, customStart?: string, customEnd?: string): TripDates {
  if (mode === "custom" && customStart && customEnd) {
    const nights = Math.max(
      1,
      Math.round((new Date(customEnd).getTime() - new Date(customStart).getTime()) / 86400000)
    );
    return { mode, startDate: customStart, endDate: customEnd, nights, label: "Custom trip" };
  }
  const preset = DATE_MODE_OPTIONS.find((d) => d.id === mode)!;
  const startOffset = mode === "weekend" ? 5 : mode === "week" ? 14 : 30;
  const startDate = addDaysISO(startOffset);
  const endDate = addDaysISO(startOffset + preset.nights);
  return { mode, startDate, endDate, nights: preset.nights, label: `${preset.label} trip` };
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Motion variants shared by every step (fade + slide + scale)         */
/* ------------------------------------------------------------------ */

const stepVariants: Variants = {
  enter: { opacity: 0, y: 24, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 28 } },
  exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.18 } },
};

/* ==================================================================
 * StepRail — animated timeline of steps with checkmarks
 * ================================================================== */

function StepRail({
  currentStep,
  completedSteps,
  onSelect,
}: {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onSelect: (step: WizardStep) => void;
}) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as WizardStep);
  const maxReachable = Math.max(currentStep, ...(completedSteps.length ? completedSteps : [1])) as WizardStep;

  return (
    <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isDone = completedSteps.includes(step);
        const isCurrent = step === currentStep;
        const isReachable = step <= maxReachable || isDone;

        return (
          <React.Fragment key={step}>
            <button
              disabled={!isReachable}
              onClick={() => isReachable && onSelect(step)}
              title={STEP_LABELS[step]}
              className={cn(
                "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                isCurrent && "border-transparent text-white",
                isDone && !isCurrent && "border-success/40 bg-success/12 text-success",
                !isDone && !isCurrent && isReachable && "border-border text-text-secondary hover:bg-surface",
                !isReachable && "border-border/60 text-muted opacity-50"
              )}
              style={isCurrent ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
            >
              {isDone && !isCurrent ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                step
              )}
            </button>
            {i < steps.length - 1 && (
              <span className="relative h-px w-6 shrink-0 bg-border">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-success/50"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ==================================================================
 * StepShell — shared chrome (title, subtitle, footer nav) for steps
 * ================================================================== */

function StepShell({
  icon: Icon,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  canContinue = true,
  continueLabel = "Continue",
  hideBack = false,
}: {
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
  continueLabel?: string;
  hideBack?: boolean;
}) {
  return (
    <PremiumCard variant="default" className="p-6 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl tracking-tight text-text md:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        </div>
      </div>

      {children}

      {(onBack || onContinue) && (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          {onBack && !hideBack ? (
            <SecondaryButton variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>
              Back
            </SecondaryButton>
          ) : (
            <span />
          )}
          {onContinue && (
            <PrimaryButton
              variant="gradient"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={onContinue}
              disabled={!canContinue}
            >
              {continueLabel}
            </PrimaryButton>
          )}
        </div>
      )}
    </PremiumCard>
  );
}

/* ==================================================================
 * Step 1 — Welcome
 * ================================================================== */

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <PremiumCard variant="default" className="relative overflow-hidden p-8 text-center md:p-14">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-70" aria-hidden />

      <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center md:h-48 md:w-48">
        <motion.span
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundImage: "var(--gradient-aurora)", opacity: 0.35 }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative flex h-32 w-32 items-center justify-center rounded-full text-white shadow-glow md:h-40 md:w-40"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <Globe2 className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.4} />
        </motion.div>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary/70"
            style={{ top: `${20 + i * 20}%`, left: `${10 + i * 30}%` }}
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          />
        ))}
      </div>

      <GreetingHeader
        name="Let's plan your next trip"
        subtitle="Tell Nova a little about where you want to go, and it'll build a full itinerary with you — one step at a time."
        className="mx-auto max-w-xl flex-col items-center text-center [&_p]:mx-auto"
      />

      <PrimaryButton
        variant="gradient"
        size="lg"
        icon={<Sparkles className="h-4 w-4" />}
        onClick={onStart}
        className="relative mt-8"
      >
        Start Planning
      </PrimaryButton>
    </PremiumCard>
  );
}

/* ==================================================================
 * Step 2 — Destination (React Leaflet + OpenStreetMap)
 * ================================================================== */

function MapController({ destination }: { destination: Destination | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (destination) {
      map.flyTo([destination.lat, destination.lng], 6, { duration: 1.1 });
    }
  }, [destination, map]);
  return null;
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DestinationStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const destination = useAppSelector(selectDestination);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Destination[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [satellite, setSatellite] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (query.length > 2) {
      // Use forward geocoding to search for locations
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        {
          headers: {
            "User-Agent": "Nova-Travel-Planner/1.0",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Geocoding response:", data);
          if (active && Array.isArray(data)) {
            const destinations: Destination[] = data.map((item: any) => ({
              id: `search-${item.place_id || item.osm_id}`,
              name: item.display_name.split(',')[0] || item.display_name,
              country: item.address?.country || "",
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));
            console.log("Mapped destinations:", destinations);
            setResults(destinations);
          }
        })
        .catch((error) => {
          console.error("Geocoding error:", error);
          if (active) setResults([]);
        });
    } else {
      if (active) setResults([]);
    }
    return () => {
      active = false;
    };
  }, [query]);

  async function pickDestination(d: Destination) {
    dispatch(setDestination(d));
    setQuery("");
    setShowResults(false);
  }

 async function pickCoordinates(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
      {
        headers: {
          "User-Agent": "Nova-Travel-Planner/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await response.json();

    const address = data.address ?? {};

    // Nominatim uses different keys depending on the place
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.hamlet ||
      address.county ||
      "";

    const state =
      address.state ||
      address.state_district ||
      address.region ||
      "";

    const country = address.country || "";

    const locationName = [city, state, country]
      .filter(Boolean)
      .join(", ");

    dispatch(
      setDestination({
        id: `custom-${lat.toFixed(6)}-${lng.toFixed(6)}`,
        name: locationName || data.display_name || "Selected Location",
        country,
       
        lat,
        lng,
      })
    );
  } catch (error) {
    console.error(error);
  }
}

  return (
    <StepShell
      icon={MapPin}
      title="Where to?"
      subtitle="Search a destination, or drop a pin anywhere on the map."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!destination}
    >
      <div className="relative mb-4 z-[1000]">
        <TextField
          icon={<Search className="h-4 w-4" />}
          placeholder="Search a city or country…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="glass-strong absolute z-[1001] mt-2 w-full overflow-hidden rounded-md border border-border shadow-float bg-card"
              style={{ position: "absolute" }}
            >
              {results.map((d) => (
                <button
                  key={d.id}
                  onClick={() => pickDestination(d)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-surface border-b border-border last:border-0"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  <span className="font-medium text-text">{d.name}</span>
                  <span className="text-muted">{d.country}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded-md border border-border z-0" onClick={() => setShowResults(false)}>
        <MapContainer center={[20, 10]} zoom={2} scrollWheelZoom className="h-full w-full" style={{ zIndex: 0 }}>
          <TileLayer
            key={satellite ? "sat" : "osm"}
            attribution={satellite ? "Tiles &copy; Esri" : "&copy; OpenStreetMap contributors"}
            url={
              satellite
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          <MapController destination={destination} />
          <MapClickHandler onPick={pickCoordinates} />
          {destination && (
            <Marker
              position={[destination.lat, destination.lng]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  pickCoordinates(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>

        <IconButton
          icon={satellite ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
          label={satellite ? "Show standard map" : "Show satellite view"}
          variant="glass"
          size="sm"
          onClick={() => setSatellite((s) => !s)}
          className="absolute right-3 top-3 z-[400]"
        />
      </div>

      <AnimatePresence>
        {destination && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
            <PremiumCard variant="glass" className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text">{destination.name}</p>
                <p className="truncate text-xs text-muted">
                  {destination.country} · {destination.lat.toFixed(2)}, {destination.lng.toFixed(2)}
                </p>
              </div>
              <Badge variant="primary">Selected</Badge>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}

/* ==================================================================
 * Step 3 — Trip Dates
 * ================================================================== */

function DatesStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const dates = useAppSelector(selectDates);
  const [customStart, setCustomStart] = React.useState(dates?.mode === "custom" ? dates.startDate : addDaysISO(30));
  const [customEnd, setCustomEnd] = React.useState(dates?.mode === "custom" ? dates.endDate : addDaysISO(35));

  function choose(mode: DateMode) {
    if (mode === "custom") {
      dispatch(setDates(computeDatesForMode("custom", customStart, customEnd)));
    } else {
      dispatch(setDates(computeDatesForMode(mode)));
    }
  }

  return (
    <StepShell
      icon={CalendarDays}
      title="When are you going?"
      subtitle="Pick a rhythm for the trip — you can fine-tune the exact days if you like."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!dates}
    >
      <AnimatedSection kind="stagger-children">
        <ContentGrid columns={4} gap="md">
          {DATE_MODE_OPTIONS.map((opt) => {
            const selected = dates?.mode === opt.id;
            return (
              <AnimatedItem key={opt.id}>
                <motion.button
                  onClick={() => choose(opt.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-1 rounded-md border p-4 text-left transition-colors",
                    selected ? "border-primary/40 bg-primary/8" : "border-border bg-surface hover:bg-card-elevated"
                  )}
                >
                  <span className="text-sm font-semibold text-text">{opt.label}</span>
                  <span className="text-xs text-muted">{opt.description}</span>
                </motion.button>
              </AnimatedItem>
            );
          })}
        </ContentGrid>
      </AnimatedSection>

      <AnimatePresence>
        {dates?.mode === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-2 gap-3 overflow-hidden"
          >
            <TextField
              type="date"
              label="Start date"
              value={customStart}
              onChange={(e) => {
                setCustomStart(e.target.value);
                dispatch(setDates(computeDatesForMode("custom", e.target.value, customEnd)));
              }}
            />
            <TextField
              type="date"
              label="End date"
              value={customEnd}
              onChange={(e) => {
                setCustomEnd(e.target.value);
                dispatch(setDates(computeDatesForMode("custom", customStart, e.target.value)));
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dates && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
            <Badge variant="primary" dot>
              {formatDateShort(dates.startDate)} – {formatDateShort(dates.endDate)} · {dates.nights} night
              {dates.nights === 1 ? "" : "s"}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}

/* ==================================================================
 * Step 4 — Travellers
 * ================================================================== */

function TravellersStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const travellers = useAppSelector(selectTravellers);

  function choose(type: TravellerType) {
    const opt = TRAVELLER_OPTIONS.find((o) => o.id === type)!;
    dispatch(setTravellers({ type, count: travellers?.type === type ? travellers.count : opt.defaultCount }));
  }

  function adjustCount(delta: number) {
    if (!travellers) return;
    dispatch(setTravellers({ ...travellers, count: Math.max(1, Math.min(20, travellers.count + delta)) }));
  }

  return (
    <StepShell
      icon={Users}
      title="Who's coming along?"
      subtitle="This helps Nova size the itinerary, stays, and budget correctly."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!travellers}
    >
      <AnimatedSection kind="stagger-children">
        <ContentGrid columns={3} gap="md">
          {TRAVELLER_OPTIONS.map((opt) => {
            const selected = travellers?.type === opt.id;
            return (
              <AnimatedItem key={opt.id}>
                <motion.button
                  onClick={() => choose(opt.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-2 rounded-md border p-4 text-left transition-colors",
                    selected ? "border-primary/40 bg-primary/8" : "border-border bg-surface hover:bg-card-elevated"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", selected ? "bg-primary/15 text-primary" : "bg-card text-text-secondary")}>
                    <opt.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-text">{opt.label}</span>
                  <span className="text-xs text-muted">{opt.description}</span>
                </motion.button>
              </AnimatedItem>
            );
          })}
        </ContentGrid>
      </AnimatedSection>

      <AnimatePresence>
        {travellers && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
            <PremiumCard variant="glass" className="flex items-center justify-between p-4">
              <span className="text-sm text-text-secondary">Group size</span>
              <div className="flex items-center gap-3">
                <IconButton icon={<Minus className="h-3.5 w-3.5" />} label="Decrease" size="sm" variant="glass" onClick={() => adjustCount(-1)} />
                <span className="w-6 text-center font-display text-lg text-text">{travellers.count}</span>
                <IconButton icon={<Plus className="h-3.5 w-3.5" />} label="Increase" size="sm" variant="glass" onClick={() => adjustCount(1)} />
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}

/* ==================================================================
 * Step 5 — Budget
 * ================================================================== */

function BudgetStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const budget = useAppSelector(selectBudget);
  const [tier, setTier] = React.useState<BudgetTier>(budget?.tier ?? "balanced");
  const [currency, setCurrency] = React.useState(budget?.currency ?? "USD");
  const activeTier = BUDGET_TIERS.find((t) => t.id === tier)!;
  const [amount, setAmount] = React.useState(budget?.amount ?? Math.round((activeTier.min + activeTier.max) / 2));

  function commit(nextTier: BudgetTier, nextAmount: number, nextCurrency: string) {
    dispatch(setBudget({ tier: nextTier, amount: nextAmount, currency: nextCurrency }));
  }

  function chooseTier(id: BudgetTier) {
    const t = BUDGET_TIERS.find((o) => o.id === id)!;
    const mid = Math.round((t.min + t.max) / 2);
    setTier(id);
    setAmount(mid);
    commit(id, mid, currency);
  }

  return (
    <StepShell
      icon={Wallet}
      title="What's your budget?"
      subtitle="A rough number is enough — Nova will fit the plan to it."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!budget}
    >
      <AnimatedSection kind="stagger-children">
        <ContentGrid columns={3} gap="md">
          {BUDGET_TIERS.map((t) => {
            const selected = tier === t.id;
            return (
              <AnimatedItem key={t.id}>
                <motion.button
                  onClick={() => chooseTier(t.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-2 rounded-md border p-4 text-left transition-colors",
                    selected ? "border-primary/40 bg-primary/8" : "border-border bg-surface hover:bg-card-elevated"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", selected ? "bg-primary/15 text-primary" : "bg-card text-text-secondary")}>
                    <t.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-text">{t.label}</span>
                  <span className="text-xs text-muted">{t.description}</span>
                </motion.button>
              </AnimatedItem>
            );
          })}
        </ContentGrid>
      </AnimatedSection>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_180px]">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-secondary">Estimated total spend</span>
            <span className="font-display text-lg text-text">{formatCurrency(amount, currency)}</span>
          </div>
          <input
            type="range"
            min={activeTier.min}
            max={activeTier.max}
            step={50}
            value={amount}
            onChange={(e) => {
              const next = Number(e.target.value);
              setAmount(next);
              commit(tier, next, currency);
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-pill bg-border accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{formatCurrency(activeTier.min, currency)}</span>
            <span>{formatCurrency(activeTier.max, currency)}</span>
          </div>
        </div>
        <Select
          label="Currency"
          options={CURRENCIES}
          value={currency}
          onChange={(v) => {
            setCurrency(v);
            commit(tier, amount, v);
          }}
        />
      </div>
    </StepShell>
  );
}

/* ==================================================================
 * Step 6 — Transportation
 * ================================================================== */

function TransportStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const transport = useAppSelector(selectTransport);

  return (
    <StepShell
      icon={Plane}
      title="How will you get there?"
      subtitle="Nova will factor this into timing and the budget breakdown."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!transport}
    >
      <AnimatedSection kind="stagger-children">
        <ContentGrid columns={3} gap="md">
          {TRANSPORT_OPTIONS.map((opt) => {
            const selected = transport === opt.id;
            return (
              <AnimatedItem key={opt.id}>
                <motion.button
                  onClick={() => dispatch(setTransport(opt.id))}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex h-full w-full flex-col items-start gap-2 overflow-hidden rounded-md border p-4 text-left transition-colors",
                    selected ? "border-transparent text-white" : "border-border bg-surface hover:bg-card-elevated"
                  )}
                  style={selected ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", selected ? "bg-white/20" : "bg-card text-text-secondary")}>
                    <opt.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className={cn("text-xs", selected ? "text-white/80" : "text-muted")}>{opt.description}</span>
                </motion.button>
              </AnimatedItem>
            );
          })}
        </ContentGrid>
      </AnimatedSection>
    </StepShell>
  );
}

/* ==================================================================
 * Step 7 — Accommodation
 * ================================================================== */

function AccommodationStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const accommodation = useAppSelector(selectAccommodation);

  function chooseType(type: AccommodationType) {
    dispatch(setAccommodation({ type, preferences: accommodation?.preferences ?? [] }));
  }

  function togglePreference(pref: string) {
    if (!accommodation) return;
    const preferences = accommodation.preferences.includes(pref)
      ? accommodation.preferences.filter((p) => p !== pref)
      : [...accommodation.preferences, pref];
    dispatch(setAccommodation({ ...accommodation, preferences }));
  }

  return (
    <StepShell
      icon={BedDouble}
      title="Where will you stay?"
      subtitle="Pick a style, then any preferences that matter to you."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!accommodation}
    >
      <AnimatedSection kind="stagger-children">
        <ContentGrid columns={3} gap="md">
          {ACCOMMODATION_OPTIONS.map((opt) => {
            const selected = accommodation?.type === opt.id;
            return (
              <AnimatedItem key={opt.id}>
                <motion.button
                  onClick={() => chooseType(opt.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-2 rounded-md border p-4 text-left transition-colors",
                    selected ? "border-primary/40 bg-primary/8" : "border-border bg-surface hover:bg-card-elevated"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", selected ? "bg-primary/15 text-primary" : "bg-card text-text-secondary")}>
                    <opt.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-text">{opt.label}</span>
                  <span className="text-xs text-muted">{opt.description}</span>
                </motion.button>
              </AnimatedItem>
            );
          })}
        </ContentGrid>
      </AnimatedSection>

      <AnimatePresence>
        {accommodation && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Preferences</p>
            <div className="flex flex-wrap gap-2">
              {ACCOMMODATION_PREFERENCES.map((pref) => (
                <Chip
                  key={pref}
                  label={pref}
                  selected={accommodation.preferences.includes(pref)}
                  onSelect={() => togglePreference(pref)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}

/* ==================================================================
 * Step 8 — Interests
 * ================================================================== */

function InterestsStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const dispatch = useAppDispatch();
  const interests = useAppSelector(selectInterests);

  return (
    <StepShell
      icon={Sparkles}
      title="What do you want more of on this trip?"
      subtitle="Pick as many as you like — Nova will weave them through the itinerary."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={interests.length > 0}
      continueLabel="Plan my trip"
    >
      <div className="flex flex-wrap gap-2.5">
        {INTEREST_OPTIONS.map((opt) => (
          <Chip
            key={opt.label}
            label={opt.label}
            icon={<opt.icon className="h-3.5 w-3.5" />}
            selected={interests.includes(opt.label)}
            onSelect={() => dispatch(toggleInterest(opt.label))}
          />
        ))}
      </div>
    </StepShell>
  );
}

/* ==================================================================
 * Step 9 — AI Planning (thinking animation)
 * ================================================================== */

function AIPlanningStep() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const itinerary = useAppSelector(selectItinerary);
  const [stageIndex, setStageIndex] = React.useState(0);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (!started.current && !itinerary) {
      started.current = true;
      dispatch(planTripWithAI());
    }
  }, [dispatch, itinerary]);

  React.useEffect(() => {
    if (!loading) return;
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, AI_THINKING_STAGES.length - 1));
    }, 480);
    return () => clearInterval(interval);
  }, [loading]);

  const progressPct = Math.round(((stageIndex + 1) / AI_THINKING_STAGES.length) * 100);

  return (
    <PremiumCard variant="default" className="relative overflow-hidden p-8 text-center md:p-14">
      <div className="pointer-events-none absolute inset-0 mesh-bg" aria-hidden />

      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary/50"
          style={{ top: `${10 + ((i * 37) % 80)}%`, left: `${5 + ((i * 53) % 90)}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}

      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundImage: "var(--gradient-aurora)", opacity: 0.25 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-glow"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 3, repeat: loading ? Infinity : 0, ease: "linear" }}
        >
          {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Sparkles className="h-7 w-7" />}
        </motion.div>
      </div>

      <h2 className="relative font-display text-2xl tracking-tight text-text">
        {error ? "Nova hit a snag" : "Nova is planning your trip"}
      </h2>

      {error ? (
        <div className="relative mt-6">
          <p className="mx-auto max-w-sm text-sm text-error">{error}</p>
          <PrimaryButton variant="gradient" className="mt-5" onClick={() => dispatch(planTripWithAI())}>
            Try again
          </PrimaryButton>
        </div>
      ) : (
        <>
          <div className="relative mx-auto mt-6 max-w-sm">
            <AnimatePresence mode="wait">
              <motion.p
                key={stageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-sm text-text-secondary"
              >
                {AI_THINKING_STAGES[stageIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-pill bg-surface">
              <motion.div
                className="h-full rounded-pill"
                style={{ backgroundImage: "var(--gradient-aurora)" }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="relative mx-auto mt-8 flex max-w-md flex-col gap-2 text-left">
            {AI_THINKING_STAGES.map((stage, i) => (
              <div key={stage} className={cn("flex items-center gap-2.5 text-xs", i <= stageIndex ? "text-text-secondary" : "text-muted/50")}>
                {i < stageIndex ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                ) : i === stageIndex && loading ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                )}
                {stage}
              </div>
            ))}
          </div>
        </>
      )}
    </PremiumCard>
  );
}

/* ==================================================================
 * Step 10 — Result: the generated trip dashboard
 * ================================================================== */

function ResultSection({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon?: typeof Sparkles;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <h3 className="text-base font-semibold text-text">{title}</h3>
        </div>
        {action}
      </div>
      {description && <p className="-mt-2 mb-4 text-sm text-text-secondary">{description}</p>}
      {children}
    </div>
  );
}

function ResultDashboard({ onSave, onReset, saving }: { onSave: () => void; onReset: () => void; saving: boolean }) {
  const itinerary = useAppSelector(selectItinerary);
  const summary = useAppSelector(selectTripSummary);

  if (!itinerary || !summary.destination || !summary.dates || !summary.budget) return null;

  const { destination, dates, budget } = summary;

  return (
    <AnimatedSection kind="stagger-children" className="space-y-8">
      {/* Hero */}
      <AnimatedItem>
        <PremiumCard variant="gradient" className="relative overflow-hidden text-white">
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="neutral" className="border-white/30 bg-white/15 text-white">
                Trip ready
              </Badge>
              <h2 className="mt-3 font-display text-3xl tracking-tight">{destination.name}</h2>
              <p className="mt-1 text-sm text-white/85">
                {destination.country} · {formatDateShort(dates.startDate)} – {formatDateShort(dates.endDate)} ·{" "}
                {dates.nights} night{dates.nights === 1 ? "" : "s"}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90">{itinerary.overview}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <SecondaryButton variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={onReset} icon={<RefreshCcw className="h-4 w-4" />}>
                Plan another trip
              </SecondaryButton>
              <PrimaryButton variant="solid" className="bg-white text-primary hover:brightness-95" onClick={onSave} loading={saving} icon={!saving ? <Check className="h-4 w-4" /> : undefined}>
                Save trip
              </PrimaryButton>
            </div>
          </div>
        </PremiumCard>
      </AnimatedItem>

      {/* Overview stats */}
      <AnimatedItem>
        <ContentGrid columns={4} gap="md">
          <StatCard label="Trip score" value={itinerary.tripScore} unit="/ 100" icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard
            label="Estimated cost"
            value={formatCurrency(itinerary.budgetEstimate.total, itinerary.budgetEstimate.currency)}
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatCard label="Trip length" value={dates.nights} unit="nights" icon={<CalendarDays className="h-4 w-4" />} />
          <StatCard label="Travel mood" value={itinerary.travelMood.split(" ")[0]} icon={<Sparkles className="h-4 w-4" />} />
        </ContentGrid>
      </AnimatedItem>

      {/* Budget estimate */}
      <AnimatedItem>
        <ResultSection title="Budget estimate" icon={Wallet} description={`Roughly ${formatCurrency(itinerary.budgetEstimate.total, itinerary.budgetEstimate.currency)} total, tuned to your ${budget.tier} budget.`}>
          <PremiumCard variant="default" className="space-y-4 p-5">
            {itinerary.budgetEstimate.breakdown.map((item) => {
              const pct = Math.round((item.amount / itinerary.budgetEstimate.total) * 100);
              return (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="font-medium text-text">{formatCurrency(item.amount, itinerary.budgetEstimate.currency)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-pill bg-surface">
                    <motion.div
                      className="h-full rounded-pill"
                      style={{ backgroundImage: "var(--gradient-aurora)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </PremiumCard>
        </ResultSection>
      </AnimatedItem>

      {/* Weather */}
      <AnimatedItem>
        <ResultSection title="Weather summary" icon={Sun}>
          <PremiumCard variant="glass" className="flex flex-wrap items-center gap-6 p-5">
            <div>
              <p className="font-display text-2xl text-text">{itinerary.weatherSummary.tempHighC}° / {itinerary.weatherSummary.tempLowC}°C</p>
              <p className="text-sm text-text-secondary">{itinerary.weatherSummary.condition}</p>
            </div>
            <Divider orientation="vertical" className="h-10" />
            <p className="max-w-md text-sm text-text-secondary">{itinerary.weatherSummary.advice}</p>
          </PremiumCard>
        </ResultSection>
      </AnimatedItem>

      {/* Daily timeline */}
      <AnimatedItem>
        <ResultSection title="Daily timeline" icon={CalendarDays} description="A day-by-day shape for the trip — treat it as a starting point.">
          <div className="space-y-4">
            {itinerary.dailyTimeline.map((day) => (
              <PremiumCard key={day.day} variant="default" className="p-5">
                <p className="mb-3 text-sm font-semibold text-text">
                  Day {day.day} · {day.title}
                </p>
                <div className="space-y-3">
                  {day.activities.map((activity) => {
                    const ActivityIcon = activity.icon === "Sunrise" ? Sunrise : activity.icon === "Moon" ? Moon : Compass;
                    return (
                      <div key={activity.time} className="flex items-start gap-3">
                        <span className="mt-0.5 w-12 shrink-0 text-xs font-medium text-muted">{activity.time}</span>
                        <ActivityIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm text-text-secondary">{activity.description}</p>
                      </div>
                    );
                  })}
                </div>
              </PremiumCard>
            ))}
          </div>
        </ResultSection>
      </AnimatedItem>

      {/* Places to visit */}
      <AnimatedItem>
        <ResultSection title="Places to visit" icon={Landmark}>
          <ContentGrid columns={3} gap="md">
            {itinerary.placesToVisit.map((place) => (
              <PremiumCard key={place.name} variant="outlined" className="p-4">
                <Badge variant="neutral" className="mb-2">{place.category}</Badge>
                <p className="text-sm font-semibold text-text">{place.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{place.description}</p>
              </PremiumCard>
            ))}
          </ContentGrid>
        </ResultSection>
      </AnimatedItem>

      {/* Restaurants */}
      <AnimatedItem>
        <ResultSection title="Recommended restaurants" icon={Utensils}>
          <ContentGrid columns={3} gap="md">
            {itinerary.restaurants.map((r) => (
              <PremiumCard key={r.name} variant="outlined" className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="neutral">{r.cuisine}</Badge>
                  <span className="text-xs font-medium text-muted">{r.priceRange}</span>
                </div>
                <p className="text-sm font-semibold text-text">{r.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{r.description}</p>
              </PremiumCard>
            ))}
          </ContentGrid>
        </ResultSection>
      </AnimatedItem>

      {/* Packing checklist + Important tips */}
      <AnimatedItem>
        <div className="grid gap-6 md:grid-cols-2">
          <ResultSection title="Packing checklist" icon={Backpack}>
            <PremiumCard variant="default" className="space-y-2.5 p-5">
              {itinerary.packingChecklist.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </PremiumCard>
          </ResultSection>

          <ResultSection title="Important tips" icon={Info}>
            <PremiumCard variant="glass" className="space-y-2.5 p-5">
              {itinerary.importantTips.map((tip) => (
                <div key={tip} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  {tip}
                </div>
              ))}
            </PremiumCard>
          </ResultSection>
        </div>
      </AnimatedItem>

      {/* Travel timeline (trip phases) */}
      <AnimatedItem>
        <ResultSection title="Travel timeline" icon={CalendarDays}>
          <PremiumCard variant="default" className="p-5">
            <div className="flex flex-col gap-0 sm:flex-row sm:items-center sm:justify-between">
              {[
                { label: "Plan & book", date: "Now" },
                { label: "Depart", date: formatDateShort(dates.startDate) },
                { label: `${dates.nights} nights in ${destination.name}`, date: "" },
                { label: "Return home", date: formatDateShort(dates.endDate) },
              ].map((phase, i, arr) => (
                <React.Fragment key={phase.label}>
                  <div className="flex items-center gap-2.5 py-2 sm:flex-col sm:items-start sm:py-0">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundImage: "var(--gradient-aurora)" }} />
                    <div>
                      <p className="text-sm font-medium text-text">{phase.label}</p>
                      {phase.date && <p className="text-xs text-muted">{phase.date}</p>}
                    </div>
                  </div>
                  {i < arr.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
                </React.Fragment>
              ))}
            </div>
          </PremiumCard>
        </ResultSection>
      </AnimatedItem>

      {/* Quick facts + emergency contacts */}
      <AnimatedItem>
        <div className="grid gap-6 md:grid-cols-2">
          <ResultSection title="Quick facts" icon={Info}>
            <PremiumCard variant="default" className="grid grid-cols-2 gap-4 p-5">
              {itinerary.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <p className="text-xs text-muted">{fact.label}</p>
                  <p className="mt-0.5 text-sm font-medium capitalize text-text">{fact.value}</p>
                </div>
              ))}
            </PremiumCard>
          </ResultSection>

          <ResultSection title="Emergency contacts" icon={Phone}>
            <PremiumCard variant="default" className="space-y-3 p-5">
              {itinerary.emergencyContacts.map((c) => (
                <div key={c.label} className="flex items-start gap-2.5 text-sm">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  <div>
                    <p className="font-medium text-text">{c.label}</p>
                    <p className="text-xs text-text-secondary">{c.value}</p>
                  </div>
                </div>
              ))}
            </PremiumCard>
          </ResultSection>
        </div>
      </AnimatedItem>

      {/* Map preview */}
      <AnimatedItem>
        <ResultSection title="Map preview" icon={MapPin}>
          <div className="h-64 overflow-hidden rounded-md border border-border">
            <MapContainer
              center={[destination.lat, destination.lng]}
              zoom={10}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              className="h-full w-full"
            >
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[destination.lat, destination.lng]} icon={markerIcon} />
            </MapContainer>
          </div>
        </ResultSection>
      </AnimatedItem>

      {/* AI recommendations */}
      <AnimatedItem>
        <ResultSection title="AI recommendations" icon={Sparkles}>
          <PremiumCard variant="glass" className="space-y-3 p-5">
            {itinerary.aiRecommendations.map((rec) => (
              <div key={rec} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {rec}
              </div>
            ))}
          </PremiumCard>
        </ResultSection>
      </AnimatedItem>
    </AnimatedSection>
  );
}

/* ==================================================================
 * Sidebar — progress, completed steps, live trip summary, quick edits
 * ================================================================== */

function TravelSidebar({ onEdit }: { onEdit: (step: WizardStep) => void }) {
  const progress = useAppSelector(selectProgressPercent);
  const completedSteps = useAppSelector(selectCompletedSteps);
  const summary = useAppSelector(selectTripSummary);

  const summaryRows: { step: WizardStep; label: string; value: string; icon: typeof MapPin }[] = [
    { step: 2, label: "Destination", value: summary.destination ? `${summary.destination.name}, ${summary.destination.country}` : "Not set", icon: MapPin },
    { step: 3, label: "Dates", value: summary.dates ? `${formatDateShort(summary.dates.startDate)} – ${formatDateShort(summary.dates.endDate)}` : "Not set", icon: CalendarDays },
    { step: 4, label: "Travellers", value: summary.travellers ? `${summary.travellers.count} · ${summary.travellers.type}` : "Not set", icon: Users },
    { step: 5, label: "Budget", value: summary.budget ? `${formatCurrency(summary.budget.amount, summary.budget.currency)} · ${summary.budget.tier}` : "Not set", icon: Wallet },
    { step: 6, label: "Transport", value: summary.transport ?? "Not set", icon: Plane },
    { step: 7, label: "Stay", value: summary.accommodation?.type.replace("-", " ") ?? "Not set", icon: BedDouble },
  ];

  return (
    <div className="sticky top-4 space-y-4">
      <PremiumCard variant="default" className="p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-text">Trip progress</span>
          <span className="text-muted">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-pill bg-surface">
          <motion.div
            className="h-full rounded-pill"
            style={{ backgroundImage: "var(--gradient-aurora)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">{completedSteps.length} of {TOTAL_STEPS} steps completed</p>
      </PremiumCard>

      <PremiumCard variant="default" className="p-5">
        <p className="mb-3 text-sm font-medium text-text">Trip summary</p>
        <div className="space-y-3">
          {summaryRows.map((row) => (
            <button
              key={row.label}
              onClick={() => onEdit(row.step)}
              className="group flex w-full items-center gap-2.5 rounded-sm px-1 py-1 text-left transition-colors hover:bg-surface"
            >
              <row.icon className="h-3.5 w-3.5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted">{row.label}</p>
                <p className="truncate text-sm capitalize text-text">{row.value}</p>
              </div>
              <Edit3 className="h-3 w-3 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </PremiumCard>

      {summary.interests.length > 0 && (
        <PremiumCard variant="default" className="p-5">
          <p className="mb-3 text-sm font-medium text-text">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {summary.interests.map((i) => (
              <Badge key={i} variant="primary">{i}</Badge>
            ))}
          </div>
        </PremiumCard>
      )}
    </div>
  );
}

/* ==================================================================
 * Main page
 * ================================================================== */

export default function TravelPlanner() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const completedSteps = useAppSelector(selectCompletedSteps);
  const canAdvance = useAppSelector(selectCanAdvance);
  const saving = useAppSelector(selectSaving);

  function goBack() {
    dispatch(previousStep());
  }
  function goNext() {
    if (canAdvance) dispatch(nextStep());
  }
  function editStepAndJump(step: WizardStep) {
    dispatch(goToStep(step));
  }
  function handleReset() {
    dispatch(resetTravelPlanner());
  }
  function handleSave() {
    dispatch(saveTrip());
  }

  const stepContent = (() => {
    switch (currentStep) {
      case 2:
        return <DestinationStep onBack={goBack} onContinue={goNext} />;
      case 3:
        return <DatesStep onBack={goBack} onContinue={goNext} />;
      case 4:
        return <TravellersStep onBack={goBack} onContinue={goNext} />;
      case 5:
        return <BudgetStep onBack={goBack} onContinue={goNext} />;
      case 6:
        return <TransportStep onBack={goBack} onContinue={goNext} />;
      case 7:
        return <AccommodationStep onBack={goBack} onContinue={goNext} />;
      case 8:
        return <InterestsStep onBack={goBack} onContinue={goNext} />;
      case 9:
        return <AIPlanningStep />;
      case 10:
        return <ResultDashboard onSave={handleSave} onReset={handleReset} saving={saving} />;
      default:
        return null;
    }
  })();

  return (
    <AppShell
      pageTitle="Travel Planner"
      activeRoute="travel"
      onNavigate={() => {}}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
    >
      <PageContainer>
        {currentStep === 1 ? (
          <PageSection animate={false}>
            <WelcomeStep onStart={() => dispatch(nextStep())} />
          </PageSection>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-6">
              {currentStep <= 9 && (
                <PageSection animate={false}>
                  <StepRail currentStep={currentStep} completedSteps={completedSteps} onSelect={editStepAndJump} />
                </PageSection>
              )}

              <AnimatePresence mode="wait">
                <motion.div key={currentStep} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  {stepContent}
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="hidden lg:block">
              <TravelSidebar onEdit={editStepAndJump} />
            </aside>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}