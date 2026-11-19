import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export type DeviceCategory = "mobile" | "desktop" | "tablet";

export interface HourlyVisitorStats {
  pageViews: number;
  uniqueVisitors: number;
  visitorIds?: string[];
}

export interface DailyVisitorBucket {
  date: string; // YYYY-MM-DD (Africa/Cairo)
  dayNameAr: string;
  dayNameEn: string;
  dayOfWeek: number; // 0 = Saturday .. 6 = Friday
  pageViews: number;
  uniqueVisitors: number;
  visitorIds: string[];
  hourly: Record<string, HourlyVisitorStats>; // "00" .. "23"
  topPages: Record<string, number>;
  devices?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface VisitorEventSummary {
  id: string;
  timestamp: string;
  date: string;
  dayNameAr: string;
  dayNameEn: string;
  hour: number;
  timeLabelAr: string;
  timeLabelEn: string;
  path: string;
  visitorId: string;
  device: DeviceCategory;
  referrer?: string;
}

export interface VisitorAnalyticsStore {
  totalPageViews: number;
  totalUniqueVisitorIds: string[];
  extraUniqueBaseline?: number;
  byDate: Record<string, DailyVisitorBucket>;
  recentVisits: VisitorEventSummary[];
  updatedAt: string;
}

export const VISITORS_FILE = "visitors.json";

const ARABIC_DAYS_SAT_FIRST = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

const ENGLISH_DAYS_SAT_FIRST = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const WEEKDAY_SHORT_TO_SAT_INDEX: Record<string, number> = {
  Sat: 0,
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
};

export const DEFAULT_VISITORS_STORE: VisitorAnalyticsStore = {
  totalPageViews: 0,
  totalUniqueVisitorIds: [],
  extraUniqueBaseline: 0,
  byDate: {},
  recentVisits: [],
  updatedAt: new Date(0).toISOString(),
};

const globalVisitorLockState = globalThis as typeof globalThis & {
  __sulafVisitorsFileQueue?: Promise<void>;
};

export async function withVisitorsFileLock<T>(
  fn: () => Promise<T> | T
): Promise<T> {
  const prev = globalVisitorLockState.__sulafVisitorsFileQueue || Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  globalVisitorLockState.__sulafVisitorsFileQueue = prev.then(
    () => current,
    () => current
  );

  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

export interface CairoTimeParts {
  dateStr: string;
  hour: number;
  hourKey: string;
  minute: number;
  second: number;
  dayOfWeek: number; // 0 = Saturday .. 6 = Friday
  dayNameAr: string;
  dayNameEn: string;
  timeLabelAr: string;
  timeLabelEn: string;
}

export function getCairoTimeParts(date: Date = new Date()): CairoTimeParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const partsMap: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") {
      partsMap[part.type] = part.value;
    }
  }

  const rawHour = Number(partsMap.hour || "0");
  const hour = rawHour === 24 ? 0 : Math.max(0, Math.min(23, rawHour));
  const minute = Number(partsMap.minute || "0");
  const second = Number(partsMap.second || "0");
  const dateStr = `${partsMap.year}-${partsMap.month}-${partsMap.day}`;
  const dayOfWeek = WEEKDAY_SHORT_TO_SAT_INDEX[partsMap.weekday || "Sat"] ?? 0;

  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const ss = String(second).padStart(2, "0");
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampmAr = hour < 12 ? "ص" : "م";
  const ampmEn = hour < 12 ? "AM" : "PM";

  return {
    dateStr,
    hour,
    hourKey: hh,
    minute,
    second,
    dayOfWeek,
    dayNameAr: ARABIC_DAYS_SAT_FIRST[dayOfWeek] || "السبت",
    dayNameEn: ENGLISH_DAYS_SAT_FIRST[dayOfWeek] || "Saturday",
    timeLabelAr: `${h12}:${mm}:${ss} ${ampmAr}`,
    timeLabelEn: `${h12}:${mm}:${ss} ${ampmEn}`,
  };
}

