"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Clock,
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Bell,
  Shield,
  Lock,
  Key,
  Smartphone,
  Database,
  HardDrive,
  Cloud,
  RefreshCw,
  Download,
  Trash2,
  Info,
  ExternalLink,
  Check,
  X,
  ChevronRight,
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
  loadSettings,
  updateProfile,
  updateAppearance,
  updateAIPreferences,
  updateNotifications,
  updatePrivacy,
  updateSecurity,
  toggleIntegration,
  updateBackup,
  performManualBackup,
  resetSettings,
  exportData,
  deleteAccount,
  clearSuccess,
  clearError,
  setProfile,
  setAppearance,
  setAIPreferences,
  setNotifications,
  setPrivacy,
  setSecurity,
  setBackup,
} from "../redux/settingsSlice";
import {
  selectSettings,
  selectSettingsLoading,
  selectSettingsSaving,
  selectSettingsError,
  selectSettingsSuccess,
  selectProfile,
  selectAppearance,
  selectAIPreferences,
  selectNotifications,
  selectPrivacy,
  selectSecurity,
  selectIntegrations,
  selectBackup,
  selectStorage,
  selectAbout,
} from "../redux/settingsSlice";
import type { RootState } from "../store/store";

type SettingsSection = "profile" | "appearance" | "ai" | "notifications" | "privacy" | "security" | "integrations" | "backup" | "storage" | "about";

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [route, setRoute] = useState("settings");
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [editProfile, setEditProfile] = useState(false);

  const settings = useSelector(selectSettings);
  const loading = useSelector(selectSettingsLoading);
  const saving = useSelector(selectSettingsSaving);
  const error = useSelector(selectSettingsError);
  const success = useSelector(selectSettingsSuccess);

  const profile = useSelector(selectProfile);
  const appearance = useSelector(selectAppearance);
  const aiPreferences = useSelector(selectAIPreferences);
  const notifications = useSelector(selectNotifications);
  const privacy = useSelector(selectPrivacy);
  const security = useSelector(selectSecurity);
  const integrations = useSelector(selectIntegrations);
  const backup = useSelector(selectBackup);
  const storage = useSelector(selectStorage);
  const about = useSelector(selectAbout);

  const [localProfile, setLocalProfile] = useState(profile);

  useEffect(() => {
    dispatch(loadSettings() as any);
  }, [dispatch]);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleSaveProfile = () => {
    dispatch(updateProfile(localProfile) as any);
    setEditProfile(false);
  };

  const handleToggle = (section: string, key: string, value: boolean) => {
    switch (section) {
      case "appearance":
        dispatch(setAppearance({ [key]: value }));
        dispatch(updateAppearance({ [key]: value }) as any);
        break;
      case "ai":
        dispatch(setAIPreferences({ [key]: value }));
        dispatch(updateAIPreferences({ [key]: value }) as any);
        break;
      case "notifications":
        dispatch(setNotifications({ [key]: value }));
        dispatch(updateNotifications({ [key]: value }) as any);
        break;
      case "privacy":
        dispatch(setPrivacy({ [key]: value }));
        dispatch(updatePrivacy({ [key]: value }) as any);
        break;
      case "backup":
        dispatch(setBackup({ [key]: value }));
        dispatch(updateBackup({ [key]: value }) as any);
        break;
    }
  };

  const handleSelect = (section: string, key: string, value: string) => {
    switch (section) {
      case "appearance":
        dispatch(setAppearance({ [key]: value }));
        dispatch(updateAppearance({ [key]: value }) as any);
        break;
      case "ai":
        dispatch(setAIPreferences({ [key]: value }));
        dispatch(updateAIPreferences({ [key]: value }) as any);
        break;
      case "backup":
        dispatch(setBackup({ [key]: value }));
        dispatch(updateBackup({ [key]: value }) as any);
        break;
    }
  };

  const handleToggleIntegration = (id: string) => {
    dispatch(toggleIntegration(id) as any);
  };

  const handleManualBackup = () => {
    dispatch(performManualBackup() as any);
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      dispatch(resetSettings() as any);
    }
  };

  const handleExportData = () => {
    dispatch(exportData() as any).then((action: any) => {
      if (exportData.fulfilled.match(action)) {
        const blob = action.payload;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nova-data-export.json";
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      dispatch(deleteAccount() as any).then((action: any) => {
        if (deleteAccount.fulfilled.match(action)) {
          navigate("/");
        }
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const sections = [
    { id: "profile" as SettingsSection, label: "Profile", icon: User },
    { id: "appearance" as SettingsSection, label: "Appearance", icon: Palette },
    { id: "ai" as SettingsSection, label: "AI Preferences", icon: Sparkles },
    { id: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsSection, label: "Privacy", icon: Shield },
    { id: "security" as SettingsSection, label: "Security", icon: Lock },
    { id: "integrations" as SettingsSection, label: "Integrations", icon: Smartphone },
    { id: "backup" as SettingsSection, label: "Backup & Sync", icon: Cloud },
    { id: "storage" as SettingsSection, label: "Storage", icon: HardDrive },
    { id: "about" as SettingsSection, label: "About Nova", icon: Info },
  ];

  return (
    <AppShell
      pageTitle="Settings"
      activeRoute={route}
      onNavigate={setRoute}
      userName={profile.name}
      userEmail={profile.email}
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
              <X className="h-5 w-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <ContentGrid columns={4} gap="lg">
          <div className="lg:col-span-1">
            <PremiumCard className="p-2">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.label}</span>
                      {activeSection === section.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </nav>
            </PremiumCard>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <PremiumCard key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-slate-700/50 rounded w-1/3" />
                      <div className="h-4 bg-slate-700/50 rounded w-2/3" />
                      <div className="h-4 bg-slate-700/50 rounded w-1/2" />
                    </div>
                  </PremiumCard>
                ))}
              </div>
            ) : (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "profile" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="relative">
                          <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
                          <button className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                            <User className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                          <p className="text-slate-400 mb-4">@{profile.username}</p>
                          <PrimaryButton onClick={() => setEditProfile(!editProfile)}>
                            {editProfile ? "Cancel" : "Edit Profile"}
                          </PrimaryButton>
                        </div>
                      </div>

                      {editProfile ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                              <input
                                type="text"
                                value={localProfile.name}
                                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                              <input
                                type="text"
                                value={localProfile.username}
                                onChange={(e) => setLocalProfile({ ...localProfile, username: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                              type="email"
                              value={localProfile.email}
                              onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Occupation</label>
                              <input
                                type="text"
                                value={localProfile.occupation}
                                onChange={(e) => setLocalProfile({ ...localProfile, occupation: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                              <input
                                type="text"
                                value={localProfile.country}
                                onChange={(e) => setLocalProfile({ ...localProfile, country: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                            <textarea
                              value={localProfile.bio}
                              onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                              rows={3}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                            />
                          </div>
                          <div className="flex gap-3">
                            <PrimaryButton onClick={handleSaveProfile} disabled={saving}>
                              {saving ? "Saving..." : "Save Changes"}
                            </PrimaryButton>
                            <SecondaryButton onClick={() => setEditProfile(false)}>Cancel</SecondaryButton>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-slate-500" />
                            <span className="text-slate-300">{profile.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-slate-500" />
                            <span className="text-slate-300">{profile.country}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-slate-500" />
                            <span className="text-slate-300">{profile.occupation}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-slate-500" />
                            <span className="text-slate-300">{profile.timezone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-slate-500" />
                            <span className="text-slate-300">{profile.language}</span>
                          </div>
                          <div className="pt-4 border-t border-slate-700/50">
                            <p className="text-slate-400">{profile.bio}</p>
                          </div>
                        </div>
                      )}
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "appearance" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: "light", icon: Sun, label: "Light" },
                          { id: "dark", icon: Moon, label: "Dark" },
                          { id: "system", icon: Monitor, label: "System" },
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <button
                              key={theme.id}
                              onClick={() => handleSelect("appearance", "theme", theme.id)}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                appearance.theme === theme.id
                                  ? "border-indigo-500 bg-indigo-500/20"
                                  : "border-slate-700/50 hover:border-slate-600"
                              }`}
                            >
                              <Icon className={`h-6 w-6 mx-auto mb-2 ${appearance.theme === theme.id ? "text-indigo-400" : "text-slate-500"}`} />
                              <span className={`text-sm ${appearance.theme === theme.id ? "text-white" : "text-slate-400"}`}>
                                {theme.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Display</h3>
                      <div className="space-y-4">
                        {[
                          { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing for more content" },
                          { key: "reduceMotion", label: "Reduce Motion", desc: "Minimize animations" },
                          { key: "glassEffects", label: "Glass Effects", desc: "Enable blur and transparency" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle("appearance", item.key, !(appearance as any)[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                (appearance as any)[item.key] ? "bg-indigo-500/30" : "bg-slate-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                  (appearance as any)[item.key] ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Font Size</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSelect("appearance", "fontSize", size)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              appearance.fontSize === size
                                ? "border-indigo-500 bg-indigo-500/20"
                                : "border-slate-700/50 hover:border-slate-600"
                            }`}
                          >
                            <span
                              className={`block ${
                                size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg"
                              } ${appearance.fontSize === size ? "text-white" : "text-slate-400"}`}
                            >
                              Aa
                            </span>
                            <span className={`text-sm mt-2 block ${appearance.fontSize === size ? "text-white" : "text-slate-400"}`}>
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "ai" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">AI Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">AI Name</label>
                          <input
                            type="text"
                            value={aiPreferences.aiName}
                            onChange={(e) => {
                              dispatch(setAIPreferences({ aiName: e.target.value }));
                              dispatch(updateAIPreferences({ aiName: e.target.value }) as any);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Conversation Style</label>
                          <select
                            value={aiPreferences.conversationStyle}
                            onChange={(e) => handleSelect("ai", "conversationStyle", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="balanced">Balanced</option>
                            <option value="creative">Creative</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Thinking Mode</label>
                          <select
                            value={aiPreferences.thinkingMode}
                            onChange={(e) => handleSelect("ai", "thinkingMode", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                          >
                            <option value="fast">Fast</option>
                            <option value="balanced">Balanced</option>
                            <option value="deep">Deep Thinking</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Response Length</label>
                          <select
                            value={aiPreferences.responseLength}
                            onChange={(e) => handleSelect("ai", "responseLength", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                          >
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="detailed">Detailed</option>
                          </select>
                        </div>
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">AI Features</h3>
                      <div className="space-y-4">
                        {[
                          { key: "memoryEnabled", label: "Memory Enabled", desc: "Remember context across conversations" },
                          { key: "dailySummary", label: "Daily Summary", desc: "Get daily AI summaries" },
                          { key: "weeklyReview", label: "Weekly Review", desc: "Weekly progress reviews" },
                          { key: "monthlyReview", label: "Monthly Review", desc: "Monthly progress reviews" },
                          { key: "smartSuggestions", label: "Smart Suggestions", desc: "AI-powered suggestions" },
                          { key: "predictivePlanning", label: "Predictive Planning", desc: "AI planning assistance" },
                          { key: "voiceResponses", label: "Voice Responses", desc: "Enable voice responses" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle("ai", item.key, !(aiPreferences as any)[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                (aiPreferences as any)[item.key] ? "bg-indigo-500/30" : "bg-slate-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                  (aiPreferences as any)[item.key] ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "notifications" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                      <div className="space-y-4">
                        {[
                          { key: "desktopNotifications", label: "Desktop Notifications", desc: "Show desktop notifications" },
                          { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates" },
                          { key: "taskReminders", label: "Task Reminders", desc: "Task deadline reminders" },
                          { key: "calendarAlerts", label: "Calendar Alerts", desc: "Calendar event alerts" },
                          { key: "goalReminders", label: "Goal Reminders", desc: "Goal progress reminders" },
                          { key: "financeAlerts", label: "Finance Alerts", desc: "Finance and budget alerts" },
                          { key: "healthAlerts", label: "Health Alerts", desc: "Health tracking alerts" },
                          { key: "documentUpdates", label: "Document Updates", desc: "Document change notifications" },
                          { key: "assistantSuggestions", label: "Assistant Suggestions", desc: "AI suggestion notifications" },
                          { key: "soundEffects", label: "Sound Effects", desc: "Play notification sounds" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle("notifications", item.key, !(notifications as any)[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                (notifications as any)[item.key] ? "bg-indigo-500/30" : "bg-slate-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                  (notifications as any)[item.key] ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "privacy" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Privacy Settings</h3>
                      <div className="space-y-4">
                        {[
                          { key: "analytics", label: "Analytics", desc: "Help improve Nova with anonymous usage data" },
                          { key: "dataCollection", label: "Data Collection", desc: "Allow data collection for features" },
                          { key: "crashReports", label: "Crash Reports", desc: "Send anonymous crash reports" },
                          { key: "aiLearning", label: "AI Learning", desc: "Allow AI to learn from your usage" },
                          { key: "personalization", label: "Personalization", desc: "Enable personalized features" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle("privacy", item.key, !(privacy as any)[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                (privacy as any)[item.key] ? "bg-indigo-500/30" : "bg-slate-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                  (privacy as any)[item.key] ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Data Management</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <div>
                            <p className="text-white font-medium">Export Data</p>
                            <p className="text-sm text-slate-400">Download all your data</p>
                          </div>
                          <SecondaryButton icon={<Download className="h-4 w-4" />} onClick={handleExportData} disabled={saving}>
                            {saving ? "Exporting..." : "Export"}
                          </SecondaryButton>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <div>
                            <p className="text-white font-medium">Delete Account</p>
                            <p className="text-sm text-slate-400">Permanently delete your account</p>
                          </div>
                          <SecondaryButton icon={<Trash2 className="h-4 w-4" />} onClick={handleDeleteAccount} disabled={saving} className="text-rose-400 border-rose-500/30 hover:bg-rose-500/20">
                            {saving ? "Deleting..." : "Delete"}
                          </SecondaryButton>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "security" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Security Overview</h3>
                      <StatCard
                        label="Security Score"
                        value={`${security.securityScore}%`}
                        icon={<Shield className="h-6 w-6" />}
                      />
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-400">Add an extra layer of security</p>
                          </div>
                          <button
                            onClick={() => handleToggle("security", "twoFactor", !security.twoFactor)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              security.twoFactor ? "bg-indigo-500/30" : "bg-slate-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                security.twoFactor ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="pt-4 border-t border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="text-white font-medium">Password</p>
                              <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Active Sessions</h3>
                      <div className="space-y-3">
                        {security.connectedDevices.map((device, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-5 w-5 text-slate-500" />
                              <span className="text-white">{device}</span>
                            </div>
                            <span className="text-sm text-slate-400">Active</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400">Last login: {new Date(security.lastLogin).toLocaleString()}</p>
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "integrations" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Connected Services</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {integrations.map((integration) => (
                          <div
                            key={integration.id}
                            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-2xl">{integration.icon}</span>
                              <button
                                onClick={() => handleToggleIntegration(integration.id)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${
                                  integration.connected ? "bg-indigo-500/30" : "bg-slate-700"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                                    integration.connected ? "left-5 bg-indigo-500" : "left-0.5 bg-slate-500"
                                  }`}
                                />
                              </button>
                            </div>
                            <h4 className="text-white font-medium mb-1">{integration.name}</h4>
                            <p className="text-sm text-slate-400">{integration.description}</p>
                            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                              integration.connected
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-700 text-slate-400"
                            }`}>
                              {integration.connected ? "Connected" : "Not Connected"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "backup" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Backup Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Auto Backup</p>
                            <p className="text-sm text-slate-400">Automatically backup your data</p>
                          </div>
                          <button
                            onClick={() => handleToggle("backup", "autoBackup", !backup.autoBackup)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              backup.autoBackup ? "bg-indigo-500/30" : "bg-slate-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                backup.autoBackup ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Cloud Sync</p>
                            <p className="text-sm text-slate-400">Sync data to cloud</p>
                          </div>
                          <button
                            onClick={() => handleToggle("backup", "cloudSync", !backup.cloudSync)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              backup.cloudSync ? "bg-indigo-500/30" : "bg-slate-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                backup.cloudSync ? "left-7 bg-indigo-500" : "left-1 bg-slate-500"
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Sync Frequency</label>
                          <select
                            value={backup.syncFrequency}
                            onChange={(e) => handleSelect("backup", "syncFrequency", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Backup Actions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <div>
                            <p className="text-white font-medium">Last Backup</p>
                            <p className="text-sm text-slate-400">{new Date(backup.lastBackup).toLocaleString()}</p>
                          </div>
                          <PrimaryButton icon={<RefreshCw className="h-4 w-4" />} onClick={handleManualBackup} disabled={saving}>
                            {saving ? "Backing up..." : "Backup Now"}
                          </PrimaryButton>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "storage" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Storage Usage</h3>
                      <StatCard
                        label="Total Storage"
                        value={formatBytes(storage.total)}
                        icon={<HardDrive className="h-6 w-6" />}
                      />
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Storage Breakdown</h3>
                      <div className="space-y-4">
                        {[
                          { key: "documents", label: "Documents", value: storage.documents },
                          { key: "notes", label: "Notes", value: storage.notes },
                          { key: "tasks", label: "Tasks", value: storage.tasks },
                          { key: "images", label: "Images", value: storage.images },
                          { key: "voice", label: "Voice", value: storage.voice },
                          { key: "aiConversations", label: "AI Conversations", value: storage.aiConversations },
                        ].map((item) => (
                          <div key={item.key}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white">{item.label}</span>
                              <span className="text-slate-400">{formatBytes(item.value)}</span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all"
                                style={{ width: `${(item.value / storage.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </div>
                )}

                {activeSection === "about" && (
                  <div className="space-y-6">
                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">About Nova</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Version</span>
                          <span className="text-white">{about.version}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Build</span>
                          <span className="text-white">{about.build}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">License</span>
                          <span className="text-white">{about.license}</span>
                        </div>
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Links</h3>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                          <span className="text-white">Terms of Service</span>
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                          <span className="text-white">Privacy Policy</span>
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                          <span className="text-white">Open Source</span>
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                          <span className="text-white">Feedback</span>
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                        </a>
                      </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <div>
                            <p className="text-white font-medium">Reset Settings</p>
                            <p className="text-sm text-slate-400">Reset all settings to default</p>
                          </div>
                          <SecondaryButton onClick={handleResetSettings} disabled={saving}>
                            {saving ? "Resetting..." : "Reset"}
                          </SecondaryButton>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </ContentGrid>
      </PageContainer>
    </AppShell>
  );
}
