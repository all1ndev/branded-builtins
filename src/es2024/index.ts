// Augmentations for APIs in TypeScript's "es2024" lib and below, the ES level Node 22
// supports. Needs no host types.

import type {
	EncodedUri,
	EncodedUriComponent,
	EpochMilliseconds,
	Finite,
	HttpDate,
	Integer,
	IsoUtcString,
	Minutes,
	Json,
	LanguageTag,
	NfcString,
	NfdString,
	NfkcString,
	NfkdString,
	SafeInteger,
	TimeZoneId,
	WellFormedString,
} from "../index.ts";

declare global {
	interface DateConstructor {
		now(): EpochMilliseconds;
		// NaN for an unparsable string: the brand marks the unit, not validity.
		parse(s: string): EpochMilliseconds;
		UTC(
			year: number,
			monthIndex: number,
			date?: number,
			hours?: number,
			minutes?: number,
			seconds?: number,
			ms?: number,
		): EpochMilliseconds;
	}
	interface Date {
		getTime(): EpochMilliseconds;
		valueOf(): EpochMilliseconds;
		// Throws a RangeError for an invalid date, so the brand always holds.
		toISOString(): IsoUtcString;
		// null at runtime for an invalid date, which the lib's `string` already ignores.
		toJSON(key?: any): IsoUtcString;
		// "Invalid Date" for an invalid date, like getTime's NaN.
		toUTCString(): HttpDate;
		getTimezoneOffset(): Minutes;
		// The setters return the new time value.
		setTime(time: number): EpochMilliseconds;
		setMilliseconds(ms: number): EpochMilliseconds;
		setUTCMilliseconds(ms: number): EpochMilliseconds;
		setSeconds(sec: number, ms?: number): EpochMilliseconds;
		setUTCSeconds(sec: number, ms?: number): EpochMilliseconds;
		setMinutes(min: number, sec?: number, ms?: number): EpochMilliseconds;
		setUTCMinutes(min: number, sec?: number, ms?: number): EpochMilliseconds;
		setHours(hours: number, min?: number, sec?: number, ms?: number): EpochMilliseconds;
		setUTCHours(hours: number, min?: number, sec?: number, ms?: number): EpochMilliseconds;
		setDate(date: number): EpochMilliseconds;
		setUTCDate(date: number): EpochMilliseconds;
		setMonth(month: number, date?: number): EpochMilliseconds;
		setUTCMonth(month: number, date?: number): EpochMilliseconds;
		setFullYear(year: number, month?: number, date?: number): EpochMilliseconds;
		setUTCFullYear(year: number, month?: number, date?: number): EpochMilliseconds;
	}

	interface String {
		normalize(form: "NFC"): NfcString;
		normalize(form: "NFD"): NfdString;
		normalize(form: "NFKC"): NfkcString;
		normalize(form: "NFKD"): NfkdString;
		// NFC is the default form.
		normalize(): NfcString;
		isWellFormed(): this is WellFormedString;
		toWellFormed(): WellFormedString;
	}

	interface NumberConstructor {
		isFinite(number: unknown): number is Finite;
		isInteger(number: unknown): number is Integer;
		isSafeInteger(number: unknown): number is SafeInteger;
	}

	// Only for Finite input: Math.floor(Infinity) is Infinity and Math.floor(NaN) is NaN.
	interface Math {
		floor(x: Finite): Integer;
		ceil(x: Finite): Integer;
		round(x: Finite): Integer;
		trunc(x: Finite): Integer;
		// Both convert their arguments to 32-bit integers, so even NaN gives an integer.
		clz32(x: number): SafeInteger;
		imul(x: number, y: number): SafeInteger;
	}

	interface DataView<TArrayBuffer extends ArrayBufferLike> {
		getInt8(byteOffset: number): SafeInteger;
		getInt16(byteOffset: number, littleEndian?: boolean): SafeInteger;
		getInt32(byteOffset: number, littleEndian?: boolean): SafeInteger;
		getUint8(byteOffset: number): SafeInteger;
		getUint16(byteOffset: number, littleEndian?: boolean): SafeInteger;
		getUint32(byteOffset: number, littleEndian?: boolean): SafeInteger;
	}

	namespace Intl {
		function getCanonicalLocales(locale?: string | readonly string[]): LanguageTag[];
		function supportedValuesOf(key: "timeZone"): TimeZoneId[];
		interface Locale {
			toString(): LanguageTag;
		}
		interface DateTimeFormat {
			resolvedOptions(): ResolvedDateTimeFormatOptions & { timeZone: TimeZoneId };
		}
	}

	interface JSON {
		stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): Json;
		stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): Json;
	}

	function encodeURIComponent(uriComponent: string | number | boolean): EncodedUriComponent;
	function encodeURI(uri: string): EncodedUri;
}
