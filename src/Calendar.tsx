import React from "react";
import { NEPALI_MONTHS, NEPALI_WEEKDAYS, toNepaliNumber } from "./nepaliFormat";
import { View, Text, StyleSheet } from "react-native";


interface CalendarProps {
  date?: Date; // Month to display, defaults to today
  showNepali?: boolean; // true to show Nepali digits & weekdays
}

const WebCalendar: React.FC<CalendarProps> = ({
  date = new Date(),
  showNepali = false,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  const firstDay = new Date(year, month, 1).getDay(); // 0-6 (Sun-Sat)
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ width: "250px", fontFamily: "sans-serif" }}>
      {/* Month Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        {showNepali
          ? NEPALI_MONTHS[month] + " " + toNepaliNumber(year)
          : date.toLocaleString("default", { month: "long" }) + " " + year}
      </div>

      {/* Weekday Row */}
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
          const display = showNepali ? toNepaliNumber(d) : d;
          const color = dayOfWeek === 6 ? "red" : "black";

          return (
            <div
              key={i}
              style={{ textAlign: "center", color, padding: "5px 0" }}
            >
              {display}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export  {WebCalendar};

interface RnCalendarProps {
  date?: Date;          
  showNepali?: boolean;  
}

const RnCalendar: React.FC<RnCalendarProps> = ({ date = new Date(), showNepali = false }) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  const firstDay = new Date(year, month, 1).getDay(); // 0-6 (Sun-Sat)
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const weekdays = showNepali
    ? NEPALI_WEEKDAYS
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <Text style={styles.header}>
        {showNepali
          ? NEPALI_MONTHS[month] + " " + toNepaliNumber(year)
          : date.toLocaleString("default", { month: "long" }) + " " + year}
      </Text>

      {/* Weekdays Row */}
      <View style={styles.weekdaysRow}>
        {weekdays.map((day, i) => (
          <Text
            key={i}
            style={[
              styles.weekday,
              { color: i === 6 ? "red" : "black" }, // Saturday red
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Empty spaces for first day */}
      <View style={styles.datesRow}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dateCell} />
        ))}

        {/* Dates */}
        {days.map((d, i) => {
          const dayOfWeek = (firstDay + i) % 7;
          const display = showNepali ? toNepaliNumber(d) : d;
          const color = dayOfWeek === 6 ? "red" : "black";

          return (
            <View key={i} style={styles.dateCell}>
              <Text style={{ color, textAlign: "center" }}>{display}</Text>
            </View>
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
  header: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
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
    width: "14.28%", // 7 columns
    paddingVertical: 8,
  },
});