export function formatHourLabelAr(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12} ${h < 12 ? "ص" : "م"}`;
}

export function formatHourLabelEn(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12} ${h < 12 ? "AM" : "PM"}`;
}

export function normalizeStorefrontPath(rawPath?: string): string {
  const cleaned = String(rawPath || "/").split("?")[0].split("#")[0].trim();
  if (!cleaned) return "/";
  return cleaned.startsWith("/") ? cleaned.slice(0, 120) : `/${cleaned.slice(0, 119)}`;
}

export function readVisitorsStore(): VisitorAnalyticsStore {
  const raw = readJsonFile<VisitorAnalyticsStore>(VISITORS_FILE, DEFAULT_VISITORS_STORE);
  return {
    totalPageViews: Number(raw?.totalPageViews) || 0,
    totalUniqueVisitorIds: Array.isArray(raw?.totalUniqueVisitorIds)
      ? raw.totalUniqueVisitorIds
      : [],
    extraUniqueBaseline: Number(raw?.extraUniqueBaseline) || 0,
    byDate: raw?.byDate && typeof raw.byDate === "object" ? raw.byDate : {},
    recentVisits: Array.isArray(raw?.recentVisits) ? raw.recentVisits : [],
    updatedAt: raw?.updatedAt || new Date().toISOString(),
  };
}

