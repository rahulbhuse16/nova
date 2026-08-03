import type { Settings } from "../types/settings.types";

const mockSettings: Settings = {
  profile: {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    name: "Alex Rivera",
    username: "alexrivera",
    email: "alex@nova.app",
    timezone: "America/New_York",
    language: "en",
    country: "United States",
    occupation: "Software Engineer",
    bio: "Building the future of productivity with Nova AI.",
  },
  appearance: {
    theme: "dark",
    accentColor: "#6366f1",
    fontSize: "medium",
    compactMode: false,
    reduceMotion: false,
    glassEffects: true,
    sidebarDensity: "comfortable",
    cardRadius: "medium",
  },
  aiPreferences: {
    aiName: "Nova",
    conversationStyle: "balanced",
    productivityStyle: "structured",
    thinkingMode: "balanced",
    responseLength: "medium",
    memoryEnabled: true,
    dailySummary: true,
    weeklyReview: true,
    monthlyReview: false,
    smartSuggestions: true,
    predictivePlanning: true,
    voiceResponses: false,
  },
  notifications: {
    desktopNotifications: true,
    emailNotifications: true,
    taskReminders: true,
    calendarAlerts: true,
    goalReminders: true,
    financeAlerts: true,
    healthAlerts: false,
    documentUpdates: true,
    assistantSuggestions: true,
    soundEffects: true,
  },
  privacy: {
    analytics: true,
    dataCollection: true,
    crashReports: true,
    aiLearning: true,
    personalization: true,
  },
  security: {
    password: "",
    twoFactor: false,
    loginDevices: 3,
    activeSessions: 2,
    apiKeys: [],
    connectedDevices: ["MacBook Pro", "iPhone 15", "iPad Pro"],
    lastLogin: "2026-01-30T10:30:00Z",
    recentActivity: [
      "Login from MacBook Pro",
      "Settings updated",
      "Password changed",
    ],
    securityScore: 85,
  },
  integrations: [
    {
      id: "google-calendar",
      name: "Google Calendar",
      icon: "📅",
      description: "Sync your calendar events",
      connected: true,
      category: "productivity",
    },
    {
      id: "google-drive",
      name: "Google Drive",
      icon: "📁",
      description: "Access your documents",
      connected: true,
      category: "storage",
    },
    {
      id: "github",
      name: "GitHub",
      icon: "💻",
      description: "Connect your repositories",
      connected: false,
      category: "productivity",
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📝",
      description: "Sync your notes",
      connected: false,
      category: "productivity",
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      description: "Team communication",
      connected: true,
      category: "communication",
    },
    {
      id: "apple-health",
      name: "Apple Health",
      icon: "❤️",
      description: "Health data integration",
      connected: false,
      category: "health",
    },
  ],
  backup: {
    autoBackup: true,
    cloudSync: true,
    syncFrequency: "daily",
    lastBackup: "2026-01-30T08:00:00Z",
  },
  storage: {
    total: 2457600000,
    documents: 524288000,
    notes: 157286400,
    tasks: 52428800,
    images: 1073741824,
    voice: 524288000,
    aiConversations: 157286400,
  },
  about: {
    version: "1.0.0",
    build: "2026.01.30",
    license: "MIT",
  },
};

class SettingsService {
  private settings: Settings = mockSettings;

  async loadSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.settings });
      }, 800);
    });
  }

  async saveSettings(settings: Settings): Promise<Settings> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.settings = { ...settings };
          resolve({ ...this.settings });
        } catch (error) {
          reject(new Error("Failed to save settings"));
        }
      }, 1000);
    });
  }

  async updateProfile(profile: Partial<Settings["profile"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.profile = { ...this.settings.profile, ...profile };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updateAppearance(appearance: Partial<Settings["appearance"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.appearance = { ...this.settings.appearance, ...appearance };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updateAIPreferences(aiPreferences: Partial<Settings["aiPreferences"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.aiPreferences = { ...this.settings.aiPreferences, ...aiPreferences };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updateNotifications(notifications: Partial<Settings["notifications"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.notifications = { ...this.settings.notifications, ...notifications };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updatePrivacy(privacy: Partial<Settings["privacy"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.privacy = { ...this.settings.privacy, ...privacy };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updateSecurity(security: Partial<Settings["security"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.security = { ...this.settings.security, ...security };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async toggleIntegration(integrationId: string): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.integrations = this.settings.integrations.map((integration) =>
          integration.id === integrationId
            ? { ...integration, connected: !integration.connected }
            : integration
        );
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async updateBackup(backup: Partial<Settings["backup"]>): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.backup = { ...this.settings.backup, ...backup };
        resolve({ ...this.settings });
      }, 500);
    });
  }

  async performManualBackup(): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings.backup.lastBackup = new Date().toISOString();
        resolve({ ...this.settings });
      }, 2000);
    });
  }

  async resetSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.settings = { ...mockSettings };
        resolve({ ...this.settings });
      }, 1000);
    });
  }

  async exportData(): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        resolve(blob);
      }, 1500);
    });
  }

  async deleteAccount(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}

export const settingsService = new SettingsService();
