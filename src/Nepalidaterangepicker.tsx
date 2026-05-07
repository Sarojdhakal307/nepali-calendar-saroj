import React, { useState, useEffect, useRef } from "react";
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
import type { CalendarData, CalendarYear, BsDate } from "./type";
import calendarData from "./data/calendarData.json";
import { CalendarMode } from "./Calendar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BsDateRange {
  start: BsDate | null;
  end: BsDate | null;
}

export interface AdDateRange {
  start: Date | null;
  end: Date | null;
}

export interface NepaliDateRangePickerProps {
  /** Controlled BS range value */
  value?: BsDateRange | null;
  /** Uncontrolled BS default range */
  defaultValue?: BsDateRange | null;
  /** Controlled AD range (JS Dates), auto-converted to BS */
  adValue?: AdDateRange | null;
  /** Uncontrolled AD default range, auto-converted to BS */
  defaultAdValue?: AdDateRange | null;
  /** Fired whenever the range changes. Receives both BS and AD ranges. */
  onChange?: (bs: BsDateRange, ad: AdDateRange) => void;
  /** Placeholder shown when no start date is selected */
  startPlaceholder?: string;
  /** Placeholder shown when no end date is selected */
  endPlaceholder?: string;
  /** Show Nepali (Devanagari) numerals and month names */
  showNepali?: boolean;
  /** "light" | "dark" */
  mode?: CalendarMode;
  /** Extra class on the root wrapper */
  className?: string;
  /** Minimum selectable BS date */
  minDate?: BsDate;
  /** Maximum selectable BS date */
  maxDate?: BsDate;
}

