"use client";

import React, { useMemo } from "react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { DEFAULT_THEME_COLORS, generateThemeCss } from "@/lib/settings/store-settings";

export function ThemeStyleInjector() {
  const { settings } = useStoreSettings();
  const themeColors = settings?.themeColors || DEFAULT_THEME_COLORS;

  const css = useMemo(() => {
    return generateThemeCss(themeColors);
  }, [themeColors]);

  return <style id="sulaf-dynamic-theme" dangerouslySetInnerHTML={{ __html: css }} />;
}
