"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Train,
  Car,
  Bus,
  Home,
  Building,
  Mountain,
  Utensils,
  Camera,
  Music,
  ShoppingBag,
  Coffee,
  Waves,
  TreePine,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RefreshCw,
  Clock,
  Star,
  Sun,
  Cloud,
  Phone,
  Info,
  Luggage,
  Heart,
  Zap,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { AppShell } from "../components/layout/AppShell";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { StatCard } from "@/components/cards/StatCard";
import {
  setCurrentStep,
  completeStep,
  setDestination,
  setDates,
  setTravellers,
  setBudget,
  setTransport,
  setAccommodation,
  toggleInterest,
  setInterests,
  setCurrentThinkingStep,
  generateTravelPlan,
  getThinkingSteps,
  resetTravel,
  clearSuccess,
  clearError,
} from "../redux/travelSlice";
import {
  selectCurrentStep,
  selectCompletedSteps,
  selectDestination,
  selectDates,
  selectTravellers,
  selectBudget,
  selectTransport,
  selectAccommodation,
  selectInterests,
  selectTravelPlan,
  selectThinkingSteps,
  selectCurrentThinkingStep,
  selectTravelLoading,
  selectTravelError,
  selectTravelSuccess,
} from "../redux/travelSlice";
import type { RootState } from "../store/store";
import type { TravelStep } from "../redux/travelSlice";
import type { Destination } from "../services/travelService";

const steps: { id: TravelStep; label: string; icon: any }[] = [
  { id: "welcome", label: "Welcome", icon: Globe },
  { id: "destination", label: "Destination", icon: MapPin },
  { id: "dates", label: "Dates", icon: Calendar },
  { id: "travellers", label: "Travellers", icon: Users },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "transport", label: "Transport", icon: Plane },
  { id: "accommodation", label: "Accommodation", icon: Home },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "planning", label: "AI Planning", icon: Sparkles },
  { id: "result", label: "Your Trip", icon: Check },
];

