// The es2024 entry on its own: no DOM, no @types/node.
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;

Date.now() satisfies B.EpochMilliseconds;
Date.parse(raw) satisfies B.EpochMilliseconds;
Date.UTC(2026, 0) satisfies B.EpochMilliseconds;
new Date().getTime() satisfies B.EpochMilliseconds;
new Date().valueOf() satisfies B.EpochMilliseconds;
JSON.stringify({ a: 1 }) satisfies B.Json;
JSON.stringify({ a: 1 }, null, 2) satisfies B.Json;
JSON.stringify({ a: 1 }, ["a"]) satisfies B.Json;
encodeURIComponent(raw) satisfies B.EncodedUriComponent;
encodeURI(raw) satisfies B.EncodedUri;
decodeURIComponent(encodeURIComponent(raw)) satisfies string;
// @ts-expect-error
encodeURI(raw) satisfies B.EncodedUriComponent;
// @ts-expect-error
raw satisfies B.Json;
// @ts-expect-error no host APIs are declared
btoa(raw);

new Date().toISOString() satisfies B.IsoUtcString;
new Date().toJSON() satisfies B.IsoUtcString;
raw.normalize() satisfies B.NfcString;
raw.normalize("NFC") satisfies B.NfcString;
raw.normalize("NFD") satisfies B.NfdString;
raw.normalize("NFKC") satisfies B.NfkcString;
raw.normalize("NFKD") satisfies B.NfkdString;
// @ts-expect-error
raw.normalize("NFD") satisfies B.NfcString;

declare const value: unknown;
if (Number.isSafeInteger(value)) {
	value satisfies B.SafeInteger;
	// Brands stack: a SafeInteger is also an Integer and Finite.
	value satisfies B.Integer;
	value satisfies B.Finite;
}
if (Number.isInteger(value)) {
	value satisfies B.Integer;
	// @ts-expect-error an Integer is not necessarily safe
	value satisfies B.SafeInteger;
}
if (Number.isFinite(value)) {
	// @ts-expect-error a Finite number is not necessarily an Integer
	value satisfies B.Integer;
}

new Date().getTimezoneOffset() satisfies B.Minutes;
raw.toWellFormed() satisfies B.WellFormedString;
if (raw.isWellFormed()) {
	raw satisfies B.WellFormedString;
}
// @ts-expect-error
raw satisfies B.WellFormedString;

declare const finite: B.Finite;
declare const num: number;
Math.floor(finite) satisfies B.Integer;
Math.ceil(finite) satisfies B.Integer;
Math.round(finite) satisfies B.Integer;
Math.trunc(finite) satisfies B.Integer;
// @ts-expect-error Math.floor(Infinity) is Infinity
Math.floor(num) satisfies B.Integer;
// Passed as a value, the original signature applies.
[num].map(Math.round) satisfies number[];
Array.from([num], Math.trunc) satisfies number[];

declare const date: Date;
date.toUTCString() satisfies B.HttpDate;
date.setTime(0) satisfies B.EpochMilliseconds;
date.setMilliseconds(0) satisfies B.EpochMilliseconds;
date.setUTCMilliseconds(0) satisfies B.EpochMilliseconds;
date.setSeconds(0, 0) satisfies B.EpochMilliseconds;
date.setUTCSeconds(0) satisfies B.EpochMilliseconds;
date.setMinutes(0) satisfies B.EpochMilliseconds;
date.setUTCMinutes(0, 0, 0) satisfies B.EpochMilliseconds;
date.setHours(0) satisfies B.EpochMilliseconds;
date.setUTCHours(0, 0, 0, 0) satisfies B.EpochMilliseconds;
date.setDate(1) satisfies B.EpochMilliseconds;
date.setUTCDate(1) satisfies B.EpochMilliseconds;
date.setMonth(0) satisfies B.EpochMilliseconds;
date.setUTCMonth(0, 1) satisfies B.EpochMilliseconds;
date.setFullYear(2026) satisfies B.EpochMilliseconds;
date.setUTCFullYear(2026, 0, 1) satisfies B.EpochMilliseconds;
// @ts-expect-error
date.toString() satisfies B.HttpDate;

