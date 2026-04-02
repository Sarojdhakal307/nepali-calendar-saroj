import React, { useState, useEffect, useRef } from "react";
import calendarData from "./data/calendarData.json";
import { adToBs } from "./adToBs";
import { bsToAd } from "./bsToAd";
import {
  NEPALI_MONTHS,
  NEPALI_MONTHS_EN,
  NEPALI_WEEKDAYS_SHORT,
  EN_WEEKDAYS_SHORT,
  toNepaliNumber,
  formatBsDate,
  formatAdDate,
} from "./nepaliFormat";
import type {
  CalendarData,
  CalendarYear,
  BsDate,
  NepaliCalendarProps,
  NepaliDatePickerProps,
} from "./type";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CalendarMode = "dark" | "light";

// ─── Data ─────────────────────────────────────────────────────────────────────

const YEARS: CalendarYear[] = (calendarData as CalendarData).years;

function getYearData(year: number): CalendarYear | undefined {
  return YEARS.find((y) => y.year === year);
}

function firstDayOfMonth(bsYear: number, bsMonth: number): number {
  const yd = getYearData(bsYear);
  if (!yd) return 0;
  const startDow   = yd.start_day_of_year % 7;
  const daysOffset = yd.months.slice(0, bsMonth - 1).reduce((a, b) => a + b, 0);
  return (startDow + daysOffset) % 7;
}

// ─── Helper: convert AD Date → BsDate ────────────────────────────────────────

/**
 * Converts a JS Date (AD) to a BsDate object using adToBs.
 * adToBs already accepts a Date object (e.g. adToBs(new Date())).
 */