export async function recordVisitorHit(params: {
  visitorId: string;
  path: string;
  device?: DeviceCategory;
  referrer?: string;
}): Promise<{ recorded: boolean; totalPageViews: number; totalUniqueVisitors: number }> {
  const cleanPath = normalizeStorefrontPath(params.path);
  if (
    cleanPath.startsWith("/admin") ||
    cleanPath.startsWith("/api") ||
    cleanPath.startsWith("/_next")
  ) {
    const store = readVisitorsStore();
    return {
      recorded: false,
      totalPageViews: store.totalPageViews,
      totalUniqueVisitors:
        store.totalUniqueVisitorIds.length + (store.extraUniqueBaseline || 0),
    };
  }

  const cleanVisitorId =
    String(params.visitorId || "")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40) || `anon_${Date.now().toString(36)}`;
  const device: DeviceCategory =
    params.device === "mobile" || params.device === "tablet" ? params.device : "desktop";

  const now = new Date();
  const cairo = getCairoTimeParts(now);

  return withVisitorsFileLock(() => {
    const store = readVisitorsStore();

    store.totalPageViews += 1;

    if (!store.totalUniqueVisitorIds.includes(cleanVisitorId)) {
      if (store.totalUniqueVisitorIds.length < 20000) {
        store.totalUniqueVisitorIds.push(cleanVisitorId);
      } else {
        store.extraUniqueBaseline = (store.extraUniqueBaseline || 0) + 1;
      }
    }

    if (!store.byDate[cairo.dateStr]) {
      store.byDate[cairo.dateStr] = {
        date: cairo.dateStr,
        dayNameAr: cairo.dayNameAr,
        dayNameEn: cairo.dayNameEn,
        dayOfWeek: cairo.dayOfWeek,
        pageViews: 0,
        uniqueVisitors: 0,
        visitorIds: [],
        hourly: {},
        topPages: {},
        devices: { mobile: 0, desktop: 0, tablet: 0 },
      };
    }

    const dayBucket = store.byDate[cairo.dateStr];
    dayBucket.pageViews += 1;

    if (!Array.isArray(dayBucket.visitorIds)) dayBucket.visitorIds = [];
    if (!dayBucket.visitorIds.includes(cleanVisitorId)) {
      if (dayBucket.visitorIds.length < 5000) {
        dayBucket.visitorIds.push(cleanVisitorId);
      }
      dayBucket.uniqueVisitors += 1;
    }

    if (!dayBucket.hourly || typeof dayBucket.hourly !== "object") dayBucket.hourly = {};
    if (!dayBucket.hourly[cairo.hourKey]) {
      dayBucket.hourly[cairo.hourKey] = { pageViews: 0, uniqueVisitors: 0, visitorIds: [] };
    }
    const hourBucket = dayBucket.hourly[cairo.hourKey];
    hourBucket.pageViews += 1;
    if (!Array.isArray(hourBucket.visitorIds)) hourBucket.visitorIds = [];
    if (!hourBucket.visitorIds.includes(cleanVisitorId)) {
      if (hourBucket.visitorIds.length < 1500) {
        hourBucket.visitorIds.push(cleanVisitorId);
      }
      hourBucket.uniqueVisitors += 1;
    }

    if (!dayBucket.topPages || typeof dayBucket.topPages !== "object") dayBucket.topPages = {};
    dayBucket.topPages[cleanPath] = (dayBucket.topPages[cleanPath] || 0) + 1;

    if (!dayBucket.devices) dayBucket.devices = { mobile: 0, desktop: 0, tablet: 0 };
    dayBucket.devices[device] = (dayBucket.devices[device] || 0) + 1;

    const visitEvent: VisitorEventSummary = {
      id: `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now.toISOString(),
      date: cairo.dateStr,
      dayNameAr: cairo.dayNameAr,
      dayNameEn: cairo.dayNameEn,
      hour: cairo.hour,
      timeLabelAr: cairo.timeLabelAr,
      timeLabelEn: cairo.timeLabelEn,
      path: cleanPath,
      visitorId: cleanVisitorId,
      device,
      ...(params.referrer ? { referrer: String(params.referrer).slice(0, 160) } : {}),
    };

    store.recentVisits = [visitEvent, ...(store.recentVisits || [])].slice(0, 120);
    store.updatedAt = now.toISOString();

    writeJsonFile(VISITORS_FILE, store);

    return {
      recorded: true,
      totalPageViews: store.totalPageViews,
      totalUniqueVisitors:
        store.totalUniqueVisitorIds.length + (store.extraUniqueBaseline || 0),
    };
  });
}

export interface VisitorQueryOptions {
  range?: "today" | "yesterday" | "7d" | "30d" | "all" | "custom";
  date?: string; // YYYY-MM-DD
  dayOfWeek?: number | null; // 0..6
}

export function buildVisitorAnalyticsReport(options: VisitorQueryOptions = {}) {
  const store = readVisitorsStore();
  const now = new Date();
  const todayParts = getCairoTimeParts(now);
  const yesterdayParts = getCairoTimeParts(new Date(now.getTime() - 24 * 60 * 60 * 1000));

  const todayBucket = store.byDate[todayParts.dateStr];
  const yesterdayBucket = store.byDate[yesterdayParts.dateStr];

  // Calculate active visitors in the last 5 minutes
  const fiveMinutesAgoMs = now.getTime() - 5 * 60 * 1000;
  const activeNowVisitors = new Set(
    (store.recentVisits || [])
      .filter((v) => {
        const ts = new Date(v.timestamp).getTime();
        return !isNaN(ts) && ts >= fiveMinutesAgoMs;
      })
      .map((v) => v.visitorId)
  ).size;

  // All recorded dates sorted descending
  const allDateBuckets = Object.values(store.byDate || {}).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  // Determine active date set for the selected range
  const range = options.date ? "custom" : options.range || "today";
  const last7Cutoff = getCairoTimeParts(
    new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  ).dateStr;
  const last30Cutoff = getCairoTimeParts(
    new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
  ).dateStr;

  let filteredBuckets = allDateBuckets.filter((bucket) => {
    if (range === "custom" && options.date) return bucket.date === options.date;
    if (range === "today") return bucket.date === todayParts.dateStr;
    if (range === "yesterday") return bucket.date === yesterdayParts.dateStr;
    if (range === "7d") return bucket.date >= last7Cutoff;
    if (range === "30d") return bucket.date >= last30Cutoff;
    return true;
  });

  if (typeof options.dayOfWeek === "number" && options.dayOfWeek >= 0 && options.dayOfWeek <= 6) {
    filteredBuckets = filteredBuckets.filter((b) => b.dayOfWeek === options.dayOfWeek);
  }

  // Last 7 days summary
  const last7Buckets = allDateBuckets.filter((b) => b.date >= last7Cutoff);
  const last7UniqueSet = new Set<string>();
  let last7ExtraSum = 0;
  let last7Views = 0;
  for (const b of last7Buckets) {
    last7Views += b.pageViews || 0;
    if (Array.isArray(b.visitorIds) && b.visitorIds.length > 0) {
      b.visitorIds.forEach((id) => last7UniqueSet.add(id));
    } else {
      last7ExtraSum += b.uniqueVisitors || 0;
    }
  }

  // Filtered totals + 24-hour aggregation + top pages + devices
  const filteredUniqueSet = new Set<string>();
  let filteredViews = 0;
  let filteredUnmappedUnique = 0;
  const pagesTotals: Record<string, number> = {};
  const devicesTotals = { mobile: 0, desktop: 0, tablet: 0 };

  const hourlyViews = new Array<number>(24).fill(0);
  const hourlyUniqueFallback = new Array<number>(24).fill(0);
  const hourlyUniqueSets: Set<string>[] = Array.from({ length: 24 }, () => new Set<string>());

  for (const bucket of filteredBuckets) {
    filteredViews += bucket.pageViews || 0;
    if (Array.isArray(bucket.visitorIds) && bucket.visitorIds.length > 0) {
      bucket.visitorIds.forEach((id) => filteredUniqueSet.add(id));
    } else {
      filteredUnmappedUnique += bucket.uniqueVisitors || 0;
    }

    for (let h = 0; h < 24; h++) {
      const hKey = String(h).padStart(2, "0");
      const hStats = bucket.hourly?.[hKey];
      if (hStats) {
        hourlyViews[h] += hStats.pageViews || 0;
        if (Array.isArray(hStats.visitorIds) && hStats.visitorIds.length > 0) {
          hStats.visitorIds.forEach((id) => hourlyUniqueSets[h].add(id));
        } else {
          hourlyUniqueFallback[h] += hStats.uniqueVisitors || 0;
        }
      }
    }

    Object.entries(bucket.topPages || {}).forEach(([p, cnt]) => {
      pagesTotals[p] = (pagesTotals[p] || 0) + (Number(cnt) || 0);
    });

    if (bucket.devices) {
      devicesTotals.mobile += bucket.devices.mobile || 0;
      devicesTotals.desktop += bucket.devices.desktop || 0;
      devicesTotals.tablet += bucket.devices.tablet || 0;
    }
  }

  const hourlySeries = Array.from({ length: 24 }, (_, hour) => {
    const visitors =
      hourlyUniqueSets[hour].size > 0
        ? hourlyUniqueSets[hour].size + hourlyUniqueFallback[hour]
        : hourlyUniqueFallback[hour];
    return {
      hour,
      hourKey: String(hour).padStart(2, "0"),
      labelAr: formatHourLabelAr(hour),
      labelEn: formatHourLabelEn(hour),
      views: hourlyViews[hour],
      visitors,
    };
  });

  // Peak hour across active filter
  const peakHourObj = hourlySeries.reduce(
    (best, cur) => (cur.views > best.views ? cur : best),
    hourlySeries[0]
  );

  // Day-of-week breakdown (over last30 / all depending on range: if single day/custom, also show 30d/all weekday trend so weekday panel stays informative)
  const weekdaySourceBuckets =
    range === "today" || range === "yesterday" || range === "custom"
      ? allDateBuckets
      : filteredBuckets;

  const weekdaysSeries = ARABIC_DAYS_SAT_FIRST.map((dayNameAr, idx) => {
    const matching = weekdaySourceBuckets.filter((b) => b.dayOfWeek === idx);
    const views = matching.reduce((s, b) => s + (b.pageViews || 0), 0);
    const uniqueSet = new Set<string>();
    let fallbackUnique = 0;
    matching.forEach((b) => {
      if (Array.isArray(b.visitorIds) && b.visitorIds.length > 0) {
        b.visitorIds.forEach((id) => uniqueSet.add(id));
      } else {
        fallbackUnique += b.uniqueVisitors || 0;
      }
    });
    const visitors = uniqueSet.size + fallbackUnique;
    return {
      dayIndex: idx,
      dayNameAr,
      dayNameEn: ENGLISH_DAYS_SAT_FIRST[idx],
      views,
      visitors,
      daysRecorded: matching.length,
      avgViewsPerDay: matching.length > 0 ? Math.round(views / matching.length) : 0,
    };
  });

  const peakDayObj = weekdaysSeries.reduce(
    (best, cur) => (cur.views > best.views ? cur : best),
    weekdaysSeries[0]
  );

  // Daily dates list with peak hour & top page per date
  const dailyDates = allDateBuckets.map((b) => {
    let bestHour = 0;
    let bestHourViews = 0;
    for (let h = 0; h < 24; h++) {
      const hv = b.hourly?.[String(h).padStart(2, "0")]?.pageViews || 0;
      if (hv > bestHourViews) {
        bestHourViews = hv;
        bestHour = h;
      }
    }

    const sortedDayPages = Object.entries(b.topPages || {}).sort((a, z) => z[1] - a[1]);

    return {
      date: b.date,
      dayNameAr: b.dayNameAr,
      dayNameEn: b.dayNameEn,
      dayOfWeek: b.dayOfWeek,
      uniqueVisitors: b.uniqueVisitors || (b.visitorIds ? b.visitorIds.length : 0),
      pageViews: b.pageViews || 0,
      peakHour: bestHour,
      peakHourLabelAr: bestHourViews > 0 ? formatHourLabelAr(bestHour) : "—",
      peakHourLabelEn: bestHourViews > 0 ? formatHourLabelEn(bestHour) : "—",
      peakHourViews: bestHourViews,
      topPage: sortedDayPages[0]?.[0] || "/",
      devices: b.devices || { mobile: 0, desktop: 0, tablet: 0 },
    };
  });

  const topPages = Object.entries(pagesTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([path, views]) => ({
      path,
      views,
      percentage: filteredViews > 0 ? Math.round((views / filteredViews) * 100) : 0,
    }));

  const recentFilteredVisits = (store.recentVisits || [])
    .filter((v) => {
      if (range === "custom" && options.date) return v.date === options.date;
      if (range === "today") return v.date === todayParts.dateStr;
      if (range === "yesterday") return v.date === yesterdayParts.dateStr;
      return true;
    })
    .slice(0, 25);

  return {
    summary: {
      activeNow: activeNowVisitors,
      todayVisitors: todayBucket?.uniqueVisitors || 0,
      todayViews: todayBucket?.pageViews || 0,
      yesterdayVisitors: yesterdayBucket?.uniqueVisitors || 0,
      yesterdayViews: yesterdayBucket?.pageViews || 0,
      last7DaysVisitors: last7UniqueSet.size + last7ExtraSum,
      last7DaysViews: last7Views,
      totalUniqueVisitors:
        (store.totalUniqueVisitorIds?.length || 0) + (store.extraUniqueBaseline || 0),
      totalPageViews: store.totalPageViews || 0,
      filteredVisitors: filteredUniqueSet.size + filteredUnmappedUnique,
      filteredViews,
      todayDateStr: todayParts.dateStr,
      yesterdayDateStr: yesterdayParts.dateStr,
      todayDayNameAr: todayParts.dayNameAr,
      todayDayNameEn: todayParts.dayNameEn,
      currentCairoHour: todayParts.hour,
      peakHour: peakHourObj,
      peakDay: peakDayObj,
      updatedAt: store.updatedAt,
    },
    hourlySeries,
    weekdaysSeries,
    dailyDates,
    topPages,
    devices: devicesTotals,
    recentVisits: recentFilteredVisits,
  };
}
