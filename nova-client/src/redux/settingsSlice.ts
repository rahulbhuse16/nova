import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { settingsService } from "../services/settingsService";
import type { Settings, SettingsState } from "../types/settings.types";

const initialState: SettingsState = {
  loading: false,
  saving: false,
  error: null,
  success: null,
  settings: {
    profile: {
      avatar: "",
      name: "",
      username: "",
      email: "",
      timezone: "",
      language: "",
      country: "",
      occupation: "",
      bio: "",
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
      loginDevices: 0,
      activeSessions: 0,
      apiKeys: [],
      connectedDevices: [],
      lastLogin: "",
      recentActivity: [],
      securityScore: 0,
    },
    integrations: [],
    backup: {
      autoBackup: true,
      cloudSync: true,
      syncFrequency: "daily",
      lastBackup: "",
    },
    storage: {
      total: 0,
      documents: 0,
      notes: 0,
      tasks: 0,
      images: 0,
      voice: 0,
      aiConversations: 0,
    },
    about: {
      version: "",
      build: "",
      license: "",
    },
  },
};

// Async Thunks
export const loadSettings = createAsyncThunk(
  "settings/loadSettings",
  async (_, { rejectWithValue }) => {
    try {
      const settings = await settingsService.loadSettings();
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to load settings");
    }
  }
);

