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
- 🌗 **Dark & light mode** — built-in theme support via a single `mode` prop
- 📆 **BS 2000 – 2090** — 91 years of verified calendar data
- 🎛 **Controlled & uncontrolled** — works like a standard React input
- 📆 **AD date input** — pass a JS `Date` directly via `adValue` or `defaultAdValue`
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
| `value` | `BsDate \| null` | — | Controlled selected date (BS). Pass `null` to clear. |
| `defaultValue` | `BsDate` | — | Uncontrolled default selection (BS). |
| `onChange` | `(bs: BsDate \| null, ad: Date \| null) => void` | — | Called on day click or clear. Always receives both BS and AD values. |
| `showNepali` | `boolean` | `true` | Use Nepali (Devanagari) script for labels and digits. |
| `showSelectedBar` | `boolean` | `true` | Show the selected-date strip below the grid. |
| `mode` | `"dark" \| "light"` | `"dark"` | Colour theme for the component. |
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
| `value` | `BsDate \| null` | — | Controlled selected date (BS). Pass `null` to clear. |
| `adValue` | `Date \| null` | — | Controlled selected date (AD). Auto-converted to BS internally. |
| `defaultAdValue` | `Date \| null` | — | Uncontrolled default (AD). Auto-converted to BS. Only applied on first render. |
| `onChange` | `(bs: BsDate \| null, ad: Date \| null) => void` | — | Called when a date is picked or cleared. Always receives both BS and AD values. |
| `placeholder` | `string` | `"मिति छान्नुहोस्"` | Placeholder text shown when nothing is selected. |
| `showNepali` | `boolean` | `true` | Use Nepali script for labels and digits. |
| `mode` | `"dark" \| "light"` | `"light"` | Colour theme for the component. |
| `className` | `string` | — | Extra CSS class on the root element. |

> **Prop priority** (when multiple value props are provided):
> `value` → `adValue` → `defaultAdValue` → *(empty)*

---

## Usage Examples

### Dark and light mode

Both components accept a `mode` prop. The default is `"dark"`.

```tsx
{/* Light mode */}
<NepaliCalendar   mode="light" onChange={(bs) => console.log(bs)} />
<NepaliDatePicker mode="light" placeholder="Select date" onChange={(bs) => console.log(bs)} />

{/* Dark mode */}
<NepaliCalendar   mode="dark" onChange={(bs) => console.log(bs)} />
<NepaliDatePicker mode="dark" onChange={(bs) => console.log(bs)} />
```

You can wire `mode` to your app's theme state to switch at runtime:

```tsx
import { useState } from "react";
import { NepaliCalendar, type CalendarMode } from "nepali-calender-saroj";

function App() {
  const [mode, setMode] = useState<CalendarMode>("dark");

  return (
    <>
      <button onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}>
        Toggle theme
      </button>
      <NepaliCalendar mode={mode} onChange={(bs) => console.log(bs)} />
    </>
  );
}
```

---

### Uncontrolled — no default

```tsx
<NepaliDatePicker
  onChange={(bs, ad) => {
    console.log(bs); // { year: 2082, month: 1, day: 1 }
    console.log(ad); // Date object (AD) or null
  }}
/>
```

---

### Uncontrolled — with an AD default date

Pass any JS `Date` as the starting value. It is auto-converted to BS.

```tsx
<NepaliDatePicker
  defaultAdValue={new Date("2025-04-14")}
  onChange={(bs, ad) => {
    console.log(bs); // { year: 2082, month: 1, day: 1 }
    console.log(ad); // Date("2025-04-14")
  }}
/>
```

---

### Controlled — with an AD date

Ideal when your app already works with JS `Date` objects (e.g. from a form, API response, or `useState`).

```tsx
import { useState } from "react";
import { NepaliDatePicker } from "nepali-calender-saroj";

function MyForm() {
  const [date, setDate] = useState<Date | null>(new Date("2025-04-14"));

  return (
    <NepaliDatePicker
      adValue={date}
      onChange={(bs, ad) => setDate(ad)}
    />
  );
}
```

---

### Controlled — with a BS date object

```tsx
import { useState } from "react";
import { NepaliDatePicker, type BsDate } from "nepali-calender-saroj";

function MyForm() {
  const [bsDate, setBsDate] = useState<BsDate | null>({ year: 2082, month: 1, day: 1 });

  return (
    <NepaliDatePicker
      value={bsDate}
      onChange={(bs, ad) => {
        setBsDate(bs);
        console.log(ad); // AD Date is always returned in onChange
      }}
    />
  );
}
```

---

### Controlled — inline calendar with BS date

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

---

### Handling clear (✕ button)

When the user clears the picker, `onChange` fires with `(null, null)`.

```tsx
<NepaliDatePicker
  adValue={date}
  onChange={(bs, ad) => {
    if (!bs || !ad) {
      setDate(null); // user cleared the picker
      return;
    }
    setDate(ad);
  }}
/>
```

---

### Get both BS and AD at once

```tsx
<NepaliCalendar
  onChange={(bs, ad) => {
    if (bs) console.log(`BS: ${bs.year}/${bs.month}/${bs.day}`);
    if (ad) console.log(`AD: ${ad.toISOString().slice(0, 10)}`);
  }}
/>
```

---

### English labels

```tsx
<NepaliCalendar   showNepali={false} onChange={(bs, ad) => console.log(bs, ad)} />
<NepaliDatePicker showNepali={false} placeholder="Select date" onChange={(bs, ad) => console.log(bs, ad)} />
```

---

### No selected-date strip

```tsx
<NepaliCalendar showSelectedBar={false} onChange={(bs) => console.log(bs)} />
```

---

### Start on a specific BS date

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

toNepaliNumber(2082);  // "२०८२"
toNepaliNumber("15");  // "१५"
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
  BsDate,                          // { year, month, day }
  BsDetailedDate,                  // full formatted date object
  CalendarMode,                    // "dark" | "light"
  CalendarYear,                    // single year entry from calendarData.json
  CalendarData,                    // { years: CalendarYear[] }
  NepaliCalendarProps,             // props for <NepaliCalendar />
  NepaliDatePickerProps,           // props for <NepaliDatePicker />
  NepaliDatePickerExtendedProps,   // extended props including adValue / defaultAdValue
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

### `CalendarMode`

```ts
type CalendarMode = "dark" | "light";
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

### v5.3.0
- Added `adValue` prop to `NepaliDatePicker` — pass a JS `Date` (AD) as a controlled value, auto-converted to BS
- Added `defaultAdValue` prop to `NepaliDatePicker` — uncontrolled AD default, applied on first render only
- Exported `NepaliDatePickerExtendedProps` type
- `onChange` now consistently returns both `bs` and `ad` values in all cases
- Prop priority order: `value` → `adValue` → `defaultAdValue`

### v5.2.1
- Added `mode` prop (`"dark" | "light"`) to both `NepaliCalendar` and `NepaliDatePicker`
- Exported `CalendarMode` type
- Dark mode remains the default — no breaking changes to existing usage
- Light mode uses a warm stone palette with amber accents

### v5.1.1
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