export interface CalendarYear {
  year: number;
  months: number[];
  start_day_of_year: number;
  english_start_date: string;
}

export interface CalendarData {
  years: CalendarYear[];
}


export interface BsDetailedDate {
  bsYear: number;
  bsMonth: number;
  bsDay: number;

  nepaliYear: string;
  nepaliMonthName: string;
  nepaliDay: string;
  nepaliWeekDayName: string;

  formattedNepaliDate: string;

  adDate: Date;
}
