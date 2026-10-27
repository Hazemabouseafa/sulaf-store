"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_STORE_SETTINGS, StoreSettings, getClientSettings, saveClientSettings } from "./store-settings";

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (updater: Partial<StoreSettings> | ((prev: StoreSettings) => StoreSettings)) => void;
  resetSettings: () => void;
  isLoaded: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
  isLoaded: false,
});

export function StoreSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: Partial<StoreSettings> | null;
}) {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (initialSettings) {
      return {
        ...DEFAULT_STORE_SETTINGS,
        ...initialSettings,
        sectionsVisibility: {
          ...DEFAULT_STORE_SETTINGS.sectionsVisibility,
          ...(initialSettings.sectionsVisibility || {}),
        },
        elementsVisibility: {
          ...DEFAULT_STORE_SETTINGS.elementsVisibility,
          ...(initialSettings.elementsVisibility || {}),
        },
        customContent: {
          ...(initialSettings.customContent || {}),
        },
        customContentEn: {
          ...(initialSettings.customContentEn || {}),
        },
        customLinks: {
          ...(initialSettings.customLinks || {}),
        },
        liveTextOverrides: {
          ...(initialSettings.liveTextOverrides || {}),
        },
      };
    }
    return DEFAULT_STORE_SETTINGS;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load from storage / API
    const loaded = getClientSettings();
    setSettings(loaded);
    setIsLoaded(true);

    // Sync with API route if available
    fetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((serverData) => {
        if (serverData && serverData.settings) {
          setSettings((prev) => ({ ...prev, ...serverData.settings }));
          saveClientSettings({ ...loaded, ...serverData.settings });
        }
      })
      .catch(() => {
        // Fallback to local
      });

    // Custom event listener for cross-tab or cross-component reactivity
    const handleUpdate = () => {
      setSettings(getClientSettings());
    };

    window.addEventListener("sulaf_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("sulaf_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateSettings = (
    updater: Partial<StoreSettings> | ((prev: StoreSettings) => StoreSettings)
  ) => {
    setSettings((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveClientSettings(next);

      // Persist to server API in background
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: next }),
      }).catch(() => {});

      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    saveClientSettings(DEFAULT_STORE_SETTINGS);
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: DEFAULT_STORE_SETTINGS }),
    }).catch(() => {});
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoaded }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
