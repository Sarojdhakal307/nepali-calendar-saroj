export const NEPALI_MONTHS = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुन",
  "चैत"
];

export const NEPALI_WEEKDAYS = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार"
];

export const NEPALI_WEEKDAYS_SHORT = [
  "आइत",
  "सोम",
  "मङ्गल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि"
];

export const NEPALI_DIGITS = ["०","१","२","३","४","५","६","७","८","९"];

export function toNepaliNumber(num: number | string) {
  return num
    .toString()
    .split("")
    .map(d => NEPALI_DIGITS[Number(d)] ?? d)
    .join("");
}