const interestOptions = [
  { id: "food", label: "Food", icon: Utensils },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "nightlife", label: "Nightlife", icon: Music },
  { id: "museums", label: "Museums", icon: Building },
  { id: "culture", label: "Culture", icon: Coffee },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "relaxation", label: "Relaxation", icon: Sun },
];

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function TravelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [route, setRoute] = useState("travel");

  const currentStep = useSelector(selectCurrentStep);
  const completedSteps = useSelector(selectCompletedSteps);
  const destination = useSelector(selectDestination);
  const dates = useSelector(selectDates);
  const travellers = useSelector(selectTravellers);
  const budget = useSelector(selectBudget);
  const transport = useSelector(selectTransport);
  const accommodation = useSelector(selectAccommodation);
  const interests = useSelector(selectInterests);
  const travelPlan = useSelector(selectTravelPlan);
  const thinkingSteps = useSelector(selectThinkingSteps);
  const currentThinkingStep = useSelector(selectCurrentThinkingStep);
  const loading = useSelector(selectTravelLoading);
  const error = useSelector(selectTravelError);
  const success = useSelector(selectTravelSuccess);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatePreset, setSelectedDatePreset] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [showMap, setShowMap] = useState(true);
  const [customLocationName, setCustomLocationName] = useState("");
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Custom marker icon
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${isSelected ? `
            <div style="
              position: absolute;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: rgba(99, 102, 241, 0.3);
              animation: pulse 2s infinite;
            "></div>
          ` : ''}
          <div style="
            width: ${isSelected ? '20px' : '12px'};
            height: ${isSelected ? '20px' : '12px'};
            border-radius: 50%;
            background: ${isSelected ? '#6366f1' : '#94a3b8'};
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        </style>
      `,
      iconSize: [isSelected ? 20 : 12, isSelected ? 20 : 12],
      iconAnchor: [isSelected ? 10 : 6, isSelected ? 10 : 6],
    });
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      dispatch(completeStep(currentStep));
      dispatch(setCurrentStep(steps[currentIndex + 1].id));
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      dispatch(setCurrentStep(steps[currentIndex - 1].id));
    }
  };

  const handleStartPlanning = () => {
    dispatch(setCurrentStep("destination"));
  };

  const handleDestinationSelect = (dest: Destination) => {
    dispatch(setDestination(dest));
    setMapCenter([dest.coordinates.lat, dest.coordinates.lng]);
    setMapZoom(4);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setClickedCoordinates({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(6);

    // Reverse geocoding to get location name
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Nova-Travel-Planner/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.address) {
        // Build location name from address components
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "";
        const country = data.address.country || "";
        const locationName = city && country ? `${city}, ${country}` : city || country || "Selected Location";
        setCustomLocationName(locationName);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handleConfirmLocation = () => {
    if (clickedCoordinates && customLocationName) {
      const customDestination: Destination = {
        id: `custom-${Date.now()}`,
        name: customLocationName,
        country: customLocationName.split(", ").pop() || "Custom Location",
        coordinates: clickedCoordinates,
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        description: `Custom destination at ${clickedCoordinates.lat.toFixed(2)}°, ${clickedCoordinates.lng.toFixed(2)}°`,
      };
      dispatch(setDestination(customDestination));
    }
  };

  const handleDatePreset = (preset: string) => {
    setSelectedDatePreset(preset);
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case "weekend":
        start = new Date(today.setDate(today.getDate() + (6 - today.getDay()) % 7));
        end = new Date(start);
        end.setDate(end.getDate() + 2);
        break;
      case "week":
        start = new Date(today.setDate(today.getDate() + 7));
        end = new Date(start);
        end.setDate(end.getDate() + 7);
        break;
      case "month":
        start = new Date(today.setDate(today.getDate() + 14));
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        break;
      default:
        break;
    }

    dispatch(setDates({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    }));
  };

  const handleGeneratePlan = () => {
    if (!destination) return;
    dispatch(getThinkingSteps() as any).then(() => {
      dispatch(setCurrentStep("planning"));
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < 7) {
          dispatch(setCurrentThinkingStep(stepIndex));
          stepIndex++;
        } else {
          clearInterval(interval);
          dispatch(generateTravelPlan({
            destination,
            dates,
            travellers,
            budget,
            transport,
            accommodation,
            interests,
          }) as any);
        }
      }, 500);
    });
  };

  const handleReset = () => {
    dispatch(resetTravel());
  };

  const getStepProgress = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <AppShell
      pageTitle="Travel Planner"
      activeRoute={route}
      onNavigate={setRoute}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
      onQuickAdd={() => {}}
      notifications={[]}
    >
      <PageContainer>
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center gap-2"
            >
              <Zap className="h-5 w-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <ContentGrid columns={4} gap="lg">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PremiumCard className="p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">Planning Progress</h3>
              <div className="mb-4">
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getStepProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2">{Math.round(getStepProgress())}% Complete</p>
              </div>

              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = currentStep === step.id;
                  const isAccessible = index === 0 || completedSteps.includes(steps[index - 1].id);

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isCurrent
                            ? "bg-indigo-500/20 text-indigo-400"
                            : isAccessible
                            ? "bg-slate-700/50 text-slate-500"
                            : "bg-slate-800/30 text-slate-600"
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span
                        className={`text-sm ${
                          isCurrent ? "text-white font-medium" : isAccessible ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </nav>

              {destination && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Trip Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-400">{destination.name}</span>
                    </div>
                    {dates.start && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-400">{dates.duration} days</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-400">{budget.currency} {budget.amount}</span>
                    </div>
                  </div>
                </div>
              )}

              <SecondaryButton onClick={handleReset} className="w-full mt-6">
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Over
              </SecondaryButton>
            </PremiumCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Welcome Step */}
              {currentStep === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-12 text-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10"
                    >
                      <Globe className="w-full h-full text-indigo-500" />
                    </motion.div>
                    <div className="relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                      >
                        <Globe className="h-12 w-12 text-white" />
                      </motion.div>
                      <h1 className="text-4xl font-bold text-white mb-4">Travel Planner</h1>
                      <p className="text-xl text-slate-400 mb-2">Let Nova plan your perfect trip</p>
                      <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Tell us about your dream destination, preferences, and budget. Our AI will create a personalized itinerary just for you.
                      </p>
                      <PrimaryButton onClick={handleStartPlanning} size="lg" className="text-lg px-8 py-4">
                        Start Planning
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </PrimaryButton>
                    </div>
                  </PremiumCard>

                  <ContentGrid columns={3} gap="md">
                    {[
                      { icon: Sparkles, label: "AI-Powered", desc: "Smart recommendations" },
                      { icon: Clock, label: "Time-Saving", desc: "Instant itineraries" },
                      { icon: Heart, label: "Personalized", desc: "Tailored to you" },
                    ].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <PremiumCard className="p-6 text-center">
                            <Icon className="h-8 w-8 mx-auto mb-3 text-indigo-400" />
                            <h3 className="text-white font-medium mb-1">{feature.label}</h3>
                            <p className="text-sm text-slate-400">{feature.desc}</p>
                          </PremiumCard>
                        </motion.div>
                      );
                    })}
                  </ContentGrid>
                </motion.div>
              )}

              {/* Destination Step */}
              {currentStep === "destination" && (
                <motion.div
                  key="destination"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Where do you want to go?</h2>
                    <p className="text-slate-400 mb-6">Click anywhere on the map to select your destination</p>

                    {/* Location Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Location Name</label>
                      <input
                        type="text"
                        placeholder="Enter destination name (e.g., Paris, Tokyo, My Beach House)"
                        value={customLocationName}
                        onChange={(e) => setCustomLocationName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    {/* Interactive Map */}
                    <div className="relative mb-6 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/50" style={{ height: "400px" }}>
                      <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: "100%", width: "100%", background: "#1e293b" }}
                        zoomControl={false}
                      >
                        <MapClickHandler onMapClick={handleMapClick} />
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {clickedCoordinates && (
                          <Marker
                            position={[clickedCoordinates.lat, clickedCoordinates.lng]}
                            icon={createCustomIcon(true)}
                          >
                            <Popup>
                              <div className="text-slate-900">
                                <h3 className="font-bold">{customLocationName || "Selected Location"}</h3>
                                <p className="text-sm">
                                  {clickedCoordinates.lat.toFixed(4)}°, {clickedCoordinates.lng.toFixed(4)}°
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>

                      {/* Map Controls */}
                      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                        <button
                          onClick={() => setMapZoom(Math.min(mapZoom + 1, 6))}
                          className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 text-white flex items-center justify-center hover:bg-slate-700/80 transition-colors"
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                        <button
                          onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
                          className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 text-white flex items-center justify-center hover:bg-slate-700/80 transition-colors"
                        >
                          <span className="text-lg font-bold">-</span>
                        </button>
                      </div>

                      {/* Zoom indicator */}
                      <div className="absolute bottom-4 left-4 z-[1000] px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-400 text-sm">
                        Zoom: {mapZoom}x
                      </div>

                      {/* Click instruction */}
                      <div className="absolute top-4 left-4 z-[1000] px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm">
                        Click on map to select location
                      </div>
                    </div>

                    {/* Selected Location Info */}
                    {clickedCoordinates && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">
                              {customLocationName || "Unnamed Location"}
                            </h3>
                            <p className="text-sm text-slate-400">
                              Coordinates: {clickedCoordinates.lat.toFixed(4)}°, {clickedCoordinates.lng.toFixed(4)}°
                            </p>
                          </div>
                          <PrimaryButton
                            onClick={handleConfirmLocation}
                            disabled={!customLocationName}
                            size="sm"
                          >
                            Confirm Location
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}

                    {destination && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="h-6 w-6 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{destination.name}</h3>
                            <p className="text-sm text-slate-400">{destination.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep} disabled={steps.findIndex(s => s.id === currentStep) === 0}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep} disabled={!destination}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Dates Step */}
              {currentStep === "dates" && (
                <motion.div
                  key="dates"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">When are you traveling?</h2>
                    <p className="text-slate-400 mb-6">Select your travel dates</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: "weekend", label: "Weekend", desc: "2-3 days" },
                        { id: "week", label: "Week", desc: "7 days" },
                        { id: "month", label: "Month", desc: "30 days" },
                      ].map((preset) => (
                        <motion.button
                          key={preset.id}
                          onClick={() => handleDatePreset(preset.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedDatePreset === preset.id
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-700/50 hover:border-slate-600"
                          }`}
                        >
                          <h3 className="text-white font-semibold">{preset.label}</h3>
                          <p className="text-sm text-slate-400">{preset.desc}</p>
                        </motion.button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={dates.start}
                          onChange={(e) => dispatch(setDates({ ...dates, start: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                        <input
                          type="date"
                          value={dates.end}
                          onChange={(e) => dispatch(setDates({ ...dates, end: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    {dates.duration > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <p className="text-emerald-400 font-semibold">{dates.duration} days trip</p>
                      </motion.div>
                    )}
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep} disabled={!dates.start || !dates.end}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Travellers Step */}
              {currentStep === "travellers" && (
                <motion.div
                  key="travellers"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Who's traveling?</h2>
                    <p className="text-slate-400 mb-6">Select your travel group</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { id: "solo", label: "Solo", icon: Users, count: 1 },
                        { id: "couple", label: "Couple", icon: Heart, count: 2 },
                        { id: "family", label: "Family", icon: Home, count: 4 },
                        { id: "friends", label: "Friends", icon: Sparkles, count: 3 },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => dispatch(setTravellers({ type: option.id, count: option.count }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              travellers.type === option.id
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-slate-700/50 hover:border-slate-600"
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-3 ${travellers.type === option.id ? "text-indigo-400" : "text-slate-500"}`} />
                            <h3 className="text-white font-semibold">{option.label}</h3>
                            <p className="text-sm text-slate-400">{option.count} person{option.count > 1 ? "s" : ""}</p>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Custom Count</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={travellers.count}
                        onChange={(e) => dispatch(setTravellers({ ...travellers, count: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Budget Step */}
              {currentStep === "budget" && (
                <motion.div
                  key="budget"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">What's your budget?</h2>
                    <p className="text-slate-400 mb-6">Set your spending preferences</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: "budget", label: "Budget", amount: 1000, color: "text-emerald-400" },
                        { id: "balanced", label: "Balanced", amount: 2000, color: "text-amber-400" },
                        { id: "luxury", label: "Luxury", amount: 5000, color: "text-purple-400" },
                      ].map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => dispatch(setBudget({ ...budget, level: option.id, amount: option.amount }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            budget.level === option.id
                              ? "border-indigo-500 bg-indigo-500/10"
                             : "border-slate-700/50 hover:border-slate-600"
                          }`}
                        >
                          <DollarSign className={`h-8 w-8 mx-auto mb-3 ${budget.level === option.id ? option.color : "text-slate-500"}`} />
                          <h3 className="text-white font-semibold">{option.label}</h3>
                          <p className="text-sm text-slate-400">${option.amount}</p>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Custom Amount: ${budget.amount}</label>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="100"
                        value={budget.amount}
                        onChange={(e) => dispatch(setBudget({ ...budget, amount: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                      <select
                        value={budget.currency}
                        onChange={(e) => dispatch(setBudget({ ...budget, currency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Transport Step */}
              {currentStep === "transport" && (
                <motion.div
                  key="transport"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">How will you travel?</h2>
                    <p className="text-slate-400 mb-6">Choose your transportation</p>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "flight", label: "Flight", icon: Plane, desc: "Fastest option" },
                        { id: "train", label: "Train", icon: Train, desc: "Scenic route" },
                        { id: "road", label: "Road Trip", icon: Car, desc: "Freedom to explore" },
                        { id: "bus", label: "Bus", icon: Bus, desc: "Budget friendly" },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => dispatch(setTransport(option.id))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              transport === option.id
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-slate-700/50 hover:border-slate-600"
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-3 ${transport === option.id ? "text-indigo-400" : "text-slate-500"}`} />
                            <h3 className="text-white font-semibold">{option.label}</h3>
                            <p className="text-sm text-slate-400">{option.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep} disabled={!transport}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Accommodation Step */}
              {currentStep === "accommodation" && (
                <motion.div
                  key="accommodation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Where will you stay?</h2>
                    <p className="text-slate-400 mb-6">Choose your accommodation type</p>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "hotel", label: "Hotel", icon: Building, desc: "Full service" },
                        { id: "hostel", label: "Hostel", icon: Home, desc: "Budget friendly" },
                        { id: "apartment", label: "Apartment", icon: Building, desc: "Like home" },
                        { id: "resort", label: "Resort", icon: Sun, desc: "All inclusive" },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => dispatch(setAccommodation(option.id))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              accommodation === option.id
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-slate-700/50 hover:border-slate-600"
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-3 ${accommodation === option.id ? "text-indigo-400" : "text-slate-500"}`} />
                            <h3 className="text-white font-semibold">{option.label}</h3>
                            <p className="text-sm text-slate-400">{option.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleNextStep} disabled={!accommodation}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Interests Step */}
              {currentStep === "interests" && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">What are you interested in?</h2>
                    <p className="text-slate-400 mb-6">Select your interests (multiple)</p>

                    <div className="flex flex-wrap gap-3">
                      {interestOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = interests.includes(option.id);
                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => dispatch(toggleInterest(option.id))}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                                : "border-slate-700/50 text-slate-400 hover:border-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </motion.button>
                        );
                      })}
                    </div>

                    {interests.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                      >
                        <p className="text-indigo-300 font-semibold">{interests.length} interests selected</p>
                      </motion.div>
                    )}
                  </PremiumCard>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleGeneratePlan}>
                      Generate Plan
                      <Sparkles className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}

              {/* Planning Step */}
              {currentStep === "planning" && (
                <motion.div
                  key="planning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <PremiumCard className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                    >
                      <Sparkles className="h-12 w-12 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-4">Nova is planning your trip...</h2>
                    
                    <div className="space-y-3 max-w-md mx-auto">
                      {thinkingSteps.map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.5 }}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            index <= currentThinkingStep
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "bg-slate-800/30 text-slate-500"
                          }`}
                        >
                          {index < currentThinkingStep ? (
                            <Check className="h-5 w-5" />
                          ) : index === currentThinkingStep ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </PremiumCard>
                </motion.div>
              )}

              {/* Result Step */}
              {currentStep === "result" && travelPlan && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Overview */}
                  <PremiumCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Your Trip to {travelPlan.destination.name}</h2>
                        <p className="text-slate-400">{travelPlan.dates.duration} days • {travelPlan.travellers.count} traveller{travelPlan.travellers.count > 1 ? "s" : ""}</p>
                      </div>
                      <div className="text-right">
                        <StatCard label="Trip Score" value={`${travelPlan.overview.tripScore}/100`} />
                      </div>
                    </div>

                    <ContentGrid columns={3} gap="md">
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <DollarSign className="h-5 w-5 text-emerald-400 mb-2" />
                        <p className="text-sm text-slate-400">Total Cost</p>
                        <p className="text-xl font-bold text-white">{travelPlan.budget.currency} {travelPlan.overview.totalCost}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <Sun className="h-5 w-5 text-amber-400 mb-2" />
                        <p className="text-sm text-slate-400">Weather</p>
                        <p className="text-xl font-bold text-white">{travelPlan.overview.weather.temp}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <Heart className="h-5 w-5 text-rose-400 mb-2" />
                        <p className="text-sm text-slate-400">Travel Mood</p>
                        <p className="text-xl font-bold text-white">{travelPlan.overview.travelMood}</p>
                      </div>
                    </ContentGrid>
                  </PremiumCard>

                  {/* Daily Itinerary */}
                  <PremiumCard className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Daily Itinerary</h3>
                    <div className="space-y-4">
                      {travelPlan.itinerary.map((day) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: day.day * 0.1 }}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold">Day {day.day} • {day.date}</h4>
                          </div>
                          <div className="space-y-2">
                            {day.activities.map((activity) => (
                              <div key={activity.id} className="flex items-start gap-3 text-sm">
                                <Clock className="h-4 w-4 text-slate-500 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-white">{activity.name}</p>
                                  <p className="text-slate-400">{activity.time} • {activity.duration}</p>
                                </div>
                                <span className="text-slate-400">{activity.cost > 0 ? `$${activity.cost}` : "Free"}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </PremiumCard>

                  {/* Recommendations */}
                  <ContentGrid columns={2} gap="lg">
                    <PremiumCard className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Places to Visit</h3>
                      <div className="space-y-3">
                        {travelPlan.recommendations.places.map((place, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                            <Star className="h-5 w-5 text-amber-400 mt-0.5" />
                            <div>
                              <p className="text-white font-medium">{place.name}</p>
                              <p className="text-sm text-slate-400">{place.category} • {place.visitTime}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Packing Checklist</h3>
                      <div className="space-y-2">
                        {travelPlan.recommendations.packingList.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <Luggage className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </ContentGrid>

                  <div className="flex justify-between">
                    <SecondaryButton onClick={handlePreviousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </SecondaryButton>
                    <PrimaryButton onClick={handleReset}>
                      Plan Another Trip
                      <RefreshCw className="h-4 w-4 ml-2" />
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ContentGrid>
      </PageContainer>
    </AppShell>
  );
}
