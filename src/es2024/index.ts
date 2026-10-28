// Augmentations for APIs in TypeScript's "es2024" lib and below, the ES level Node 22
// supports. Needs no host types.

import type {
	EncodedUri,
	EncodedUriComponent,
	EpochMilliseconds,
	Finite,
	Integer,
	IsoUtcString,
	Minutes,
	Json,
	NfcString,
	NfdString,
	NfkcString,
	NfkdString,
	SafeInteger,
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
		getTimezoneOffset(): Minutes;
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
	}

	interface JSON {
		stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): Json;
		stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): Json;
	}

	function encodeURIComponent(uriComponent: string | number | boolean): EncodedUriComponent;
	function encodeURI(uri: string): EncodedUri;
}