Math.clz32(num) satisfies B.SafeInteger;
Math.imul(num, num) satisfies B.SafeInteger;
declare const view: DataView;
view.getInt8(0) satisfies B.SafeInteger;
view.getInt16(0) satisfies B.SafeInteger;
view.getInt32(0, true) satisfies B.SafeInteger;
view.getUint8(0) satisfies B.SafeInteger;
view.getUint16(0, true) satisfies B.SafeInteger;
view.getUint32(0) satisfies B.SafeInteger;
// @ts-expect-error getFloat64 can return NaN
view.getFloat64(0) satisfies B.Finite;

Intl.getCanonicalLocales(raw) satisfies B.LanguageTag[];
Intl.getCanonicalLocales() satisfies B.LanguageTag[];
new Intl.Locale(raw).toString() satisfies B.LanguageTag;
// @ts-expect-error
raw satisfies B.LanguageTag;
Intl.supportedValuesOf("timeZone") satisfies B.TimeZoneId[];
new Intl.DateTimeFormat().resolvedOptions().timeZone satisfies B.TimeZoneId;
new Intl.DateTimeFormat().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.Collator().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.NumberFormat().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.NumberFormat().resolvedOptions().currency satisfies B.CurrencyCode | undefined;
new Intl.PluralRules().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.RelativeTimeFormat().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.DisplayNames(raw, { type: "region" }).resolvedOptions().locale satisfies B.LanguageTag;
new Intl.ListFormat().resolvedOptions().locale satisfies B.LanguageTag;
new Intl.Segmenter().resolvedOptions().locale satisfies B.LanguageTag;
// @ts-expect-error
new Intl.NumberFormat().resolvedOptions().numberingSystem satisfies B.LanguageTag;
Intl.DateTimeFormat.supportedLocalesOf(raw) satisfies B.LanguageTag[];
Intl.Collator.supportedLocalesOf([raw]) satisfies B.LanguageTag[];
Intl.NumberFormat.supportedLocalesOf(raw, { style: "currency" }) satisfies B.LanguageTag[];
Intl.PluralRules.supportedLocalesOf(raw) satisfies B.LanguageTag[];
Intl.supportedValuesOf("currency") satisfies B.CurrencyCode[];
// @ts-expect-error
Intl.supportedValuesOf("unit") satisfies B.CurrencyCode[];
// @ts-expect-error
Intl.supportedValuesOf("currency") satisfies B.TimeZoneId[];

declare const items: number[];
declare const readonlyItems: readonly string[];
items.indexOf(1) satisfies B.SafeInteger;
items.lastIndexOf(1, 2) satisfies B.SafeInteger;
items.findIndex((item) => item > 1) satisfies B.SafeInteger;
items.findLastIndex((item) => item > 1) satisfies B.SafeInteger;
items.push(1, 2) satisfies B.SafeInteger;
items.unshift(1) satisfies B.SafeInteger;
readonlyItems.indexOf(raw) satisfies B.SafeInteger;
readonlyItems.lastIndexOf(raw) satisfies B.SafeInteger;
readonlyItems.findIndex((item) => item === raw) satisfies B.SafeInteger;
readonlyItems.findLastIndex((item) => item === raw) satisfies B.SafeInteger;
raw.indexOf("a") satisfies B.SafeInteger;
raw.lastIndexOf("a", 1) satisfies B.SafeInteger;
raw.search(/a/) satisfies B.SafeInteger;
raw.codePointAt(0) satisfies B.SafeInteger | undefined;
// @ts-expect-error NaN past the end
raw.charCodeAt(0) satisfies B.SafeInteger;
// @ts-expect-error -1 for a missing item
items.indexOf(1) satisfies B.Uint32;
