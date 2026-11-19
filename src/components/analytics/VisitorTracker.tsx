"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_STORAGE_KEY = "sulaf_visitor_uid_v1";
const LAST_TRACKED_KEY = "sulaf_last_tracked_visit_v1";

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing && existing.length >= 6) return existing;
    const generated = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(VISITOR_STORAGE_KEY, generated);
    return generated;
  } catch {
    return `v_tmp_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getClientDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Prevent React StrictMode double-fire for the exact same route within 2.5 seconds
    try {
      const prevRaw = sessionStorage.getItem(LAST_TRACKED_KEY);
      if (prevRaw) {
        const prev = JSON.parse(prevRaw);
        if (prev?.path === pathname && Date.now() - Number(prev?.ts || 0) < 2500) {
          return;
        }
      }
      sessionStorage.setItem(
        LAST_TRACKED_KEY,
        JSON.stringify({ path: pathname, ts: Date.now() })
      );
    } catch {}

    const visitorId = getOrCreateVisitorId();
    const payload = JSON.stringify({
      visitorId,
      path: pathname,
      device: getClientDeviceType(),
      referrer: document.referrer || "",
    });

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