/** Inline calendar that shows two months side-by-side for range selection. */
export interface NepaliCalendarRangeProps {
  value?: BsDateRange | null;
  defaultValue?: BsDateRange | null;
  onChange?: (bs: BsDateRange, ad: AdDateRange) => void;
  showNepali?: boolean;
  mode?: CalendarMode;
  className?: string;
  minDate?: BsDate;
  maxDate?: BsDate;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const YEARS: CalendarYear[] = (calendarData as CalendarData).years;

function getYearData(year: number): CalendarYear | undefined {
  return YEARS.find((y) => y.year === year);
}

function firstDayOfMonth(bsYear: number, bsMonth: number): number {
  const yd = getYearData(bsYear);
  if (!yd) return 0;
  const startDow = yd.start_day_of_year % 7;
  const daysOffset = yd.months.slice(0, bsMonth - 1).reduce((a, b) => a + b, 0);
  return (startDow + daysOffset) % 7;
}

// ─── BS comparison helpers ────────────────────────────────────────────────────

function bsToOrdinal(d: BsDate): number {
  return d.year * 10000 + d.month * 100 + d.day;
}

function bsLte(a: BsDate, b: BsDate): boolean {
  return bsToOrdinal(a) <= bsToOrdinal(b);
}

function bsGte(a: BsDate, b: BsDate): boolean {
  return bsToOrdinal(a) >= bsToOrdinal(b);
}

function bsEq(a: BsDate, b: BsDate): boolean {
  return bsToOrdinal(a) === bsToOrdinal(b);
}

function adDateToBs(ad: Date | null | undefined): BsDate | null {
  if (!ad) return null;
  return adToBs(ad) ?? null;
}

function rangeAdFromBs(range: BsDateRange): AdDateRange {
  return {
    start: range.start
      ? bsToAd(range.start.year, range.start.month, range.start.day)
      : null,
    end: range.end
      ? bsToAd(range.end.year, range.end.month, range.end.day)
      : null,
  };
}

function nextMonth(
  year: number,
  month: number,
): { year: number; month: number } {
  if (month === 12) {
    const idx = YEARS.findIndex((y) => y.year === year);
    const next = YEARS[idx + 1];
    return next ? { year: next.year, month: 1 } : { year, month };
  }
  return { year, month: month + 1 };
}

function prevMonth(
  year: number,
  month: number,
): { year: number; month: number } {
  if (month === 1) {
    const idx = YEARS.findIndex((y) => y.year === year);
    const prev = YEARS[idx - 1];
    return prev ? { year: prev.year, month: 12 } : { year, month };
  }
  return { year, month: month - 1 };
}

// ─── Additional CSS (range-specific) ─────────────────────────────────────────

const RANGE_CSS = `
  /* ── range panel ── */
  .nc-range-panel {
    display: flex;
    gap: 0;
  }
  .nc-range-divider {
    width: 1px;
    background: var(--nc-border);
    flex-shrink: 0;
    margin: 10px 0;
  }

  /* ── range day states ── */
  .nc-day.is-in-range {
    background: color-mix(in srgb, var(--nc-sel-bg) 18%, transparent) !important;
    border-radius: 0;
    color: var(--nc-text);
  }
  .nc-day.is-range-start,
  .nc-day.is-range-end {
    background: var(--nc-sel-bg) !important;
    color: var(--nc-sel-fg) !important;
    font-weight: 700;
    border-radius: 50%;
    position: relative;
    z-index: 1;
  }
  .nc-day.is-range-start.has-end::after,
  .nc-day.is-range-end.has-start::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 50%;
    background: color-mix(in srgb, var(--nc-sel-bg) 18%, transparent);
    z-index: -1;
  }
  .nc-day.is-range-start.has-end::after  { left: 50%; }
  .nc-day.is-range-end.has-start::before { right: 50%; }

  .nc-day.is-in-range-hover {
    background: color-mix(in srgb, var(--nc-sel-bg) 10%, transparent) !important;
    border-radius: 0;
  }
  .nc-day.is-hover-end {
    box-shadow: 0 0 0 1.5px var(--nc-accent);
    border-radius: 50%;
  }
  .nc-day.is-disabled {
    opacity: 0.28;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── range sel bar ── */
  .nc-range-sel-bar {
    border-top: 1px solid var(--nc-border);
    padding: 10px 14px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; min-height: 52px;
  }
  .nc-range-dates {
    display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;
  }
  .nc-range-arrow {
    color: var(--nc-text3); font-size: 12px; flex-shrink: 0;
  }
  .nc-range-date-block { min-width: 0; }
  .nc-range-bs  { font-size: 12px; font-weight: 600; color: var(--nc-accent); line-height: 1.3; white-space: nowrap; }
  .nc-range-ad  { font-family: 'DM Mono', monospace; font-size: 9.5px; color: var(--nc-text3); margin-top: 1px; white-space: nowrap; }
  .nc-range-ph  { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--nc-text3); font-style: italic; }

  /* ── dual trigger ── */
  .nc-range-trigger {
    display: flex; align-items: center; gap: 0;
    background: var(--nc-surface); border: 1px solid var(--nc-border);
    border-radius: var(--nc-r-sm); overflow: hidden;
    cursor: pointer; width: 460px;
    font-family: 'Noto Sans Devanagari', sans-serif;
    transition: border-color 0.15s;
  }
  .nc-range-trigger:hover  { border-color: var(--nc-text3); }
  .nc-range-trigger.is-open { border-color: var(--nc-accent); }

  .nc-range-half {
    flex: 1; display: flex; align-items: center; gap: 8px;
    padding: 10px 12px;
    min-width: 0;
  }
  .nc-range-half.is-active { background: color-mix(in srgb, var(--nc-accent) 8%, transparent); }
  .nc-range-sep {
    width: 1px; background: var(--nc-border);
    align-self: stretch; flex-shrink: 0;
  }
  .nc-range-trigger-icon  { font-size: 14px; opacity: 0.5; flex-shrink: 0; }
  .nc-range-trigger-body  { flex: 1; min-width: 0; }
  .nc-range-trigger-main  { font-size: 13px; font-weight: 500; color: var(--nc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nc-range-trigger-main.is-ph { color: var(--nc-text3); }
  .nc-range-trigger-sub   { font-family: 'DM Mono', monospace; font-size: 9.5px; color: var(--nc-text3); margin-top: 1px; }
  .nc-range-trigger-arrow { font-size: 9px; color: var(--nc-text3); transition: transform 0.18s; flex-shrink: 0; }
  .nc-range-trigger.is-open .nc-range-trigger-arrow { transform: rotate(180deg); }

  /* ── range card (wider) ── */
  .nc-range-card {
    font-family: 'Noto Sans Devanagari', 'DM Mono', sans-serif;
    background: var(--nc-surface);
    border: 1px solid var(--nc-border);
    border-radius: var(--nc-r);
    width: 592px;
    overflow: hidden;
    --nc-r: 12px;
    --nc-r-sm: 8px;
  }
  .nc-range-card-elevated {
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  }
  .nc-theme-dark .nc-range-card-elevated,
  .nc-theme-dark.nc-range-card-elevated {
    box-shadow: 0 8px 40px rgba(0,0,0,0.45);
  }

  /* ── hint bar ── */
  .nc-hint-bar {
    padding: 6px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--nc-text3);
    border-bottom: 1px solid var(--nc-border);
    text-align: center;
  }
`;

// ─── Style injection ──────────────────────────────────────────────────────────

let rangeStylesInjected = false;
function injectRangeStyles(): void {
  if (rangeStylesInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.setAttribute("data-nepali-calendar-range", "");
  tag.textContent = RANGE_CSS;
  document.head.appendChild(tag);
  rangeStylesInjected = true;
}

function themeClass(mode: CalendarMode): string {
  return mode === "light" ? "nc-theme-light" : "nc-theme-dark";
}

// ─── Internal: SingleMonthPanel ───────────────────────────────────────────────

interface SingleMonthPanelProps {
  viewYear: number;
  viewMonth: number;
  onPrev?: () => void;
  onNext?: () => void;
  onYearSelect: (year: number) => void;
  range: BsDateRange;
  hoverDate: BsDate | null;
  onDayClick: (bs: BsDate) => void;
  onDayHover: (bs: BsDate | null) => void;
  showNepali: boolean;
  minDate?: BsDate;
  maxDate?: BsDate;
  showPrev: boolean;
  showNext: boolean;
}

const SingleMonthPanel: React.FC<SingleMonthPanelProps> = ({
  viewYear,
  viewMonth,
  onPrev,
  onNext,
  onYearSelect,
  range,
  hoverDate,
  onDayClick,
  onDayHover,
  showNepali,
  minDate,
  maxDate,
  showPrev,
  showNext,
}) => {
  const [showYears, setShowYears] = useState(false);
  const yearGridRef = useRef<HTMLDivElement>(null);
  const todayBs = adToBs(new Date());
  const yd = getYearData(viewYear);
  if (!yd) return null;

  const monthDays = yd.months[viewMonth - 1];
  const firstDay = firstDayOfMonth(viewYear, viewMonth);
  const dayLabels = showNepali ? NEPALI_WEEKDAYS_SHORT : EN_WEEKDAYS_SHORT;
  const adStart = bsToAd(viewYear, viewMonth, 1);
  const adLabel = adStart ? formatAdDate(adStart) : "";

  const { start, end } = range;

  // Compute effective end for hover preview
  const effectiveEnd = end ?? hoverDate;

  const isDisabled = (d: number): boolean => {
    const bs: BsDate = { year: viewYear, month: viewMonth, day: d };
    if (minDate && !bsGte(bs, minDate)) return true;
    if (maxDate && !bsLte(bs, maxDate)) return true;
    return false;
  };

  const dayClass = (d: number, dow: number): string => {
    const bs: BsDate = { year: viewYear, month: viewMonth, day: d };
    const ord = bsToOrdinal(bs);
    const startOrd = start ? bsToOrdinal(start) : null;
    const endOrd = effectiveEnd ? bsToOrdinal(effectiveEnd) : null;

    const isStart = !!start && bsEq(bs, start);
    const isEnd = !!end && bsEq(bs, end);
    const isHoverEnd =
      !end &&
      !!hoverDate &&
      bsEq(bs, hoverDate) &&
      !!start &&
      ord > bsToOrdinal(start);
    const inRange =
      startOrd !== null &&
      endOrd !== null &&
      ord > Math.min(startOrd, endOrd) &&
      ord < Math.max(startOrd, endOrd);
    const inHover =
      !end &&
      !!start &&
      !!hoverDate &&
      ord > Math.min(bsToOrdinal(start), bsToOrdinal(hoverDate)) &&
      ord < Math.max(bsToOrdinal(start), bsToOrdinal(hoverDate));
    const isToday =
      !!todayBs &&
      todayBs.year === viewYear &&
      todayBs.month === viewMonth &&
      todayBs.day === d;

    const cls: string[] = ["nc-day"];
    if (dow === 6) cls.push("is-sat");
    if (isDisabled(d)) cls.push("is-disabled");
    if (isToday && !isStart && !isEnd) cls.push("is-today");
    if (isStart) {
      cls.push("is-range-start");
      if (end || (hoverDate && !bsEq(hoverDate, start))) cls.push("has-end");
    }
    if (isEnd) {
      cls.push("is-range-end");
      if (start && !bsEq(start, bs)) cls.push("has-start");
    }
    if (isHoverEnd) cls.push("is-hover-end");
    if (inRange) cls.push("is-in-range");
    if (inHover) cls.push("is-in-range-hover");
    return cls.join(" ");
  };

  useEffect(() => {
    if (showYears && yearGridRef.current) {
      yearGridRef.current
        .querySelector<HTMLButtonElement>(".is-cur")
        ?.scrollIntoView({ block: "center" });
    }
  }, [showYears]);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Header */}
      <div className="nc-header">
        {showPrev ? (
          <button
            type="button"
            className="nc-nav"
            onClick={onPrev}
            aria-label="Previous month"
          >
            ◀
          </button>
        ) : (
          <div style={{ width: 26 }} />
        )}

        <button
          type="button"
          className="nc-title-btn"
          onClick={() => setShowYears((v) => !v)}
        >
          <div className="nc-title-main">
            {showNepali
              ? `${NEPALI_MONTHS[viewMonth - 1]} ${toNepaliNumber(viewYear)}`
              : `${NEPALI_MONTHS_EN[viewMonth - 1]} ${viewYear}`}
          </div>
          <div className="nc-title-sub">{adLabel}</div>
        </button>

        {showNext ? (
          <button
            type="button"
            className="nc-nav"
            onClick={onNext}
            aria-label="Next month"
          >
            ▶
          </button>
        ) : (
          <div style={{ width: 26 }} />
        )}
      </div>

      {/* Year picker */}
      {showYears ? (
        <div className="nc-year-grid" ref={yearGridRef}>
          {YEARS.map((y) => (
            <button
              key={y.year}
              type="button"
              className={`nc-yr-btn${y.year === viewYear ? " is-cur" : ""}`}
              onClick={() => {
                onYearSelect(y.year);
                setShowYears(false);
              }}
            >
              {y.year}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="nc-weekdays">
            {dayLabels.map((lbl, i) => (
              <div key={i} className={`nc-wd${i === 6 ? " is-sat" : ""}`}>
                {lbl}
              </div>
            ))}
          </div>
          <div className="nc-days" onMouseLeave={() => onDayHover(null)}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: monthDays }).map((_, i) => {
              const day = i + 1;
              const dow = (firstDay + i) % 7;
              const disabled = isDisabled(day);
              return (
                <div
                  key={day}
                  className={dayClass(day, dow)}
                  onClick={() =>
                    !disabled &&
                    onDayClick({ year: viewYear, month: viewMonth, day })
                  }
                  onMouseEnter={() =>
                    !disabled &&
                    onDayHover({ year: viewYear, month: viewMonth, day })
                  }
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={`${viewYear} ${NEPALI_MONTHS_EN[viewMonth - 1]} ${day}`}
                  aria-disabled={disabled}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " "))
                      onDayClick({ year: viewYear, month: viewMonth, day });
                  }}
                >
                  {showNepali ? toNepaliNumber(day) : day}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Internal: RangeCalendarCore ─────────────────────────────────────────────

interface RangeCalendarCoreProps {
  range: BsDateRange;
  onRangeChange: (r: BsDateRange) => void;
  showNepali: boolean;
  minDate?: BsDate;
  maxDate?: BsDate;
  /** Which panel is "selecting" — 0 = start, 1 = end, null = done/idle */
  pickingSlot: 0 | 1;
  setPickingSlot: (s: 0 | 1) => void;
}

const RangeCalendarCore: React.FC<RangeCalendarCoreProps> = ({
  range,
  onRangeChange,
  showNepali,
  minDate,
  maxDate,
  pickingSlot,
  setPickingSlot,
}) => {
  const todayBs = adToBs(new Date());
  const initYear =
    range.start?.year ?? todayBs?.year ?? YEARS[YEARS.length - 1].year;
  const initMonth = range.start?.month ?? todayBs?.month ?? 1;

  const [leftYear, setLeftYear] = useState(initYear);
  const [leftMonth, setLeftMonth] = useState(initMonth);
  const [hoverDate, setHoverDate] = useState<BsDate | null>(null);

  const right = nextMonth(leftYear, leftMonth);

  const goLeft = () => {
    const p = prevMonth(leftYear, leftMonth);
    setLeftYear(p.year);
    setLeftMonth(p.month);
  };
  const goRight = () => {
    const n = nextMonth(leftYear, leftMonth);
    setLeftYear(n.year);
    setLeftMonth(n.month);
  };

  const handleDayClick = (bs: BsDate) => {
    const { start, end } = range;

    // Starting fresh or picking start slot
    if (pickingSlot === 0 || (!start && !end)) {
      onRangeChange({ start: bs, end: null });
      setPickingSlot(1);
      return;
    }

    // Picking end slot
    if (pickingSlot === 1 && start) {
      if (bsToOrdinal(bs) < bsToOrdinal(start)) {
        // Clicked before start → swap
        onRangeChange({ start: bs, end: start });
      } else {
        onRangeChange({ start, end: bs });
      }
      setPickingSlot(0);
      setHoverDate(null);
      return;
    }

    // Both selected → restart
    onRangeChange({ start: bs, end: null });
    setPickingSlot(1);
  };

  const hint =
    pickingSlot === 1 && range.start
      ? showNepali
        ? "अन्तिम मिति छान्नुहोस्"
        : "Select end date"
      : showNepali
        ? "सुरू मिति छान्नुहोस्"
        : "Select start date";

  return (
    <>
      <div className="nc-hint-bar">{hint}</div>
      <div className="nc-range-panel">
        <SingleMonthPanel
          viewYear={leftYear}
          viewMonth={leftMonth}
          onPrev={goLeft}
          onYearSelect={(y) => setLeftYear(y)}
          range={range}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          showNepali={showNepali}
          minDate={minDate}
          maxDate={maxDate}
          showPrev={true}
          showNext={false}
        />
        <div className="nc-range-divider" />
        <SingleMonthPanel
          viewYear={right.year}
          viewMonth={right.month}
          onNext={goRight}
          onYearSelect={(y) => {
            // Shift left panel so right panel shows the selected year
            const p = prevMonth(y, 1);
            setLeftYear(p.year);
            setLeftMonth(p.month);
          }}
          range={range}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          showNepali={showNepali}
          minDate={minDate}
          maxDate={maxDate}
          showPrev={false}
          showNext={true}
        />
      </div>
    </>
  );
};

// ─── Internal: RangeSelBar ────────────────────────────────────────────────────

interface RangeSelBarProps {
  range: BsDateRange;
  showNepali: boolean;
  onClear: () => void;
}

const RangeSelBar: React.FC<RangeSelBarProps> = ({
  range,
  showNepali,
  onClear,
}) => {
  const { start, end } = range;
  const startAd = start ? bsToAd(start.year, start.month, start.day) : null;
  const endAd = end ? bsToAd(end.year, end.month, end.day) : null;

  return (
    <div className="nc-range-sel-bar">
      <div className="nc-range-dates">
        {/* Start */}
        <div className="nc-range-date-block">
          {start ? (
            <>
              <div className="nc-range-bs">
                {formatBsDate(start.year, start.month, start.day, showNepali)}
              </div>
              {startAd && (
                <div className="nc-range-ad">{formatAdDate(startAd)}</div>
              )}
            </>
          ) : (
            <div className="nc-range-ph">
              {showNepali ? "सुरू मिति" : "Start date"}
            </div>
          )}
        </div>

        <span className="nc-range-arrow">→</span>

        {/* End */}
        <div className="nc-range-date-block">
          {end ? (
            <>
              <div className="nc-range-bs">
                {formatBsDate(end.year, end.month, end.day, showNepali)}
              </div>
              {endAd && (
                <div className="nc-range-ad">{formatAdDate(endAd)}</div>
              )}
            </>
          ) : (
            <div className="nc-range-ph">
              {showNepali ? "अन्तिम मिति" : "End date"}
            </div>
          )}
        </div>
      </div>

      {(start || end) && (
        <button
          type="button"
          className="nc-clear-btn"
          onClick={onClear}
          aria-label="Clear range"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ─── Public: NepaliCalendarRange ─────────────────────────────────────────────

/**
 * NepaliCalendarRange — inline dual-month range calendar.
 *
 * @example
 * <NepaliCalendarRange
 *   mode="light"
 *   onChange={(bs, ad) => console.log(bs.start, bs.end, ad.start, ad.end)}
 * />
 */
export const NepaliCalendarRange: React.FC<NepaliCalendarRangeProps> = ({
  value,
  defaultValue,
  onChange,
  showNepali = true,
  mode = "light",
  className,
  minDate,
  maxDate,
}) => {
  injectRangeStyles();

  const emptyRange: BsDateRange = { start: null, end: null };
  const [internal, setInternal] = useState<BsDateRange>(
    value !== undefined ? (value ?? emptyRange) : (defaultValue ?? emptyRange),
  );
  const [pickingSlot, setPickingSlot] = useState<0 | 1>(0);

  useEffect(() => {
    if (value !== undefined) setInternal(value ?? emptyRange);
  }, [value]);

  const range = value !== undefined ? (value ?? emptyRange) : internal;

  const handleRangeChange = (r: BsDateRange) => {
    if (value === undefined) setInternal(r);
    if (r.start && r.end) onChange?.(r, rangeAdFromBs(r));
  };

  const handleClear = () => {
    if (value === undefined) setInternal(emptyRange);
    setPickingSlot(0);
    onChange?.(emptyRange, { start: null, end: null });
  };

  return (
    <div
      className={`${themeClass(mode)} nc-range-card nc-range-card-elevated${className ? ` ${className}` : ""}`}
    >
      <RangeCalendarCore
        range={range}
        onRangeChange={handleRangeChange}
        showNepali={showNepali}
        minDate={minDate}
        maxDate={maxDate}
        pickingSlot={pickingSlot}
        setPickingSlot={setPickingSlot}
      />
      <RangeSelBar
        range={range}
        showNepali={showNepali}
        onClear={handleClear}
      />
    </div>
  );
};

// ─── Public: NepaliDateRangePicker ────────────────────────────────────────────

/**
 * NepaliDateRangePicker — trigger button + dropdown dual-month range calendar.
 *
 * Supports three ways to set the range:
 *   1. `value`          — { start: BsDate|null, end: BsDate|null }
 *   2. `adValue`        — { start: Date|null, end: Date|null }  (controlled, auto-converted)
 *   3. `defaultAdValue` — same shape, uncontrolled / first-render only
 *
 * `onChange` fires with (BsDateRange, AdDateRange) whenever start **or** end is chosen.
 * A complete range fires when both start and end are set.
 *
 * @example
 * // Uncontrolled
 * <NepaliDateRangePicker onChange={(bs, ad) => console.log(bs, ad)} />
 *
 * // Controlled with AD dates
 * const [range, setRange] = useState<AdDateRange>({ start: null, end: null });
 * <NepaliDateRangePicker
 *   adValue={range}
 *   onChange={(bs, ad) => setRange(ad)}
 * />
 */
export const NepaliDateRangePicker: React.FC<NepaliDateRangePickerProps> = ({
  value,
  defaultValue,
  adValue,
  defaultAdValue,
  onChange,
  startPlaceholder,
  endPlaceholder,
  showNepali = true,
  mode = "light",
  className,
  minDate,
  maxDate,
}) => {
  injectRangeStyles();

  const emptyRange: BsDateRange = { start: null, end: null };

  const resolveInitial = (): BsDateRange => {
    if (value !== undefined) return value ?? emptyRange;
    if (adValue !== undefined)
      return {
        start: adDateToBs(adValue?.start),
        end: adDateToBs(adValue?.end),
      };
    if (defaultValue !== undefined) return defaultValue ?? emptyRange;
    if (defaultAdValue !== undefined)
      return {
        start: adDateToBs(defaultAdValue?.start),
        end: adDateToBs(defaultAdValue?.end),
      };
    return emptyRange;
  };

  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<BsDateRange>(resolveInitial);
  const [pickingSlot, setPickingSlot] = useState<0 | 1>(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync controlled props
  useEffect(() => {
    if (value !== undefined) {
      setInternal(value ?? emptyRange);
    } else if (adValue !== undefined) {
      setInternal({
        start: adDateToBs(adValue?.start),
        end: adDateToBs(adValue?.end),
      });
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

  const range: BsDateRange =
    value !== undefined
      ? (value ?? emptyRange)
      : adValue !== undefined
        ? { start: adDateToBs(adValue?.start), end: adDateToBs(adValue?.end) }
        : internal;

  const { start, end } = range;
  const startAd = start ? bsToAd(start.year, start.month, start.day) : null;
  const endAd = end ? bsToAd(end.year, end.month, end.day) : null;

  const spPh = startPlaceholder ?? (showNepali ? "सुरू मिति" : "Start date");
  const epPh = endPlaceholder ?? (showNepali ? "अन्तिम मिति" : "End date");

  const handleRangeChange = (r: BsDateRange) => {
    if (value === undefined && adValue === undefined) setInternal(r);
    if (r.start && r.end) {
      onChange?.(r, rangeAdFromBs(r));
      setOpen(false);
    }
  };

  const handleClear = () => {
    if (value === undefined && adValue === undefined) setInternal(emptyRange);
    setPickingSlot(0);
    onChange?.(emptyRange, { start: null, end: null });
    setOpen(false);
  };

  const openAndPick = (slot: 0 | 1) => {
    setPickingSlot(slot);
    setOpen(true);
  };

  return (
    <div
      className={`${themeClass(mode)} nc-picker-wrap${className ? ` ${className}` : ""}`}
      ref={wrapRef}
    >
      {/* Trigger */}
      <div
        className={`nc-range-trigger${open ? " is-open" : ""}`}
        role="group"
        aria-label="Date range"
      >
        {/* Start half */}
        <button
          type="button"
          className={`nc-range-half${open && pickingSlot === 0 ? " is-active" : ""}`}
          onClick={() => openAndPick(0)}
          aria-label="Select start date"
        >
          <span className="nc-range-trigger-icon">📅</span>
          <span className="nc-range-trigger-body">
            <div className={`nc-range-trigger-main${start ? "" : " is-ph"}`}>
              {start
                ? formatBsDate(start.year, start.month, start.day, showNepali)
                : spPh}
            </div>
            {start && startAd && (
              <div className="nc-range-trigger-sub">
                {formatAdDate(startAd)}
              </div>
            )}
          </span>
        </button>

        <div className="nc-range-sep" />

        {/* End half */}
        <button
          type="button"
          className={`nc-range-half${open && pickingSlot === 1 ? " is-active" : ""}`}
          onClick={() => openAndPick(1)}
          aria-label="Select end date"
        >
          <span className="nc-range-trigger-icon">📅</span>
          <span className="nc-range-trigger-body">
            <div className={`nc-range-trigger-main${end ? "" : " is-ph"}`}>
              {end
                ? formatBsDate(end.year, end.month, end.day, showNepali)
                : epPh}
            </div>
            {end && endAd && (
              <div className="nc-range-trigger-sub">{formatAdDate(endAd)}</div>
            )}
          </span>
          <span className="nc-range-trigger-arrow">▼</span>
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="nc-dropdown" role="dialog" aria-modal="true">
          <div
            className={`${themeClass(mode)} nc-range-card`}
            style={{
              boxShadow:
                mode === "dark"
                  ? "0 20px 56px rgba(0,0,0,0.65)"
                  : "0 20px 56px rgba(0,0,0,0.15)",
            }}
          >
            <RangeCalendarCore
              range={range}
              onRangeChange={handleRangeChange}
              showNepali={showNepali}
              minDate={minDate}
              maxDate={maxDate}
              pickingSlot={pickingSlot}
              setPickingSlot={setPickingSlot}
            />
            <RangeSelBar
              range={range}
              showNepali={showNepali}
              onClear={handleClear}
            />
          </div>
        </div>
      )}
    </div>
  );
};
