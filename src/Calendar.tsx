import React, { useState } from "react";
import { NEPALI_MONTHS, NEPALI_WEEKDAYS, toNepaliNumber } from "./nepaliFormat";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CalendarProps {
  date?: Date;
  showNepali?: boolean;
  onDatePick?: (date: Date) => void;
}

const WebCalendar: React.FC<CalendarProps> = ({
  date = new Date(),
  showNepali = false,
  onDatePick,
}) => {
  const [currentDate, setCurrentDate] = useState(date);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (d: number) => {
    if (onDatePick) {
      onDatePick(new Date(year, month, d));
    }
  };

  return (
    <div style={{ width: "250px", fontFamily: "sans-serif" }}>
      {/* Header with Arrows */}
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
            style={{ color: i === 6 ? "red" : "black", textAlign: "center" }}
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

export { WebCalendar };

const RnCalendar: React.FC<CalendarProps> = ({
  date = new Date(),
  showNepali = false,
  onDatePick,
}) => {
  const [currentDate, setCurrentDate] = useState(date);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDatePick = (d: number) => {
    if (onDatePick) {
      onDatePick(new Date(year, month, d));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with arrows */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={prevMonth}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.header}>
          {showNepali
            ? NEPALI_MONTHS[month] + " " + toNepaliNumber(year)
            : currentDate.toLocaleString("default", { month: "long" }) +
              " " +
              year}
        </Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdaysRow}>
        {weekdays.map((day, i) => (
          <Text
            key={i}
            style={[styles.weekday, { color: i === 6 ? "red" : "black" }]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Dates */}
      <View style={styles.datesRow}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dateCell} />
        ))}

        {days.map((d, i) => {
          const dayOfWeek = (firstDay + i) % 7;
          const color = dayOfWeek === 6 ? "red" : "black";
          const display = showNepali ? toNepaliNumber(d) : d;

          return (
            <TouchableOpacity
              key={i}
              style={styles.dateCell}
              onPress={() => handleDatePick(d)}
            >
              <Text style={{ textAlign: "center", color }}>{display}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export { RnCalendar };

const styles = StyleSheet.create({
  container: {
    width: 280,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  datesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateCell: {
    width: "14.28%",
    paddingVertical: 8,
  },
});
