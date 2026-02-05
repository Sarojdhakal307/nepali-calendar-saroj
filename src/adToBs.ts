import calendarData from "./data/calendarData.json";
import { CalendarData } from "./type";

const data = calendarData as CalendarData;

export function adToBs(adDate: Date) {
  for (const yearData of data.years) {

    const start = new Date(yearData.english_start_date);

    let totalDays = 0;

    for (let m = 0; m < yearData.months.length; m++) {
      for (let d = 0; d < yearData.months[m]; d++) {

        const current = new Date(start);
        current.setDate(start.getDate() + totalDays);

        if (
          current.getFullYear() === adDate.getFullYear() &&
          current.getMonth() === adDate.getMonth() &&
          current.getDate() === adDate.getDate()
        ) {
          return {
            year: yearData.year,
            month: m + 1,
            day: d + 1
          };
        }

        totalDays++;
      }
    }
  }

  return null;
}
