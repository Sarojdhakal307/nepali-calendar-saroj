import calendarData from "./data/calendarData.json";
import type { CalendarData } from "./type";

const data = calendarData as CalendarData;

/**
 * Convert a Bikram Sambat (BS) date to a Gregorian (AD) Date.
 *
 * Uses your `calendarData.json` as the source of truth.
 * Returns `null` if the year is outside the data range (BS 2000–2090)
 * or if the day/month values are invalid for that year.
 *
 * @example
 * bsToAd(2082, 1, 1)
 * // → Date("2025-04-14")
 *
 * bsToAd(2080, 12, 30)
 * // → Date("2024-04-12")
 */
export function bsToAd(
  bsYear: number,
  bsMonth: number,
  bsDay: number
): Date | null {
  const yearData = data.years.find((y) => y.year === bsYear);
  if (!yearData) return null;

  // Validate month and day bounds
  if (bsMonth < 1 || bsMonth > 12) return null;
  const daysInMonth = yearData.months[bsMonth - 1];
  if (bsDay < 1 || bsDay > daysInMonth) return null;

  // Count total days from Baisakh 1 of this year
  let offset = 0;
  for (let m = 0; m < bsMonth - 1; m++) {
    offset += yearData.months[m];
  }
  offset += bsDay - 1;

  const result = new Date(yearData.english_start_date);
  result.setDate(result.getDate() + offset);
  return result;
}