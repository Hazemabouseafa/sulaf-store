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
        liveAddedElements: Array.isArray(initialSettings.liveAddedElements)
          ? initialSettings.liveAddedElements
          : [],
        socialMedia: {
          ...DEFAULT_STORE_SETTINGS.socialMedia,
          ...(initialSettings.socialMedia || {}),
        },
        contacts: {
          ...DEFAULT_STORE_SETTINGS.contacts,
          ...(initialSettings.contacts || {}),
        },
      };
    }
    return DEFAULT_STORE_SETTINGS;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load: prefer SSR initialSettings over potentially stale localStorage,
    // while keeping any keys not yet synced.
    const localLoaded = getClientSettings();
    const mergedInitial: StoreSettings = initialSettings
      ? {
          ...localLoaded,
          ...initialSettings,
          sectionsVisibility: {
            ...DEFAULT_STORE_SETTINGS.sectionsVisibility,
            ...(localLoaded.sectionsVisibility || {}),
            ...(initialSettings.sectionsVisibility || {}),
          },
          elementsVisibility: {
            ...DEFAULT_STORE_SETTINGS.elementsVisibility,
            ...(localLoaded.elementsVisibility || {}),
            ...(initialSettings.elementsVisibility || {}),
          },
          customContent: {
            ...(localLoaded.customContent || {}),
            ...(initialSettings.customContent || {}),
          },
          customContentEn: {
            ...(localLoaded.customContentEn || {}),
            ...(initialSettings.customContentEn || {}),
          },
          customLinks: {
            ...(localLoaded.customLinks || {}),
            ...(initialSettings.customLinks || {}),
          },
          liveTextOverrides: {
            ...(localLoaded.liveTextOverrides || {}),
            ...(initialSettings.liveTextOverrides || {}),
          },
          liveAddedElements: Array.isArray(initialSettings.liveAddedElements)
            ? initialSettings.liveAddedElements
            : Array.isArray(localLoaded.liveAddedElements)
            ? localLoaded.liveAddedElements
            : [],
          socialMedia: {
            ...DEFAULT_STORE_SETTINGS.socialMedia,
            ...(localLoaded.socialMedia || {}),
            ...(initialSettings.socialMedia || {}),
          },
          contacts: {
            ...DEFAULT_STORE_SETTINGS.contacts,
            ...(localLoaded.contacts || {}),
            ...(initialSettings.contacts || {}),
          },
        }
      : localLoaded;

    setSettings(mergedInitial);
    setIsLoaded(true);

    // Sync with API route (always bypass browser cache)
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((serverData) => {
        if (serverData && serverData.settings) {
          setSettings((prev) => {
            const next = {
              ...prev,
              ...serverData.settings,
              liveTextOverrides: {
                ...(serverData.settings.liveTextOverrides || {}),
              },
              liveAddedElements: Array.isArray(serverData.settings.liveAddedElements)
                ? serverData.settings.liveAddedElements
                : [],
              customLinks: {
                ...(serverData.settings.customLinks || {}),
              },
            };
            saveClientSettings(next);
            return next;
          });
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
