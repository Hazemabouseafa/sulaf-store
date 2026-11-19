"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Eye,
  Clock,
  Calendar,
  BarChart3,
  Activity,
  TrendingUp,
  RefreshCw,
  Download,
  Smartphone,
  Globe,
  Filter,
} from "lucide-react";

interface HourlyPoint {
  hour: number;
  hourKey: string;
  labelAr: string;
  labelEn: string;
  views: number;
  visitors: number;
}

interface WeekdayPoint {
  dayIndex: number;
  dayNameAr: string;
  dayNameEn: string;
  views: number;
  visitors: number;
  daysRecorded: number;
  avgViewsPerDay: number;
}

interface DailyDateRow {
  date: string;
  dayNameAr: string;
  dayNameEn: string;
  dayOfWeek: number;
  uniqueVisitors: number;
  pageViews: number;
  peakHour: number;
  peakHourLabelAr: string;
  peakHourLabelEn: string;
  peakHourViews: number;
  topPage: string;
}

interface RecentVisitRow {
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
  device: "mobile" | "desktop" | "tablet";
}

export interface VisitorAnalyticsPayload {
  summary: {
    activeNow: number;
    todayVisitors: number;
    todayViews: number;
    yesterdayVisitors: number;
    yesterdayViews: number;
    last7DaysVisitors: number;
    last7DaysViews: number;
    totalUniqueVisitors: number;
    totalPageViews: number;
    filteredVisitors: number;
    filteredViews: number;
    todayDateStr: string;
    yesterdayDateStr: string;
    todayDayNameAr: string;
    todayDayNameEn: string;
    currentCairoHour: number;
    peakHour: HourlyPoint;
    peakDay: WeekdayPoint;
    updatedAt: string;
  };
  hourlySeries: HourlyPoint[];
  weekdaysSeries: WeekdayPoint[];
  dailyDates: DailyDateRow[];
  topPages: Array<{ path: string; views: number; percentage: number }>;
  devices: { mobile: number; desktop: number; tablet: number };
  recentVisits: RecentVisitRow[];
}

interface VisitorsAnalyticsTabProps {
  adminLang: "ar" | "en";
  initialData?: VisitorAnalyticsPayload | null;
  onSyncExternal?: (payload: VisitorAnalyticsPayload) => void;
}

type RangeMode = "today" | "yesterday" | "7d" | "30d" | "all" | "custom";

