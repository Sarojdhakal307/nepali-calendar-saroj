# Nepali Calender Saroj

A simple and easy-to-use JavaScript/TypeScript library for working with the Nepali (Bikram Sambat) calendar.
Includes functions to convert between BS ↔ AD, format Nepali dates, and display Nepali months and weekdays.
Also comes with React (Web) and React Native calendar components.

---

## Installation

Using **npm**:

```bash
npm install nepali-calender-saroj
```

Or with **yarn**:

```bash
yarn add nepali-calender-saroj
```

---

## Importing Functions

```javascript
import {
  bsToAd,
  adToBs,
  toNepaliNumber,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS
} from "nepali-calender-saroj";
```

---

## Usage

### 1. Convert BS → AD (Basic)

```javascript
// Convert 5th Magh 2082 BS to Gregorian date
const adDate = bsToAd(2082, 10, 5);
console.log(adDate);
// Output: 2026-01-19T00:00:00.000Z
```

---

### 2. Convert BS → AD (Detailed)

```javascript
// Get Nepali formatted details
const detailed = bsToAd(2082, 10, 5, true);
console.log(detailed);
/*
{
  bsYear: 2082,
  bsMonth: 10,
  bsDay: 5,
  nepaliYear: "२०८२",
  nepaliMonthName: "माघ",
  nepaliDay: "५",
  nepaliWeekDayName: "सोमबार",
  formattedNepaliDate: "२०८२ माघ ५, सोमबार",
  adDate: 2026-01-19T00:00:00.000Z
}
*/
```

✅ `detailed = true` provides:

* Nepali year in digits
* Nepali month name
* Nepali day in digits
* Nepali weekday name
* Fully formatted Nepali date string

---

### 3. Convert AD → BS

```javascript
const bsDate = adToBs(new Date("2026-01-19"));
console.log(bsDate);
/*
{
  year: 2082,
  month: 10,
  day: 5
}
*/
```

---

### 4. Helper Functions

```javascript
// Convert any number to Nepali digits
console.log(toNepaliNumber(2026)); // Output: "२०२६"

// Get Nepali month or weekday name
console.log(NEPALI_MONTHS[0]);   // Output: "बैशाख"
console.log(NEPALI_WEEKDAYS[1]); // Output: "सोमबार"
```

---

### 5. Full Nepali Date Formatter

```javascript
const nepaliDate = bsToAd(2082, 10, 5, true);
console.log(nepaliDate.formattedNepaliDate);
// Output: "२०८२ माघ ५, सोमबार"
```

---

## WebCalendar (React / Web)

```javascript
import React from "react";
import { WebCalendar } from "./WebCalendar";

export default function App() {
  return (
    <WebCalendar
      showNepali={true}                     // optional: show Nepali months & weekdays
      onDatePick={(date) => console.log(date)} // optional: get selected date
    />
  );
}
```

* Use arrows to navigate between months.
* Click a date → triggers `onDatePick`.

---

## RnCalendar (React Native)

```javascript
import React from "react";
import { View } from "react-native";
import { RnCalendar } from "./RnCalendar";

export default function App() {
  return (
    <View style={{ padding: 20 }}>
      <RnCalendar
        showNepali={true}                     // optional: Nepali display
        onDatePick={(date) => console.log(date)} // optional: handle tap on date
      />
    </View>
  );
}
```

* Tap arrows → next/previous month.
* Tap a date → triggers `onDatePick`.

---

## Props Summary

| Prop         | Type                   | Description                      |
| ------------ | ---------------------- | -------------------------------- |
| `date`       | `Date`                 | Initial month (default = today)  |
| `showNepali` | `boolean`              | Display Nepali months & weekdays |
| `onDatePick` | `(date: Date) => void` | Callback when a date is selected |