export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (settings: Settings, { rejectWithValue }) => {
    try {
      const savedSettings = await settingsService.saveSettings(settings);
      return savedSettings;
    } catch (error) {
      return rejectWithValue("Failed to save settings");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "settings/updateProfile",
  async (profile: Partial<Settings["profile"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateProfile(profile);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

export const updateAppearance = createAsyncThunk(
  "settings/updateAppearance",
  async (appearance: Partial<Settings["appearance"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateAppearance(appearance);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update appearance");
    }
  }
);

export const updateAIPreferences = createAsyncThunk(
  "settings/updateAIPreferences",
  async (aiPreferences: Partial<Settings["aiPreferences"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateAIPreferences(aiPreferences);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update AI preferences");
    }
  }
);

export const updateNotifications = createAsyncThunk(
  "settings/updateNotifications",
  async (notifications: Partial<Settings["notifications"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateNotifications(notifications);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update notifications");
    }
  }
);

export const updatePrivacy = createAsyncThunk(
  "settings/updatePrivacy",
  async (privacy: Partial<Settings["privacy"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updatePrivacy(privacy);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update privacy");
    }
  }
);

export const updateSecurity = createAsyncThunk(
  "settings/updateSecurity",
  async (security: Partial<Settings["security"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateSecurity(security);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update security");
    }
  }
);

export const toggleIntegration = createAsyncThunk(
  "settings/toggleIntegration",
  async (integrationId: string, { rejectWithValue }) => {
    try {
      const settings = await settingsService.toggleIntegration(integrationId);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to toggle integration");
    }
  }
);

export const updateBackup = createAsyncThunk(
  "settings/updateBackup",
  async (backup: Partial<Settings["backup"]>, { rejectWithValue }) => {
    try {
      const settings = await settingsService.updateBackup(backup);
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to update backup");
    }
  }
);

export const performManualBackup = createAsyncThunk(
  "settings/performManualBackup",
  async (_, { rejectWithValue }) => {
    try {
      const settings = await settingsService.performManualBackup();
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to perform backup");
    }
  }
);

export const resetSettings = createAsyncThunk(
  "settings/resetSettings",
  async (_, { rejectWithValue }) => {
    try {
      const settings = await settingsService.resetSettings();
      return settings;
    } catch (error) {
      return rejectWithValue("Failed to reset settings");
    }
  }
);

export const exportData = createAsyncThunk(
  "settings/exportData",
  async (_, { rejectWithValue }) => {
    try {
      const blob = await settingsService.exportData();
      return blob;
    } catch (error) {
      return rejectWithValue("Failed to export data");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "settings/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await settingsService.deleteAccount();
      return true;
    } catch (error) {
      return rejectWithValue("Failed to delete account");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setProfile: (state, action: PayloadAction<Partial<Settings["profile"]>>) => {
      state.settings.profile = { ...state.settings.profile, ...action.payload };
    },
    setAppearance: (state, action: PayloadAction<Partial<Settings["appearance"]>>) => {
      state.settings.appearance = { ...state.settings.appearance, ...action.payload };
    },
    setAIPreferences: (state, action: PayloadAction<Partial<Settings["aiPreferences"]>>) => {
      state.settings.aiPreferences = { ...state.settings.aiPreferences, ...action.payload };
    },
    setNotifications: (state, action: PayloadAction<Partial<Settings["notifications"]>>) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload };
    },
    setPrivacy: (state, action: PayloadAction<Partial<Settings["privacy"]>>) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload };
    },
    setSecurity: (state, action: PayloadAction<Partial<Settings["security"]>>) => {
      state.settings.security = { ...state.settings.security, ...action.payload };
    },
    setBackup: (state, action: PayloadAction<Partial<Settings["backup"]>>) => {
      state.settings.backup = { ...state.settings.backup, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Load Settings
    builder
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.success = "Settings loaded successfully";
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save Settings
    builder
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Settings saved successfully";
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Appearance
    builder
      .addCase(updateAppearance.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateAppearance.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Appearance updated successfully";
      })
      .addCase(updateAppearance.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update AI Preferences
    builder
      .addCase(updateAIPreferences.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateAIPreferences.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "AI preferences updated successfully";
      })
      .addCase(updateAIPreferences.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Notifications
    builder
      .addCase(updateNotifications.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Notifications updated successfully";
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Privacy
    builder
      .addCase(updatePrivacy.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePrivacy.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Privacy settings updated successfully";
      })
      .addCase(updatePrivacy.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Security
    builder
      .addCase(updateSecurity.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSecurity.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Security settings updated successfully";
      })
      .addCase(updateSecurity.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Toggle Integration
    builder
      .addCase(toggleIntegration.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(toggleIntegration.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Integration updated successfully";
      })
      .addCase(toggleIntegration.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update Backup
    builder
      .addCase(updateBackup.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBackup.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Backup settings updated successfully";
      })
      .addCase(updateBackup.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Perform Manual Backup
    builder
      .addCase(performManualBackup.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(performManualBackup.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Backup completed successfully";
      })
      .addCase(performManualBackup.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Reset Settings
    builder
      .addCase(resetSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
        state.success = "Settings reset successfully";
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Export Data
    builder
      .addCase(exportData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(exportData.fulfilled, (state) => {
        state.saving = false;
        state.success = "Data exported successfully";
      })
      .addCase(exportData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.saving = false;
        state.success = "Account deleted successfully";
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setProfile,
  setAppearance,
  setAIPreferences,
  setNotifications,
  setPrivacy,
  setSecurity,
  setBackup,
} = settingsSlice.actions;

// Selectors
export const selectSettings = (state: { settings: SettingsState }) => state.settings.settings;
export const selectSettingsLoading = (state: { settings: SettingsState }) => state.settings.loading;
export const selectSettingsSaving = (state: { settings: SettingsState }) => state.settings.saving;
export const selectSettingsError = (state: { settings: SettingsState }) => state.settings.error;
export const selectSettingsSuccess = (state: { settings: SettingsState }) => state.settings.success;
export const selectProfile = (state: { settings: SettingsState }) => state.settings.settings.profile;
export const selectAppearance = (state: { settings: SettingsState }) => state.settings.settings.appearance;
export const selectAIPreferences = (state: { settings: SettingsState }) => state.settings.settings.aiPreferences;
export const selectNotifications = (state: { settings: SettingsState }) => state.settings.settings.notifications;
export const selectPrivacy = (state: { settings: SettingsState }) => state.settings.settings.privacy;
export const selectSecurity = (state: { settings: SettingsState }) => state.settings.settings.security;
export const selectIntegrations = (state: { settings: SettingsState }) => state.settings.settings.integrations;
export const selectBackup = (state: { settings: SettingsState }) => state.settings.settings.backup;
export const selectStorage = (state: { settings: SettingsState }) => state.settings.settings.storage;
export const selectAbout = (state: { settings: SettingsState }) => state.settings.settings.about;

export default settingsSlice.reducer;
