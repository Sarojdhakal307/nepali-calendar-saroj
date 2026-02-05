import { NEPALI_MONTHS, NEPALI_WEEKDAYS, toNepaliNumber } from "./nepaliFormat";
import { BsDetailedDate, CalendarData } from "./type";
import calendarData from "./data/calendarData.json"
const data = calendarData as CalendarData;

export function bsToAd(
  year: number,
  month: number,
  day: number,
  detailed: boolean = false
): Date | BsDetailedDate | null {

  const yearData = data.years.find(y => y.year === year);
  if (!yearData) return null;

  const baseDate = new Date(yearData.english_start_date);

  let daysOffset = 0;

  // Previous months
  for (let i = 0; i < month - 1; i++) {
    daysOffset += yearData.months[i];
  }

  // Current month days
  daysOffset += (day - 1);

  const result = new Date(baseDate);
  result.setDate(baseDate.getDate() + daysOffset);

  // 👉 If only normal mode
  if (!detailed) return result;

  // 👉 Detailed mode
  const weekday = result.getDay();

  const detailedResult: BsDetailedDate = {
    bsYear: year,
    bsMonth: month,
    bsDay: day,

    nepaliYear: toNepaliNumber(year),
    nepaliMonthName: NEPALI_MONTHS[month - 1],
    nepaliDay: toNepaliNumber(day),
    nepaliWeekDayName: NEPALI_WEEKDAYS[weekday],

    formattedNepaliDate: `${toNepaliNumber(year)} ${NEPALI_MONTHS[month - 1]} ${toNepaliNumber(day)}, ${NEPALI_WEEKDAYS[weekday]}`,

    adDate: result
  };

  return detailedResult;
}



// const detail = bsToAd(2082, 10, 5, true);
