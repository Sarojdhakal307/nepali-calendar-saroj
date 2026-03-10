# nepali-calender-saroj

A lightweight, fully-typed React component library for the **Bikram Sambat (BS) Nepali calendar**.  
Supports date display, date picking, and AD ↔ BS conversion — covering **BS 2000 to 2090**.

[![npm version](https://img.shields.io/npm/v/nepali-calender-saroj)](https://www.npmjs.com/package/nepali-calender-saroj)
[![license](https://img.shields.io/npm/l/nepali-calender-saroj)](./LICENSE)
[![types](https://img.shields.io/npm/types/nepali-calender-saroj)](https://www.npmjs.com/package/nepali-calender-saroj)

---

## Features

- 📅 **Inline calendar** — drop in a full month grid anywhere
- 🔽 **Date picker** — trigger button + dropdown, closes on outside click
- 🔁 **AD ↔ BS conversion** — accurate utilities for both directions
- 🇳🇵 **Nepali script** — Devanagari labels and digits, togglable to English
- 📆 **BS 2000 – 2090** — 91 years of verified calendar data
- 🎛 **Controlled & uncontrolled** — works like a standard React input
- ✅ **Fully typed** — complete TypeScript definitions included
- 🪶 **Zero extra dependencies** — only React as a peer dependency

---

## Installation

```bash
npm install nepali-calender-saroj
# or
yarn add nepali-calender-saroj
```

**Peer dependencies** — make sure these are already in your project:

```bash
npm install react react-dom
```

---

## Quick Start

```tsx
import { NepaliCalendar, NepaliDatePicker } from "nepali-calender-saroj";

export default function App() {
  return (
    <>
      {/* Inline calendar */}
      <NepaliCalendar onChange={(bs, ad) => console.log(bs, ad)} />

      {/* Dropdown picker */}
      <NepaliDatePicker onChange={(bs, ad) => console.log(bs, ad)} />
    </>
  );
}
```

---

## Components

### `<NepaliCalendar />`

An inline, full-month calendar grid.

```tsx
import { NepaliCalendar } from "nepali-calender-saroj";

<NepaliCalendar
  onChange={(bs, ad) => console.log(bs, ad)}
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `BsDate \| null` | — | Controlled selected date. Pass `null` to clear. |
| `defaultValue` | `BsDate` | — | Uncontrolled default selection. |
| `onChange` | `(bs: BsDate \| null, ad: Date \| null) => void` | — | Called on day click or clear. |
| `showNepali` | `boolean` | `true` | Use Nepali (Devanagari) script for labels and digits. |
| `showSelectedBar` | `boolean` | `true` | Show the selected-date strip below the grid. |
| `className` | `string` | — | Extra CSS class on the root element. |

---

### `<NepaliDatePicker />`

A trigger button that opens a dropdown calendar. Closes on outside click.

```tsx
import { NepaliDatePicker } from "nepali-calender-saroj";

<NepaliDatePicker
  onChange={(bs, ad) => console.log(bs, ad)}
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `BsDate \| null` | — | Controlled selected date. Pass `null` to clear. |
| `onChange` | `(bs: BsDate \| null, ad: Date \| null) => void` | — | Called when a date is picked or cleared. |
| `placeholder` | `string` | `"मिति छान्नुहोस्"` | Placeholder text shown when nothing is selected. |
| `showNepali` | `boolean` | `true` | Use Nepali script for labels and digits. |
| `className` | `string` | — | Extra CSS class on the root element. |

---

## Usage Examples

### Controlled mode

```tsx
import { useState } from "react";
import { NepaliCalendar, type BsDate } from "nepali-calender-saroj";

function MyForm() {
  const [date, setDate] = useState<BsDate | null>(null);

  return (
    <NepaliCalendar
      value={date}
      onChange={(bs) => setDate(bs)}
    />
  );
}
```

### English labels

```tsx
<NepaliCalendar  showNepali={false} onChange={(bs, ad) => console.log(bs, ad)} />
<NepaliDatePicker showNepali={false} placeholder="Select date" onChange={(bs, ad) => console.log(bs, ad)} />
```

### Get both BS and AD dates at once

```tsx
<NepaliCalendar
  onChange={(bs, ad) => {
    if (bs) console.log(`BS: ${bs.year}/${bs.month}/${bs.day}`);
    if (ad) console.log(`AD: ${ad.toISOString().slice(0, 10)}`);
  }}
/>
```

### No selected-date strip

```tsx
<NepaliCalendar showSelectedBar={false} onChange={(bs) => console.log(bs)} />
```

### Start on a specific date

```tsx
<NepaliCalendar defaultValue={{ year: 2080, month: 6, day: 15 }} />
```

---

## Utilities

### `adToBs(adDate: Date): BsDate | null`

Convert a Gregorian `Date` to a BS date object.  
Returns `null` if the date is outside the supported range (BS 2000–2090).

```ts
import { adToBs } from "nepali-calender-saroj";

adToBs(new Date("2025-04-14"));
// → { year: 2082, month: 1, day: 1 }

adToBs(new Date());
// → { year: 2082, month: 11, day: 25 }  (today's BS date)
```

---

### `bsToAd(year: number, month: number, day: number): Date | null`

Convert a BS date to a Gregorian `Date`.  
Returns `null` for invalid values or years outside the supported range.

```ts
import { bsToAd } from "nepali-calender-saroj";

bsToAd(2082, 1, 1);
// → Date("2025-04-14")

bsToAd(2080, 12, 30);
// → Date("2024-04-12")
```

---

### `toNepaliNumber(num: number | string): string`

Convert Arabic digits to Nepali (Devanagari) digits.

```ts
import { toNepaliNumber } from "nepali-calender-saroj";

toNepaliNumber(2082);   // "२०८२"
toNepaliNumber("15");   // "१५"
toNepaliNumber(2082);   // "२०८२"
```

---

### `formatBsDate(year, month, day, nepali?): string`

Format a BS date as a readable string.

```ts
import { formatBsDate } from "nepali-calender-saroj";

formatBsDate(2082, 1, 15, true);   // "२०८२ बैशाख १५"
formatBsDate(2082, 1, 15, false);  // "2082 Baisakh 15"
```

---

### `formatAdDate(date: Date): string`

Format a Gregorian `Date` as a short English string.

```ts
import { formatAdDate } from "nepali-calender-saroj";

formatAdDate(new Date("2025-04-14"));  // "Apr 14, 2025"
```

---

## Constants

```ts
import {
  NEPALI_MONTHS,          // ["बैशाख", "जेठ", ...]
  NEPALI_MONTHS_EN,       // ["Baisakh", "Jestha", ...]
  NEPALI_WEEKDAYS,        // ["आइतबार", "सोमबार", ...]
  NEPALI_WEEKDAYS_SHORT,  // ["आइत", "सोम", ...]
  EN_WEEKDAYS_SHORT,      // ["Sun", "Mon", ...]
  NEPALI_DIGITS,          // ["०", "१", ...]
} from "nepali-calender-saroj";
```

---

## TypeScript Types

```ts
import type {
  BsDate,               // { year, month, day }
  BsDetailedDate,       // full formatted date object
  CalendarYear,         // single year entry from calendarData.json
  CalendarData,         // { years: CalendarYear[] }
  NepaliCalendarProps,  // props for <NepaliCalendar />
  NepaliDatePickerProps // props for <NepaliDatePicker />
} from "nepali-calender-saroj";
```

### `BsDate`

```ts
interface BsDate {
  year: number;   // e.g. 2082
  month: number;  // 1–12
  day: number;    // 1–32
}
```

---

## Calendar Data Range

| Range | Gregorian equivalent |
|---|---|
| BS 2000 | ~1943 AD |
| BS 2082 | ~2025 AD (current) |
| BS 2090 | ~2033 AD |

Data is sourced from official Nepali Patro records and anchored to the verified date **BS 2082 Baisakh 1 = 2025-04-14**.

---

## Changelog

### v5.0.0
- Rewrote all components in TypeScript with full type exports
- Fixed `start_day_of_year` grid offset calculation (isoWeekday → Sun-start index)
- Added `formatBsDate`, `formatAdDate` utilities
- Added `NEPALI_MONTHS_EN`, `EN_WEEKDAYS_SHORT` constants
- Added bounds validation to `bsToAd`
- Styles now injected once via `injectStyles()` — safe for SSR/Next.js
- Keyboard accessibility (`Enter`/`Space`) on day cells
- `NepaliDatePicker` closes on outside click

### v4.0.0
- Initial public release

---

## License

 © Saroj Dhakal @Sarojdhakal307