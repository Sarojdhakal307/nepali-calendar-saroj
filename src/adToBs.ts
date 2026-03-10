import calendarData from "./data/calendarData.json";
import type { CalendarData, BsDate } from "./type";

const data = calendarData as CalendarData;

/**
 * Convert a Gregorian (AD) Date to a Bikram Sambat (BS) date.
 *
 * Uses your `calendarData.json` as the source of truth.
 * Returns `null` if the date falls outside the data range (BS 2000–2090).
 *
 * @example
 * adToBs(new Date("2025-04-14"))
 * // → { year: 2082, month: 1, day: 1 }
 *
 * adToBs(new Date())
 * // → { year: 2082, month: 11, day: 25 }  (today's BS date)
 */
export function adToBs(adDate: Date): BsDate | null {
  // Normalise to midnight local time to avoid timezone drift
  const target = new Date(
    adDate.getFullYear(),
    adDate.getMonth(),
    adDate.getDate()
  );

  for (const yearData of data.years) {
    const start = new Date(yearData.english_start_date);
    let offset = 0;

    for (let m = 0; m < yearData.months.length; m++) {
      for (let d = 0; d < yearData.months[m]; d++) {
        const current = new Date(start);
        current.setDate(start.getDate() + offset);

        if (
          current.getFullYear() === target.getFullYear() &&
          current.getMonth()    === target.getMonth()    &&
          current.getDate()     === target.getDate()
        ) {
          return {
            year:  yearData.year,
            month: m + 1,
            day:   d + 1,
          };
        }

        offset++;
      }
    }
  }

  return null; // date is outside the supported range
}