export function VisitorsAnalyticsTab({
  adminLang,
  initialData,
  onSyncExternal,
}: VisitorsAnalyticsTabProps) {
  const isAr = adminLang === "ar";
  const [range, setRange] = useState<RangeMode>("today");
  const [selectedDate, setSelectedDate] = useState<string>(
    initialData?.summary?.todayDateStr || ""
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [hourlyMetric, setHourlyMetric] = useState<"visitors" | "views">("visitors");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VisitorAnalyticsPayload | null>(initialData || null);

  const fetchReport = useCallback(
    async (
      nextRange: RangeMode,
      nextDate: string,
      nextDay: string,
      silent = false
    ) => {
      if (!silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("range", nextRange);
        if (nextRange === "custom" && nextDate) {
          params.set("date", nextDate);
        }
        if (nextDay !== "") {
          params.set("day", nextDay);
        }

        const res = await fetch(`/api/visitors?${params.toString()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json);
            if (!nextDate && json.summary?.todayDateStr) {
              setSelectedDate(json.summary.todayDateStr);
            }
            if (nextRange === "today" && nextDay === "" && onSyncExternal) {
              onSyncExternal(json);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch visitor stats:", err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [onSyncExternal]
  );

  useEffect(() => {
    fetchReport(range, selectedDate, selectedDay, Boolean(initialData));
  }, [range, selectedDate, selectedDay, fetchReport]);

  // Keep visitor analytics synced periodically
  useEffect(() => {
    const timer = setInterval(() => {
      fetchReport(range, selectedDate, selectedDay, true);
    }, 25000);
    return () => clearInterval(timer);
  }, [range, selectedDate, selectedDay, fetchReport]);

  function handleExportCsv() {
    if (!data?.dailyDates || data.dailyDates.length === 0) return;
    const headers = isAr
      ? ["التاريخ", "اليوم", "الزوار الفريدون", "إجمالي المشاهدات", "ساعة الذروة", "أكثر صفحة زيارة"]
      : ["Date", "Day", "Unique Visitors", "Page Views", "Peak Hour", "Top Page"];

    const rows = data.dailyDates.map((d) => [
      d.date,
      isAr ? d.dayNameAr : d.dayNameEn,
      String(d.uniqueVisitors),
      String(d.pageViews),
      isAr ? d.peakHourLabelAr : d.peakHourLabelEn,
      d.topPage,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sulaf-visitors-${data.summary?.todayDateStr || "stats"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const summary = data?.summary;
  const hourlySeries = data?.hourlySeries || [];
  const weekdaysSeries = data?.weekdaysSeries || [];
  const dailyDates = data?.dailyDates || [];
  const topPages = data?.topPages || [];
  const devices = data?.devices || { mobile: 0, desktop: 0, tablet: 0 };
  const recentVisits = data?.recentVisits || [];

  const maxHourVal = Math.max(
    1,
    ...hourlySeries.map((h) => (hourlyMetric === "visitors" ? h.visitors : h.views))
  );
  const maxWeekdayVal = Math.max(1, ...weekdaysSeries.map((w) => w.visitors || w.views));
  const totalDeviceHits = devices.mobile + devices.desktop + devices.tablet;

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isAr
                ? `متصل بالخادم الآن • نشط حالياً (آخر 5 دقائق): ${summary?.activeNow ?? 0} زائر`
                : `Live Counter • Active Now (5m): ${summary?.activeNow ?? 0}`}
            </span>
          </div>
          <h2 className="font-bold text-2xl text-[#1c2616]">
            {isAr ? "عداد الزوار والإحصائيات الزمنية" : "Visitor Counter & Traffic Analytics"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
            {isAr
              ? "تحليل لحظي لعدد الزوار والمشاهدات بالتاريخ واليوم والساعة (بتوقيت القاهرة)."
              : "Real-time traffic breakdown by date, day of week, and hour (Cairo time)."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => fetchReport(range, selectedDate, selectedDay, false)}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#3d502d] ${loading ? "animate-spin" : ""}`} />
            <span>{isAr ? "تحديث العداد" : "Refresh"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={dailyDates.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? "تصدير التواريخ CSV" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#dbe2bd] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">
              {isAr ? "زوار اليوم" : "Today's Visitors"}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1c2616]">
            {summary?.todayVisitors ?? 0}{" "}
            <span className="text-xs font-bold text-gray-500">{isAr ? "زائر" : "visitors"}</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-800 mt-1.5 flex items-center justify-between">
            <span>
              {isAr ? `المشاهدات: ${summary?.todayViews ?? 0}` : `Views: ${summary?.todayViews ?? 0}`}
            </span>
            <span className="text-gray-500">
              {isAr ? summary?.todayDayNameAr : summary?.todayDayNameEn}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dbe2bd] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">
              {isAr ? "إجمالي الزوار الفريدين" : "All-Time Unique Visitors"}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1c2616]">
            {summary?.totalUniqueVisitors ?? 0}{" "}
            <span className="text-xs font-bold text-gray-500">{isAr ? "زائر" : "visitors"}</span>
          </div>
          <div className="text-[11px] font-bold text-blue-800 mt-1.5">
            {isAr
              ? `إجمالي تصفح الصفحات: ${summary?.totalPageViews ?? 0} زيارة`
              : `Total pageviews: ${summary?.totalPageViews ?? 0}`}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dbe2bd] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">
              {isAr ? "ساعة الذروة (حسب الفلتر)" : "Peak Hour (Filtered)"}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1c2616]">
            {summary?.peakHour && summary.peakHour.views > 0
              ? isAr
                ? summary.peakHour.labelAr
                : summary.peakHour.labelEn
              : "—"}
          </div>
          <div className="text-[11px] font-bold text-amber-800 mt-1.5">
            {summary?.peakHour && summary.peakHour.views > 0
              ? isAr
                ? `${summary.peakHour.visitors} زائر • ${summary.peakHour.views} مشاهدة`
                : `${summary.peakHour.visitors} visitors • ${summary.peakHour.views} views`
              : isAr
              ? "لا توجد زيارات في هذا النطاق بعد"
              : "No hits in this range yet"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dbe2bd] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">
              {isAr ? "أكثر الأيام نشاطاً" : "Busiest Day of Week"}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1c2616]">
            {summary?.peakDay && summary.peakDay.views > 0
              ? isAr
                ? summary.peakDay.dayNameAr
                : summary.peakDay.dayNameEn
              : "—"}
          </div>
          <div className="text-[11px] font-bold text-purple-800 mt-1.5">
            {summary?.peakDay && summary.peakDay.views > 0
              ? isAr
                ? `${summary.peakDay.visitors} زائر • آخر 7 أيام: ${summary.last7DaysVisitors} زائر`
                : `${summary.peakDay.visitors} visitors • 7d: ${summary.last7DaysVisitors}`
              : isAr
              ? "بانتظار تسجيل بيانات كافية"
              : "Waiting for visit history"}
          </div>
        </div>
      </div>

      {/* Filter Bar by Date & Day */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 me-1">
            <Filter className="w-3.5 h-3.5 text-[#3d502d]" />
            <span>{isAr ? "النطاق الزمني:" : "Date Range:"}</span>
          </span>
          {[
            { id: "today" as const, ar: "اليوم", en: "Today" },
            { id: "yesterday" as const, ar: "أمس", en: "Yesterday" },
            { id: "7d" as const, ar: "آخر 7 أيام", en: "Last 7 Days" },
            { id: "30d" as const, ar: "آخر 30 يوم", en: "Last 30 Days" },
            { id: "all" as const, ar: "الكل", en: "All Time" },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => {
                setRange(btn.id);
                if (btn.id === "today" && summary?.todayDateStr) {
                  setSelectedDate(summary.todayDateStr);
                } else if (btn.id === "yesterday" && summary?.yesterdayDateStr) {
                  setSelectedDate(summary.yesterdayDateStr);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                range === btn.id
                  ? "bg-[#3d502d] text-white shadow-xs"
                  : "bg-[#f6f9e6] hover:bg-[#e8ecd0] text-[#1c2616]"
              }`}
            >
              {isAr ? btn.ar : btn.en}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Exact Calendar Date Picker */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Calendar className="w-3.5 h-3.5 text-[#3d502d]" />
            <span className="text-[11px] font-bold text-gray-600">
              {isAr ? "تاريخ محدد:" : "Exact Date:"}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setRange("custom");
                }
              }}
              className="text-xs font-mono font-bold bg-transparent text-gray-900 focus:outline-none"
            />
          </div>

          {/* Filter by Day of Week */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#3d502d]"
          >
            <option value="">{isAr ? "كل أيام الأسبوع" : "All Days of Week"}</option>
            {[
              { ar: "السبت", en: "Saturday" },
              { ar: "الأحد", en: "Sunday" },
              { ar: "الإثنين", en: "Monday" },
              { ar: "الثلاثاء", en: "Tuesday" },
              { ar: "الأربعاء", en: "Wednesday" },
              { ar: "الخميس", en: "Thursday" },
              { ar: "الجمعة", en: "Friday" },
            ].map((dayItem, idx) => (
              <option key={idx} value={String(idx)}>
                {isAr ? `يوم ${dayItem.ar}` : dayItem.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. HOURLY BREAKDOWN (24 HOURS) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-[#1c2616] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3d502d]" />
              <span>
                {isAr
                  ? "توزيع الزوار بالساعة (24 ساعة)"
                  : "Hourly Visitor Breakdown (24 Hours)"}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAr
                ? `إجمالي الفلتر المحدد: ${summary?.filteredVisitors ?? 0} زائر فريد • ${summary?.filteredViews ?? 0} مشاهدة`
                : `Filtered total: ${summary?.filteredVisitors ?? 0} unique visitors • ${summary?.filteredViews ?? 0} views`}
              {range === "custom" && selectedDate ? ` (${selectedDate})` : ""}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setHourlyMetric("visitors")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                hourlyMetric === "visitors"
                  ? "bg-white text-[#3d502d] shadow-xs"
                  : "text-gray-600"
              }`}
            >
              {isAr ? "الزوار الفريدون" : "Unique Visitors"}
            </button>
            <button
              type="button"
              onClick={() => setHourlyMetric("views")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                hourlyMetric === "views"
                  ? "bg-white text-[#3d502d] shadow-xs"
                  : "text-gray-600"
              }`}
            >
              {isAr ? "المشاهدات" : "Page Views"}
            </button>
          </div>
        </div>

        {/* 24-Bar Visual Chart */}
        <div className="pt-2 overflow-x-auto">
          <div className="min-w-[680px] h-52 flex items-end gap-1.5 border-b border-gray-200 pb-2 px-1">
            {hourlySeries.map((h) => {
              const val = hourlyMetric === "visitors" ? h.visitors : h.views;
              const pct = val > 0 ? Math.max(8, Math.round((val / maxHourVal) * 100)) : 3;
              const isPeak =
                summary?.peakHour &&
                summary.peakHour.hour === h.hour &&
                val > 0;
              const isCurrentCairoHour =
                range === "today" && summary?.currentCairoHour === h.hour;

              return (
                <div
                  key={h.hourKey}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  title={`${isAr ? h.labelAr : h.labelEn}: ${h.visitors} زائر / ${h.views} مشاهدة`}
                >
                  {val > 0 && (
                    <span className="text-[10px] font-mono font-black text-gray-700 mb-1">
                      {val}
                    </span>
                  )}
                  <div
                    style={{ height: `${pct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isPeak
                        ? "bg-gradient-to-t from-[#610b0d] to-[#ca384a]"
                        : isCurrentCairoHour
                        ? "bg-gradient-to-t from-amber-600 to-amber-400"
                        : val > 0
                        ? "bg-gradient-to-t from-[#3d502d] to-[#63804b]"
                        : "bg-gray-100"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold mt-1.5 whitespace-nowrap ${
                      isPeak
                        ? "text-[#610b0d]"
                        : isCurrentCairoHour
                        ? "text-amber-800"
                        : "text-gray-500"
                    }`}
                  >
                    {isAr ? h.labelAr : h.hourKey}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#3d502d] inline-block" />
            <span>{isAr ? "نشاط عادي" : "Regular traffic"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#ca384a] inline-block" />
            <span>{isAr ? "ساعة الذروة" : "Peak hour"}</span>
          </div>
          {range === "today" && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
              <span>{isAr ? "الساعة الحالية الآن (بتوقيت القاهرة)" : "Current Cairo hour"}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. DAY OF WEEK & DEVICES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekday Breakdown */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1c2616] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3d502d]" />
                <span>{isAr ? "الإحصائيات حسب اليوم (أيام الأسبوع)" : "Stats by Day of Week"}</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? "مقارنة حجم الزوار والمشاهدات من السبت إلى الجمعة" : "Traffic comparison Saturday to Friday"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {weekdaysSeries.map((day) => {
              const barVal = day.visitors || day.views;
              const pct = barVal > 0 ? Math.max(6, Math.round((barVal / maxWeekdayVal) * 100)) : 0;
              const isSelectedWeekday = selectedDay === String(day.dayIndex);

              return (
                <button
                  key={day.dayIndex}
                  type="button"
                  onClick={() =>
                    setSelectedDay(isSelectedWeekday ? "" : String(day.dayIndex))
                  }
                  className={`w-full text-start p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelectedWeekday
                      ? "bg-[#f6f9e6] border-[#3d502d] ring-1 ring-[#3d502d]"
                      : "bg-gray-50/60 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#1c2616]">
                      {isAr ? day.dayNameAr : day.dayNameEn}
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-[#3d502d]">
                        {day.visitors} {isAr ? "زائر" : "visitors"}
                      </span>
                      <span className="text-gray-500">
                        {day.views} {isAr ? "مشاهدة" : "views"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#3d502d] to-[#749656] transition-all duration-300"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Pages & Devices */}
        <div className="lg:col-span-5 space-y-6">
          {/* Devices */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#1c2616] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#3d502d]" />
              <span>{isAr ? "توزيع أجهزة الزوار" : "Visitor Devices"}</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              {[
                { key: "mobile", labelAr: "موبايل", labelEn: "Mobile", val: devices.mobile },
                { key: "desktop", labelAr: "كمبيوتر", labelEn: "Desktop", val: devices.desktop },
                { key: "tablet", labelAr: "تابلت", labelEn: "Tablet", val: devices.tablet },
              ].map((d) => {
                const pct = totalDeviceHits > 0 ? Math.round((d.val / totalDeviceHits) * 100) : 0;
                return (
                  <div
                    key={d.key}
                    className="p-3 rounded-2xl bg-[#f6f9e6]/70 border border-[#dbe2bd] space-y-1"
                  >
                    <div className="text-xs font-bold text-gray-600">
                      {isAr ? d.labelAr : d.labelEn}
                    </div>
                    <div className="text-xl font-black text-[#1c2616]">{pct}%</div>
                    <div className="text-[10px] font-mono text-gray-500">{d.val}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#1c2616] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3d502d]" />
              <span>{isAr ? "أكثر الصفحات زيارة" : "Most Visited Pages"}</span>
            </h3>
            {topPages.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                {isAr ? "لا توجد زيارات مسجلة في هذا النطاق بعد." : "No pageviews recorded in this range."}
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {topPages.map((p) => (
                  <div
                    key={p.path}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                  >
                    <span className="font-mono text-gray-800 truncate max-w-[200px]" dir="ltr">
                      {p.path}
                    </span>
                    <span className="font-bold text-[#3d502d] shrink-0">
                      {p.views} ({p.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. DATE BY DATE HISTORY TABLE */}
      <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-lg text-[#1c2616] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3d502d]" />
              <span>{isAr ? "سجل الزيارات بالتاريخ" : "Daily Visitor Log by Date"}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAr
                ? "اضغط على أي تاريخ لعرض تفاصيل ساعاته في الرسم البياني بالأعلى"
                : "Click any date row to inspect its 24-hour distribution"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border border-[#dbe2bd]">
            {dailyDates.length} {isAr ? "يوم مسجل" : "dates"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
              <tr>
                <th className="py-3 px-4">{isAr ? "التاريخ" : "Date"}</th>
                <th className="py-3 px-4">{isAr ? "اليوم" : "Day"}</th>
                <th className="py-3 px-4">{isAr ? "الزوار الفريدون" : "Unique Visitors"}</th>
                <th className="py-3 px-4">{isAr ? "إجمالي المشاهدات" : "Page Views"}</th>
                <th className="py-3 px-4">{isAr ? "ساعة الذروة" : "Peak Hour"}</th>
                <th className="py-3 px-4">{isAr ? "أبرز صفحة" : "Top Page"}</th>
                <th className="py-3 px-4 text-center">{isAr ? "التفصيل الساعي" : "Hourly View"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dailyDates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-gray-500 font-semibold">
                    {isAr
                      ? "سيبدأ ظهور سجل الزوار تلقائياً بمجرد تصفح أي عميل لصفحات المتجر."
                      : "Visitor statistics will appear automatically as customers browse the store."}
                  </td>
                </tr>
              ) : (
                dailyDates.map((row) => (
                  <tr
                    key={row.date}
                    className={`hover:bg-gray-50/90 transition-colors ${
                      range === "custom" && selectedDate === row.date ? "bg-emerald-50/60" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1c2616]">{row.date}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {isAr ? row.dayNameAr : row.dayNameEn}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-800">{row.uniqueVisitors}</td>
                    <td className="py-3 px-4 font-bold text-gray-700">{row.pageViews}</td>
                    <td className="py-3 px-4 text-xs font-bold text-amber-800">
                      {isAr ? row.peakHourLabelAr : row.peakHourLabelEn}{" "}
                      {row.peakHourViews > 0 ? `(${row.peakHourViews})` : ""}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600" dir="ltr">
                      {row.topPage}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(row.date);
                          setRange("custom");
                        }}
                        className="px-3 py-1 rounded-lg bg-[#f6f9e6] hover:bg-[#3d502d] hover:text-white text-[#3d502d] text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isAr ? "عرض الساعات" : "View Hours"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. RECENT LIVE VISITS FEED */}
      <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-[#1c2616] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#3d502d]" />
            <span>{isAr ? "أحدث الزيارات المباشرة (بالتاريخ واليوم والساعة)" : "Latest Live Visits"}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="py-2.5 px-4">{isAr ? "التاريخ واليوم" : "Date & Day"}</th>
                <th className="py-2.5 px-4">{isAr ? "الوقت" : "Time"}</th>
                <th className="py-2.5 px-4">{isAr ? "الصفحة" : "Page"}</th>
                <th className="py-2.5 px-4">{isAr ? "الجهاز" : "Device"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    {isAr ? "لا توجد زيارات حديثة مسجلة." : "No recent visits recorded yet."}
                  </td>
                </tr>
              ) : (
                recentVisits.slice(0, 15).map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-4 font-semibold text-gray-800">
                      <span className="font-mono">{v.date}</span> •{" "}
                      <span>{isAr ? v.dayNameAr : v.dayNameEn}</span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#3d502d]">
                      {isAr ? v.timeLabelAr : v.timeLabelEn}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-gray-700" dir="ltr">
                      {v.path}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
                        {v.device === "mobile"
                          ? isAr
                            ? "موبايل"
                            : "Mobile"
                          : v.device === "tablet"
                          ? isAr
                            ? "تابلت"
                            : "Tablet"
                          : isAr
                          ? "كمبيوتر"
                          : "Desktop"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
