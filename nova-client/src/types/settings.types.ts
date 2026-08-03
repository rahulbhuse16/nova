export interface ProfileSettings {
  avatar: string;
  name: string;
  username: string;
  email: string;
  timezone: string;
  language: string;
  country: string;
  occupation: string;
  bio: string;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  reduceMotion: boolean;
  glassEffects: boolean;
  sidebarDensity: "compact" | "comfortable" | "spacious";
  cardRadius: "small" | "medium" | "large";
}

export interface AIPreferences {
  aiName: string;
  conversationStyle: "professional" | "friendly" | "balanced" | "creative";
  productivityStyle: "minimal" | "structured" | "detailed";
  thinkingMode: "fast" | "balanced" | "deep";
  responseLength: "short" | "medium" | "detailed";
  memoryEnabled: boolean;
  dailySummary: boolean;
  weeklyReview: boolean;
  monthlyReview: boolean;
  smartSuggestions: boolean;
  predictivePlanning: boolean;
  voiceResponses: boolean;
}

export interface NotificationSettings {
  desktopNotifications: boolean;
  emailNotifications: boolean;
  taskReminders: boolean;
  calendarAlerts: boolean;
  goalReminders: boolean;
  financeAlerts: boolean;
  healthAlerts: boolean;
  documentUpdates: boolean;
  assistantSuggestions: boolean;
  soundEffects: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  dataCollection: boolean;
  crashReports: boolean;
  aiLearning: boolean;
  personalization: boolean;
}

export interface SecuritySettings {
  password: string;
  twoFactor: boolean;
  loginDevices: number;
  activeSessions: number;
  apiKeys: string[];
  connectedDevices: string[];
  lastLogin: string;
  recentActivity: string[];
  securityScore: number;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  category: "productivity" | "communication" | "health" | "storage" | "other";
}

export interface BackupSettings {
  autoBackup: boolean;
  cloudSync: boolean;
  syncFrequency: "hourly" | "daily" | "weekly";
  lastBackup: string;
}

export interface StorageUsage {
  total: number;
  documents: number;
  notes: number;
  tasks: number;
  images: number;
  voice: number;
  aiConversations: number;
}

export interface AboutSettings {
  version: string;
  build: string;
  license: string;
}

export interface Settings {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  aiPreferences: AIPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  integrations: Integration[];
  backup: BackupSettings;
  storage: StorageUsage;
  about: AboutSettings;
}

export interface SettingsState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  settings: Settings;
}
