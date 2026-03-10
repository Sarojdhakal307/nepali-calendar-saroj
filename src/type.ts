// ─── Core date types ──────────────────────────────────────────────────────────

export interface BsDate {
  year: number;
  month: number; // 1–12
  day: number;
}

// ─── Calendar data shape (matches calendarData.json) ─────────────────────────

export interface CalendarYear {
  year: number;
  months: number[]; // days in each of the 12 months
  /**
   * isoWeekday of Baisakh 1 for this year.
   * 1 = Monday … 6 = Saturday, 7 = Sunday
   * (same convention as your calendarData.json)
   */
  start_day_of_year: number;
  english_start_date: string; // "YYYY-MM-DD"
}

export interface CalendarData {
  years: CalendarYear[];
}

// ─── Detailed / formatted BS date ────────────────────────────────────────────

export interface BsDetailedDate {
  bsYear: number;
  bsMonth: number;
  bsDay: number;

  nepaliYear: string;         // e.g. "२०८२"
  nepaliMonthName: string;    // e.g. "बैशाख"
  nepaliDay: string;          // e.g. "१५"
  nepaliWeekDayName: string;  // e.g. "सोमबार"

  formattedNepaliDate: string; // e.g. "२०८२ बैशाख १५"

  adDate: Date;
}

// ─── Component prop types ─────────────────────────────────────────────────────

export interface NepaliCalendarProps {
  /** Controlled selected BS date. Pass null to clear. */
  value?: BsDate | null;
  /** Uncontrolled starting selection */
  defaultValue?: BsDate;
  /**
   * Called when a day is selected or selection is cleared.
   * @param bs  - selected BS date, or null when cleared
   * @param ad  - corresponding Gregorian Date, or null when cleared
   */
  onChange?: (bs: BsDate | null, ad: Date | null) => void;
  /** Render labels in Nepali script — default: true */
  showNepali?: boolean;
  /** Show the selected-date strip below the grid — default: true */
  showSelectedBar?: boolean;
  className?: string;
}

export interface NepaliDatePickerProps {
  /** Controlled selected BS date. Pass null to clear. */
  value?: BsDate | null;
  /**
   * Called when a day is picked or selection is cleared.
   * @param bs  - selected BS date, or null when cleared
   * @param ad  - corresponding Gregorian Date, or null when cleared
   */
  onChange?: (bs: BsDate | null, ad: Date | null) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Render labels in Nepali script — default: true */
  showNepali?: boolean;
  className?: string;
}