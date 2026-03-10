// ─── Month names ─────────────────────────────────────────────────────────────

export const NEPALI_MONTHS: string[] = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुन",
  "चैत",
];

export const NEPALI_MONTHS_EN: string[] = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

// ─── Weekday names ────────────────────────────────────────────────────────────

/** Full Nepali weekday names, Sunday-first (index 0 = Sunday) */
export const NEPALI_WEEKDAYS: string[] = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
];

/** Short Nepali weekday names, Sunday-first (index 0 = Sunday) */
export const NEPALI_WEEKDAYS_SHORT: string[] = [
  "आइत",
  "सोम",
  "मङ्ग",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

/** Short English weekday names, Sunday-first */
export const EN_WEEKDAYS_SHORT: string[] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

// ─── Nepali digits ────────────────────────────────────────────────────────────

export const NEPALI_DIGITS: string[] = [
  "०", "१", "२", "३", "४",
  "५", "६", "७", "८", "९",
];

/**
 * Convert an Arabic-numeral number or string to Nepali (Devanagari) digits.
 * Non-digit characters (e.g. "-") are passed through unchanged.
 *
 * @example
 * toNepaliNumber(2082)   // "२०८२"
 * toNepaliNumber("15")   // "१५"
 */
export function toNepaliNumber(num: number | string): string {
  return String(num)
    .split("")
    .map((ch) => NEPALI_DIGITS[Number(ch)] ?? ch)
    .join("");
}

// ─── Date formatters ──────────────────────────────────────────────────────────

/**
 * Format a BS date as a Nepali or English string.
 *
 * @example
 * formatBsDate(2082, 1, 15, true)   // "२०८२ बैशाख १५"
 * formatBsDate(2082, 1, 15, false)  // "2082 Baisakh 15"
 */
export function formatBsDate(
  year: number,
  month: number,
  day: number,
  nepali = true
): string {
  return nepali
    ? `${toNepaliNumber(year)} ${NEPALI_MONTHS[month - 1]} ${toNepaliNumber(day)}`
    : `${year} ${NEPALI_MONTHS_EN[month - 1]} ${day}`;
}

/**
 * Format a Gregorian Date object as a short English date string.
 *
 * @example
 * formatAdDate(new Date("2025-04-14"))  // "Apr 14, 2025"
 */
export function formatAdDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}