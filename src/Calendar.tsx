import React, { useState } from "react";
import {
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS_SHORT,
  toNepaliNumber,
} from "./nepaliFormat";
import nepaliData from "./data/calendarData.json";
import { adToBs } from "./adToBs";

interface NepaliYearData {
  year: number;
  months: number[]; // Days in each month
  start_day_of_year: number; // 0 = Sunday, 1 = Monday ...
  english_start_date: string;
}

interface NepaliDate {
  year: number;
  month: number; // 1-12
  day: number;
}

interface CalendarProps {
  date?: Date | NepaliDate;
  showNepali?: boolean;
  onDatePick?: (date: Date | NepaliDate) => void;
}

const WebNepaliCalendar: React.FC<CalendarProps> = ({
  date,
  showNepali = true,
  onDatePick,
}) => {
  // Convert today to Nepali date
  const todayNepali = adToBs(new Date());

  // Default to provided date or current Nepali odadate
  const defaultYear = (date as NepaliDate)?.year || todayNepali?.year;
  // const defaultMonth = ((date as NepaliDate)?.month || todayNepali?.month) -1  ; // 0-indexed
  const defaultMonth =
    ((date as NepaliDate)?.month ?? todayNepali?.month ?? 1) - 1; // 0-indexed

  const [currentYear, setCurrentYear] = useState(defaultYear);
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);

  const yearData: NepaliYearData | undefined = nepaliData.years.find(
    (y) => y.year === currentYear,
  );
  if (!yearData) return <div>No data for year {currentYear}</div>;

  const monthDays = yearData.months[currentMonth];

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS_SHORT
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth =
    (yearData.start_day_of_year +
      yearData.months.slice(0, currentMonth).reduce((a, b) => a + b, 0)) %
    7;

  // Check if a day is today
  const isToday = (day: number) =>
    todayNepali &&
    todayNepali.year === currentYear &&
    todayNepali.month - 1 === currentMonth &&
    todayNepali.day === day;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      const prevYearIndex =
        nepaliData.years.findIndex((y) => y.year === currentYear) - 1;
      if (prevYearIndex >= 0) {
        setCurrentYear(nepaliData.years[prevYearIndex].year);
        setCurrentMonth(11);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      const nextYearIndex =
        nepaliData.years.findIndex((y) => y.year === currentYear) + 1;
      if (nextYearIndex < nepaliData.years.length) {
        setCurrentYear(nepaliData.years[nextYearIndex].year);
        setCurrentMonth(0);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    onDatePick?.({ year: currentYear!, month: currentMonth + 1, day });
  };

  return (
    <div style={{ width: "280px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        <button onClick={handlePrevMonth}>◀</button>
        <div>
          {showNepali
            ? `${NEPALI_MONTHS[currentMonth]} ${toNepaliNumber(currentYear!)}`
            : `${NEPALI_MONTHS[currentMonth]} ${currentYear}`}
        </div>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* Weekdays */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        {weekdays.map((day, i) => (
          <div
            key={i}
            style={{ textAlign: "center", color: i === 6 ? "red" : "black" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: monthDays }).map((_, i) => {
          const dayNum = i + 1;
          const dayOfWeek = (firstDayOfMonth + i) % 7;
          const color = dayOfWeek === 6 ? "red" : "black";

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                color,
                padding: "5px 0",
                cursor: "pointer",
                border: isToday(dayNum) ? "2px solid lightblue" : "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
              }}
              onClick={() => handleDateClick(dayNum)}
            >
              {showNepali ? toNepaliNumber(dayNum) : dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebNepaliCalendar;

/* ------------------ English Calendar ------------------ */
const WebEnglishCalendar: React.FC<CalendarProps> = ({
  date = new Date(),
  showNepali = false,
  onDatePick,
}) => {
  const [currentDate, setCurrentDate] = useState(date as Date);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS_SHORT
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleDateClick = (d: number) => onDatePick?.(new Date(year, month, d));

  return (
    <div style={{ width: "280px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        <button onClick={prevMonth}>◀</button>
        <div>
          {showNepali
            ? NEPALI_MONTHS[month] + " " + toNepaliNumber(year)
            : currentDate.toLocaleString("default", { month: "long" }) +
              " " +
              year}
        </div>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* Weekdays */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        {weekdays.map((day, i) => (
          <div
            key={i}
            style={{ textAlign: "center", color: i === 6 ? "red" : "black" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((d, i) => {
          const dayOfWeek = (firstDay + i) % 7;
          const color = dayOfWeek === 6 ? "red" : "black";
          const display = showNepali ? toNepaliNumber(d) : d;
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                color,
                padding: "5px 0",
                cursor: "pointer",
                backgroundColor: isToday(d) ? "lightblue" : "transparent",
                borderRadius: "50%",
              }}
              onClick={() => handleDateClick(d)}
            >
              {display}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { WebNepaliCalendar, WebEnglishCalendar };