function adDateToBs(ad: Date | null | undefined): BsDate | null {
  if (!ad) return null;
  return adToBs(ad) ?? null;
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const DARK_VARS = `
  --nc-bg:       #0f0f11;
  --nc-surface:  #18181c;
  --nc-surface2: #222228;
  --nc-border:   #2e2e38;
  --nc-accent:   #e8c97e;
  --nc-accent2:  #c4a45a;
  --nc-text:     #f0ede8;
  --nc-text2:    #8b8796;
  --nc-text3:    #5a5668;
  --nc-red:      #e05c5c;
  --nc-hover:    #24242c;
  --nc-sel-bg:   #e8c97e;
  --nc-sel-fg:   #0f0f11;
`;

const LIGHT_VARS = `
  --nc-bg:       #f8f7f4;
  --nc-surface:  #ffffff;
  --nc-surface2: #f2f0eb;
  --nc-border:   #e2ddd6;
  --nc-accent:   #b07d2e;
  --nc-accent2:  #8f6420;
  --nc-text:     #1c1a17;
  --nc-text2:    #6b6560;
  --nc-text3:    #a09890;
  --nc-red:      #c0392b;
  --nc-hover:    #f0ede8;
  --nc-sel-bg:   #b07d2e;
  --nc-sel-fg:   #ffffff;
`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

  .nc-card *, .nc-card *::before, .nc-card *::after,
  .nc-picker-wrap *, .nc-picker-wrap *::before, .nc-picker-wrap *::after,
  .nc-dropdown *, .nc-dropdown *::before, .nc-dropdown *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  /* ── Theme scopes ── */
  .nc-theme-dark  { ${DARK_VARS}  }
  .nc-theme-light { ${LIGHT_VARS} }

  /* ── card ── */
  .nc-card {
    font-family: 'Noto Sans Devanagari', 'DM Mono', sans-serif;
    background: var(--nc-surface);
    border: 1px solid var(--nc-border);
    border-radius: var(--nc-r);
    width: 296px;
    overflow: hidden;
  }
  .nc-card-elevated { box-shadow: 0 8px 40px rgba(0,0,0,0.18); }
  .nc-theme-dark  .nc-card-elevated,
  .nc-theme-dark.nc-card-elevated { box-shadow: 0 8px 40px rgba(0,0,0,0.45); }

  .nc-card    { --nc-r: 12px; --nc-r-sm: 8px; }

  /* ── header ── */
  .nc-header {
    display: flex; align-items: center; gap: 6px;
    padding: 14px 12px 10px;
    border-bottom: 1px solid var(--nc-border);
  }
  .nc-nav {
    flex-shrink: 0; background: none;
    border: 1px solid var(--nc-border); border-radius: 6px;
    color: var(--nc-text2);
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 11px;
    transition: background 0.12s, color 0.12s, border-color 0.12s;
  }
  .nc-nav:hover { background: var(--nc-hover); color: var(--nc-text); border-color: var(--nc-text3); }

  .nc-title-btn {
    flex: 1; background: none; border: none; cursor: pointer;
    border-radius: 6px; padding: 4px 6px; text-align: center;
    transition: background 0.12s;
  }
  .nc-title-btn:hover { background: var(--nc-hover); }
  .nc-title-main { font-size: 14px; font-weight: 600; color: var(--nc-text); line-height: 1.3; }
  .nc-title-sub  { font-family: 'DM Mono', monospace; font-size: 9.5px; color: var(--nc-text3); margin-top: 1px; }

  /* ── year picker ── */
  .nc-year-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 3px; padding: 10px;
    max-height: 272px; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--nc-border) transparent;
  }
  .nc-year-grid::-webkit-scrollbar { width: 4px; }
  .nc-year-grid::-webkit-scrollbar-thumb { background: var(--nc-border); border-radius: 2px; }
  .nc-yr-btn {
    background: none; border: 1px solid transparent; border-radius: 6px;
    color: var(--nc-text2); cursor: pointer; padding: 5px 2px;
    font-family: 'DM Mono', monospace; font-size: 11px;
    transition: all 0.1s; text-align: center;
  }
  .nc-yr-btn:hover { background: var(--nc-hover); color: var(--nc-text); }
  .nc-yr-btn.is-cur { background: var(--nc-sel-bg); color: var(--nc-sel-fg); font-weight: 700; }

  /* ── weekdays ── */
  .nc-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); padding: 8px 10px 2px; }
  .nc-wd { text-align: center; font-size: 9.5px; font-weight: 500; color: var(--nc-text3); padding: 2px 0; }
  .nc-wd.is-sat { color: var(--nc-red); opacity: 0.7; }

  /* ── days ── */
  .nc-days { display: grid; grid-template-columns: repeat(7, 1fr); padding: 2px 10px 12px; gap: 2px; }
  .nc-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; font-size: 12.5px; color: var(--nc-text);
    cursor: pointer; transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .nc-day:hover    { background: var(--nc-hover); }
  .nc-day.is-sat   { color: var(--nc-red); }
  .nc-day.is-today { box-shadow: 0 0 0 1.5px var(--nc-accent); color: var(--nc-accent); font-weight: 600; }
  .nc-day.is-selected { background: var(--nc-sel-bg) !important; color: var(--nc-sel-fg) !important; font-weight: 700; }
  .nc-day.is-today.is-selected { box-shadow: 0 0 0 2px var(--nc-accent2); }

  /* ── selected bar ── */
  .nc-sel-bar {
    border-top: 1px solid var(--nc-border);
    padding: 10px 14px; display: flex; align-items: center;
    justify-content: space-between; gap: 8px; min-height: 52px;
  }
  .nc-sel-bs  { font-size: 13.5px; font-weight: 600; color: var(--nc-accent); line-height: 1.3; }
  .nc-sel-ad  { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--nc-text3); margin-top: 2px; }
  .nc-sel-empty {
    border-top: 1px solid var(--nc-border); padding: 14px;
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--nc-text3); font-style: italic;
    min-height: 52px; display: flex; align-items: center;
  }
  .nc-clear-btn {
    background: none; border: none; color: var(--nc-text3);
    cursor: pointer; font-size: 15px; padding: 3px 5px;
    border-radius: 4px; line-height: 1; transition: color 0.12s; flex-shrink: 0;
  }
  .nc-clear-btn:hover { color: var(--nc-text); }

  /* ── picker trigger ── */
  .nc-trigger {
    display: flex; align-items: center; gap: 10px;
    background: var(--nc-surface); border: 1px solid var(--nc-border);
    border-radius: var(--nc-r-sm); padding: 10px 14px;
    cursor: pointer; width: 296px; text-align: left;
    font-family: 'Noto Sans Devanagari', sans-serif;
    transition: border-color 0.15s, background 0.15s;
  }
  .nc-trigger:hover   { border-color: var(--nc-text3); background: var(--nc-hover); }
  .nc-trigger.is-open { border-color: var(--nc-accent); }
  .nc-trigger-icon  { font-size: 15px; opacity: 0.55; flex-shrink: 0; }
  .nc-trigger-body  { flex: 1; min-width: 0; }
  .nc-trigger-main  {
    font-size: 13.5px; font-weight: 500; color: var(--nc-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .nc-trigger-main.is-ph { color: var(--nc-text3); }
  .nc-trigger-sub   { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--nc-text3); margin-top: 1px; }
  .nc-trigger-arrow { font-size: 9px; color: var(--nc-text3); transition: transform 0.18s; flex-shrink: 0; }
  .nc-trigger.is-open .nc-trigger-arrow { transform: rotate(180deg); }

  /* ── picker dropdown ── */
  .nc-picker-wrap { position: relative; }
  .nc-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0;
    z-index: 1000; animation: ncDrop 0.14s ease;
  }
  @keyframes ncDrop {
    from { opacity: 0; transform: translateY(-5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Internal: inject styles once ────────────────────────────────────────────

let stylesInjected = false;
function injectStyles(): void {
  if (stylesInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.setAttribute("data-nepali-calendar", "");
  tag.textContent = CSS;
  document.head.appendChild(tag);
  stylesInjected = true;
}

// ─── Internal: theme class helper ────────────────────────────────────────────

function themeClass(mode: CalendarMode): string {
  return mode === "light" ? "nc-theme-light" : "nc-theme-dark";
}

// ─── Internal: CalendarCore ───────────────────────────────────────────────────

interface CalendarCoreProps {
  initYear:   number;
  initMonth:  number;
  selected:   BsDate | null;
  onSelect:   (bs: BsDate) => void;
  showNepali: boolean;
}

const CalendarCore: React.FC<CalendarCoreProps> = ({
  initYear, initMonth, selected, onSelect, showNepali,
}) => {
  const [viewYear,  setViewYear]  = useState<number>(initYear);
  const [viewMonth, setViewMonth] = useState<number>(initMonth);
  const [showYears, setShowYears] = useState<boolean>(false);
  const yearGridRef = useRef<HTMLDivElement>(null);

  const todayBs = adToBs(new Date());
  const yd      = getYearData(viewYear);

  if (!yd) {
    return (
      <div style={{ padding: 16, color: "var(--nc-text3)", fontFamily: "DM Mono, monospace", fontSize: 12 }}>
        No data for year {viewYear}
      </div>
    );
  }

  const monthDays = yd.months[viewMonth - 1];
  const firstDay  = firstDayOfMonth(viewYear, viewMonth);
  const dayLabels = showNepali ? NEPALI_WEEKDAYS_SHORT : EN_WEEKDAYS_SHORT;
  const adStart   = bsToAd(viewYear, viewMonth, 1);
  const adLabel   = adStart ? formatAdDate(adStart) : "";

  const prevMonth = () => {
    if (viewMonth === 1) {
      const idx = YEARS.findIndex((y) => y.year === viewYear);
      if (idx > 0) { setViewYear(YEARS[idx - 1].year); setViewMonth(12); }
    } else { setViewMonth((m) => m - 1); }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      const idx = YEARS.findIndex((y) => y.year === viewYear);
      if (idx < YEARS.length - 1) { setViewYear(YEARS[idx + 1].year); setViewMonth(1); }
    } else { setViewMonth((m) => m + 1); }
  };

  const isToday    = (d: number) => !!todayBs && todayBs.year === viewYear && todayBs.month === viewMonth && todayBs.day === d;
  const isSelected = (d: number) => !!selected && selected.year === viewYear && selected.month === viewMonth && selected.day === d;

  useEffect(() => {
    if (showYears && yearGridRef.current) {
      yearGridRef.current.querySelector<HTMLButtonElement>(".is-cur")?.scrollIntoView({ block: "center" });
    }
  }, [showYears]);

  return (
    <>
      <div className="nc-header">
        <button className="nc-nav" onClick={prevMonth} aria-label="Previous month">◀</button>
        <button className="nc-title-btn" onClick={() => setShowYears((v) => !v)} aria-label="Pick year">
          <div className="nc-title-main">
            {showNepali
              ? `${NEPALI_MONTHS[viewMonth - 1]} ${toNepaliNumber(viewYear)}`
              : `${NEPALI_MONTHS_EN[viewMonth - 1]} ${viewYear}`}
          </div>
          <div className="nc-title-sub">{adLabel}</div>
        </button>
        <button className="nc-nav" onClick={nextMonth} aria-label="Next month">▶</button>
      </div>

      {showYears ? (
        <div className="nc-year-grid" ref={yearGridRef}>
          {YEARS.map((yd) => (
            <button
              key={yd.year}
              className={`nc-yr-btn${yd.year === viewYear ? " is-cur" : ""}`}
              onClick={() => { setViewYear(yd.year); setShowYears(false); }}
            >
              {yd.year}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="nc-weekdays">
            {dayLabels.map((label, i) => (
              <div key={i} className={`nc-wd${i === 6 ? " is-sat" : ""}`}>{label}</div>
            ))}
          </div>
          <div className="nc-days">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: monthDays }).map((_, i) => {
              const day = i + 1;
              const dow = (firstDay + i) % 7;
              const cls = [
                "nc-day",
                dow === 6       ? "is-sat"      : "",
                isToday(day)    ? "is-today"    : "",
                isSelected(day) ? "is-selected" : "",
              ].filter(Boolean).join(" ");
              return (
                <div
                  key={day} className={cls}
                  onClick={() => onSelect({ year: viewYear, month: viewMonth, day })}
                  role="button" tabIndex={0}
                  aria-label={`${viewYear} ${NEPALI_MONTHS_EN[viewMonth - 1]} ${day}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onSelect({ year: viewYear, month: viewMonth, day });
                  }}
                >
                  {showNepali ? toNepaliNumber(day) : day}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

// ─── Internal: SelectedBar ────────────────────────────────────────────────────

interface SelectedBarProps {
  selected:   BsDate | null;
  showNepali: boolean;
  onClear:    () => void;
}

const SelectedBar: React.FC<SelectedBarProps> = ({ selected, showNepali, onClear }) => {
  if (!selected) return <div className="nc-sel-empty">No date selected</div>;
  const ad = bsToAd(selected.year, selected.month, selected.day);
  return (
    <div className="nc-sel-bar">
      <div>
        <div className="nc-sel-bs">
          {formatBsDate(selected.year, selected.month, selected.day, showNepali)}
        </div>
        {ad && <div className="nc-sel-ad">{formatAdDate(ad)}</div>}
      </div>
      <button className="nc-clear-btn" onClick={onClear} aria-label="Clear selection">✕</button>
    </div>
  );
};

// ─── Public: NepaliCalendar ───────────────────────────────────────────────────

/**
 * NepaliCalendar — inline calendar component.
 *
 * @prop mode  - "dark" (default) | "light"  — controls the colour theme
 *
 * @example
 * <NepaliCalendar mode="light" onChange={(bs, ad) => console.log(bs, ad)} />
 * <NepaliCalendar mode="dark"  onChange={(bs, ad) => console.log(bs, ad)} />
 */
export const NepaliCalendar: React.FC<NepaliCalendarProps & { mode?: CalendarMode }> = ({
  value,
  defaultValue,
  onChange,
  showNepali = true,
  showSelectedBar = true,
  className,
  mode = "light",
}) => {
  injectStyles();

  const todayBs = adToBs(new Date());
  const [internal, setInternal] = useState<BsDate | null>(
    value !== undefined ? (value ?? null) : (defaultValue ?? null)
  );

  useEffect(() => {
    if (value !== undefined) setInternal(value ?? null);
  }, [value]);

  const selected  = value !== undefined ? (value ?? null) : internal;
  const initYear  = selected?.year  ?? todayBs?.year  ?? YEARS[YEARS.length - 1].year;
  const initMonth = selected?.month ?? todayBs?.month ?? 1;

  const handleSelect = (bs: BsDate) => {
    const ad = bsToAd(bs.year, bs.month, bs.day);
    if (value === undefined) setInternal(bs);
    onChange?.(bs, ad);
  };

  const handleClear = () => {
    if (value === undefined) setInternal(null);
    onChange?.(null, null);
  };

  return (
    <div className={`${themeClass(mode)} nc-card nc-card-elevated${className ? ` ${className}` : ""}`}>
      <CalendarCore
        initYear={initYear} initMonth={initMonth}
        selected={selected} onSelect={handleSelect} showNepali={showNepali}
      />
      {showSelectedBar && (
        <SelectedBar selected={selected} showNepali={showNepali} onClear={handleClear} />
      )}
    </div>
  );
};

// ─── Public: NepaliDatePicker ─────────────────────────────────────────────────

/**
 * Extended props for NepaliDatePicker that support both BS and AD date inputs.
 */
export interface NepaliDatePickerExtendedProps
  extends Omit<NepaliDatePickerProps, "value" | "defaultValue"> {
  mode?: CalendarMode;

  /**
   * Controlled BS date value.
   * Use this when you want to control the picker with a BS date object.
   * @example value={{ year: 2082, month: 1, day: 1 }}
   */
  value?: BsDate | null;

  /**
   * Controlled AD date value (JS Date).
   * Automatically converted to BS internally.
   * Takes precedence over `defaultAdValue` but is ignored if `value` is set.
   * @example adValue={new Date("2025-04-14")}
   */
  adValue?: Date | null;

  /**
   * Default AD date value for uncontrolled usage (JS Date).
   * Automatically converted to BS internally.
   * Only used on first render; ignored if `value` or `adValue` is set.
   * @example defaultAdValue={new Date("2025-01-01")}
   */
  defaultAdValue?: Date | null;
}

/**
 * NepaliDatePicker — trigger button + dropdown calendar.
 *
 * Supports three ways to set an initial/controlled date:
 *   1. `value`          — a BS date object  { year, month, day }
 *   2. `adValue`        — a JS Date (AD), auto-converted to BS (controlled)
 *   3. `defaultAdValue` — a JS Date (AD), auto-converted to BS (uncontrolled, first render only)
 *
 * `onChange` always fires with both the BS date and the equivalent AD Date:
 *   onChange={(bs, ad) => { ... }}
 *
 * @example
 * // Uncontrolled with an AD default
 * <NepaliDatePicker
 *   defaultAdValue={new Date("2025-04-14")}
 *   onChange={(bs, ad) => console.log(bs, ad)}
 * />
 *
 * // Controlled with an AD date
 * const [date, setDate] = useState<Date | null>(new Date());
 * <NepaliDatePicker
 *   adValue={date}
 *   onChange={(bs, ad) => setDate(ad)}
 * />
 *
 * // Original BS value prop (unchanged)
 * <NepaliDatePicker
 *   value={{ year: 2082, month: 1, day: 1 }}
 *   onChange={(bs, ad) => console.log(ad)}
 * />
 */
export const NepaliDatePicker: React.FC<NepaliDatePickerExtendedProps> = ({
  value,
  adValue,
  defaultAdValue,
  onChange,
  placeholder = "मिति छान्नुहोस्",
  showNepali = true,
  className,
  mode = "light",
}) => {
  injectStyles();

  const todayBs = adToBs(new Date());

  // Resolve initial BS value from whichever prop was provided
  const resolveInitial = (): BsDate | null => {
    if (value !== undefined) return value ?? null;
    if (adValue !== undefined) return adDateToBs(adValue);
    if (defaultAdValue !== undefined) return adDateToBs(defaultAdValue);
    return null;
  };

  const [open, setOpen]         = useState<boolean>(false);
  const [internal, setInternal] = useState<BsDate | null>(resolveInitial);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync controlled props → internal state
  useEffect(() => {
    if (value !== undefined) {
      setInternal(value ?? null);
    } else if (adValue !== undefined) {
      setInternal(adDateToBs(adValue));
    }
  }, [value, adValue]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Determine what to display: controlled value wins, then internal state
  const selected: BsDate | null =
    value !== undefined   ? (value ?? null)      :
    adValue !== undefined ? adDateToBs(adValue)  :
    internal;

  const initYear  = selected?.year  ?? todayBs?.year  ?? YEARS[YEARS.length - 1].year;
  const initMonth = selected?.month ?? todayBs?.month ?? 1;
  const selectedAd = selected ? bsToAd(selected.year, selected.month, selected.day) : null;

  const handleSelect = (bs: BsDate) => {
    const ad = bsToAd(bs.year, bs.month, bs.day);
    // Only update internal state in uncontrolled mode
    if (value === undefined && adValue === undefined) setInternal(bs);
    onChange?.(bs, ad);
    setOpen(false);
  };

  const handleClear = () => {
    if (value === undefined && adValue === undefined) setInternal(null);
    onChange?.(null, null);
    setOpen(false);
  };

  return (
    <div
      className={`${themeClass(mode)} nc-picker-wrap${className ? ` ${className}` : ""}`}
      ref={wrapRef}
    >
      <button
        type="button"
        className={`nc-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="nc-trigger-icon">📅</span>
        <span className="nc-trigger-body">
          <div className={`nc-trigger-main${selected ? "" : " is-ph"}`}>
            {selected
              ? formatBsDate(selected.year, selected.month, selected.day, showNepali)
              : placeholder}
          </div>
          {selected && selectedAd && (
            <div className="nc-trigger-sub">{formatAdDate(selectedAd)}</div>
          )}
        </span>
        <span className="nc-trigger-arrow">▼</span>
      </button>

      {open && (
        <div className="nc-dropdown" role="dialog" aria-modal="true">
          <div
            className={`${themeClass(mode)} nc-card`}
            style={{
              boxShadow:
                mode === "dark"
                  ? "0 20px 56px rgba(0,0,0,0.65)"
                  : "0 20px 56px rgba(0,0,0,0.15)",
            }}
          >
            <CalendarCore
              initYear={initYear} initMonth={initMonth}
              selected={selected} onSelect={handleSelect} showNepali={showNepali}
            />
            <SelectedBar selected={selected} showNepali={showNepali} onClear={handleClear} />
          </div>
        </div>
      )}
    </div>
  );
};