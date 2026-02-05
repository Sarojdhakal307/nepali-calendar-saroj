How to Use nepali-calender-saroj
1. Install the package
npm install nepali-calender-saroj


or with yarn:

yarn add nepali-calender-saroj

2. Import functions
import { bsToAd, adToBs, toNepaliNumber, NEPALI_MONTHS, NEPALI_WEEKDAYS } from "nepali-calender-saroj";

3. Convert BS → AD (Basic)
// Convert 5th Magh 2082 BS to Gregorian date
const adDate = bsToAd(2082, 10, 5);
console.log(adDate);
// Output: 2026-01-19T00:00:00.000Z

4. Convert BS → AD (Detailed)
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


✅ detailed = true gives:

Nepali year in digits

Nepali month name

Nepali day in digits

Nepali weekday name

Fully formatted Nepali date string

5. Convert AD → BS
const bsDate = adToBs(new Date("2026-01-19"));
console.log(bsDate);
/*
{
  year: 2082,
  month: 10,
  day: 5
}
*/

6. Helpers
// Convert any number to Nepali digits
console.log(toNepaliNumber(2026)); // Output: "२०२६"

// Get Nepali month or weekday name
console.log(NEPALI_MONTHS[0]);   // Output: "बैशाख"
console.log(NEPALI_WEEKDAYS[1]); // Output: "सोमबार"

7. Example: Full Nepali Date Formatter
const nepaliDate = bsToAd(2082, 10, 5, true);

console.log(nepaliDate.formattedNepaliDate);
// Output: "२०८२ माघ ५, सोमबार"


This gives users everything they need to get started: install, import, basic conversion, detailed conversion, and helpers.




WebCalendar (React / Web)
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


Arrows let you move between months.

Click a date → triggers onDatePick.

RnCalendar (React Native)
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


Tap arrows → next/previous month.

Tap a date → triggers onDatePick.

Props Summary
Prop	Type	Description
date	Date	Initial month (default = today)
showNepali	boolean	Nepali month/week display
onDatePick	(date: Date) => void	Callback when a date is selected