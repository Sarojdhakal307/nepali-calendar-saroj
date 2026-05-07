// ─── Components ───────────────────────────────────────────────────────────────
export { NepaliCalendar, NepaliDatePicker } from "./Calendar";
export { NepaliCalendarRange, NepaliDateRangePicker } from "./Nepalidaterangepicker";
// ─── Conversion utilities ─────────────────────────────────────────────────────
export { adToBs, adStringToBs } from "./adToBs";
export { bsToAd, bsStringToAd } from "./bsToAd";

// ─── Formatters & helpers ─────────────────────────────────────────────────────
export {
  toNepaliNumber,
  formatBsDate,
  formatAdDate,
  NEPALI_MONTHS,
  NEPALI_MONTHS_EN,
  NEPALI_WEEKDAYS,
  NEPALI_WEEKDAYS_SHORT,
  EN_WEEKDAYS_SHORT,
  NEPALI_DIGITS,
} from "./nepaliFormat";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  BsDate,
  BsDetailedDate,
  CalendarYear,
  CalendarData,
  NepaliCalendarProps,
  NepaliDatePickerProps,
} from "./type";

export type {
  BsDateRange,
  AdDateRange,
  NepaliCalendarRangeProps,
  NepaliDateRangePickerProps,
} from "./Nepalidaterangepicker";

