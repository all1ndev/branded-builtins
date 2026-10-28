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
