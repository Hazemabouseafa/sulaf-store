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
        customLinksAr: {
          ...(initialSettings.customLinksAr || {}),
        },
        customLinksEn: {
          ...(initialSettings.customLinksEn || {}),
        },
        liveTextOverrides: {
          ...(initialSettings.liveTextOverrides || {}),
        },
        liveTextOverridesAr: {
          ...(initialSettings.liveTextOverridesAr || {}),
        },
        liveTextOverridesEn: {
          ...(initialSettings.liveTextOverridesEn || {}),
        },
        liveAddedElements: Array.isArray(initialSettings.liveAddedElements)
          ? initialSettings.liveAddedElements
          : [],
        liveAddedElementsAr: Array.isArray(initialSettings.liveAddedElementsAr)
          ? initialSettings.liveAddedElementsAr
          : [],
        liveAddedElementsEn: Array.isArray(initialSettings.liveAddedElementsEn)
          ? initialSettings.liveAddedElementsEn
          : [],
        liveOverridesMigrated: Boolean(initialSettings.liveOverridesMigrated),
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
          customLinksAr: {
            ...(localLoaded.customLinksAr || {}),
            ...(initialSettings.customLinksAr || {}),
          },
          customLinksEn: {
            ...(localLoaded.customLinksEn || {}),
            ...(initialSettings.customLinksEn || {}),
          },
          liveTextOverrides: {
            ...(localLoaded.liveTextOverrides || {}),
            ...(initialSettings.liveTextOverrides || {}),
          },
          liveTextOverridesAr: {
            ...(localLoaded.liveTextOverridesAr || {}),
            ...(initialSettings.liveTextOverridesAr || {}),
          },
          liveTextOverridesEn: {
            ...(localLoaded.liveTextOverridesEn || {}),
            ...(initialSettings.liveTextOverridesEn || {}),
          },
          liveAddedElements: Array.isArray(initialSettings.liveAddedElements)
            ? initialSettings.liveAddedElements
            : Array.isArray(localLoaded.liveAddedElements)
            ? localLoaded.liveAddedElements
            : [],
          liveAddedElementsAr: Array.isArray(initialSettings.liveAddedElementsAr)
            ? initialSettings.liveAddedElementsAr
            : Array.isArray(localLoaded.liveAddedElementsAr)
            ? localLoaded.liveAddedElementsAr
            : [],
          liveAddedElementsEn: Array.isArray(initialSettings.liveAddedElementsEn)
            ? initialSettings.liveAddedElementsEn
            : Array.isArray(localLoaded.liveAddedElementsEn)
            ? localLoaded.liveAddedElementsEn
            : [],
          liveOverridesMigrated: Boolean(
            initialSettings.liveOverridesMigrated || localLoaded.liveOverridesMigrated
          ),
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
              liveTextOverridesAr: {
                ...(serverData.settings.liveTextOverridesAr || {}),
              },
              liveTextOverridesEn: {
                ...(serverData.settings.liveTextOverridesEn || {}),
              },
              liveAddedElements: Array.isArray(serverData.settings.liveAddedElements)
                ? serverData.settings.liveAddedElements
                : [],
              liveAddedElementsAr: Array.isArray(serverData.settings.liveAddedElementsAr)
                ? serverData.settings.liveAddedElementsAr
                : [],
              liveAddedElementsEn: Array.isArray(serverData.settings.liveAddedElementsEn)
                ? serverData.settings.liveAddedElementsEn
                : [],
              customLinks: {
                ...(serverData.settings.customLinks || {}),
              },
              customLinksAr: {
                ...(serverData.settings.customLinksAr || {}),
              },
              customLinksEn: {
                ...(serverData.settings.customLinksEn || {}),
              },
              liveOverridesMigrated: Boolean(serverData.settings.liveOverridesMigrated),
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
