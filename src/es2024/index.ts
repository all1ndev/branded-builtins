// Augmentations for APIs in TypeScript's "es2024" lib and below, the ES level Node 22
// supports. Needs no host types.

import type {
	BrandTags,
	CurrencyCode,
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

// The primitive under a brand. Unbranded types, literal unions included, stay as they are.
type Unbranded<T> = T extends string & BrandTags<string>
	? string
	: T extends number & BrandTags<string>
		? number
		: T extends bigint & BrandTags<string>
			? bigint
			: T;

declare global {
	interface DateConstructor {
		now(): EpochMilliseconds;
		// NaN for an unparsable string: the brand marks the unit, not validity.
		parse(s: string): EpochMilliseconds;
		UTC(
			year: number,
			monthIndex?: number,
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
		normalize(this: never, form?: string): string;
		isWellFormed(): this is WellFormedString;
		toWellFormed(): WellFormedString;
		// Strings are shorter than 2 ** 53, so their indexes are safe.
		indexOf(searchString: string, position?: number): SafeInteger;
		lastIndexOf(searchString: string, position?: number): SafeInteger;
		// A custom searcher can return anything, so only strings and RegExps are branded.
		search(regexp: string | RegExp): SafeInteger;
		search(this: never, searcher: { [Symbol.search](string: string): number }): number;
		codePointAt(pos: number): SafeInteger | undefined;
	}

	// Arrays are shorter than 2 ** 32, so their indexes and lengths are safe. An array of branded values
	// can be searched for a plain one.
	interface Array<T> {
		includes(searchElement: Unbranded<T>, fromIndex?: number): boolean;
		includes(searchElement: T, fromIndex?: number): boolean;
		indexOf(searchElement: Unbranded<T>, fromIndex?: number): SafeInteger;
		indexOf(searchElement: T, fromIndex?: number): SafeInteger;
		lastIndexOf(searchElement: Unbranded<T>, fromIndex?: number): SafeInteger;
		lastIndexOf(searchElement: T, fromIndex?: number): SafeInteger;
		findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): SafeInteger;
		findLastIndex(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): SafeInteger;
		push(...items: T[]): SafeInteger;
		unshift(...items: T[]): SafeInteger;
	}
	interface ReadonlyArray<T> {
		includes(searchElement: Unbranded<T>, fromIndex?: number): boolean;
		includes(searchElement: T, fromIndex?: number): boolean;
		indexOf(searchElement: Unbranded<T>, fromIndex?: number): SafeInteger;
		indexOf(searchElement: T, fromIndex?: number): SafeInteger;
		lastIndexOf(searchElement: Unbranded<T>, fromIndex?: number): SafeInteger;
		lastIndexOf(searchElement: T, fromIndex?: number): SafeInteger;
		findIndex(predicate: (value: T, index: number, obj: readonly T[]) => unknown, thisArg?: any): SafeInteger;
		findLastIndex(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): SafeInteger;
	}

	interface NumberConstructor {
		isFinite(number: unknown): number is Finite;
		isInteger(number: unknown): number is Integer;
		isSafeInteger(number: unknown): number is SafeInteger;
	}

	// Only for Finite input: Math.floor(Infinity) is Infinity and Math.floor(NaN) is NaN.
	// Each original signature is restated last, because TypeScript reads the last overload when a
	// function is passed as a value or reflected with ReturnType or Parameters.
	interface Math {
		floor(x: Finite): Integer;
		floor(x: number): number;
		ceil(x: Finite): Integer;
		ceil(x: number): number;
		round(x: Finite): Integer;
		round(x: number): number;
		trunc(x: Finite): Integer;
		trunc(x: number): number;
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
		function supportedValuesOf(key: "currency"): CurrencyCode[];
		function supportedValuesOf(
			key: "calendar" | "collation" | "currency" | "numberingSystem" | "timeZone" | "unit",
		): string[];
		interface Locale {
			toString(): LanguageTag;
		}
		// Resolved locales are canonicalized, and currency codes uppercased.
		interface DateTimeFormat {
			resolvedOptions(): ResolvedDateTimeFormatOptions & { locale: LanguageTag; timeZone: TimeZoneId };
		}
		interface Collator {
			resolvedOptions(): ResolvedCollatorOptions & { locale: LanguageTag };
		}
		interface NumberFormat {
			resolvedOptions(): ResolvedNumberFormatOptions & { locale: LanguageTag; currency?: CurrencyCode };
		}
		interface PluralRules {
			resolvedOptions(): ResolvedPluralRulesOptions & { locale: LanguageTag };
		}
		interface RelativeTimeFormat {
			resolvedOptions(): ResolvedRelativeTimeFormatOptions & { locale: LanguageTag };
		}
		interface DisplayNames {
			resolvedOptions(): ResolvedDisplayNamesOptions & { locale: LanguageTag };
		}
		interface ListFormat {
			resolvedOptions(): ResolvedListFormatOptions & { locale: LanguageTag };
		}
		interface Segmenter {
			resolvedOptions(): ResolvedSegmenterOptions & { locale: LanguageTag };
		}
		// The other formatters' constructors are anonymous types, which can't be augmented.
		interface DateTimeFormatConstructor {
			supportedLocalesOf(locales: LocalesArgument, options?: DateTimeFormatOptions): LanguageTag[];
		}
		interface CollatorConstructor {
			supportedLocalesOf(locales: LocalesArgument, options?: CollatorOptions): LanguageTag[];
		}
		interface NumberFormatConstructor {
			supportedLocalesOf(locales: LocalesArgument, options?: NumberFormatOptions): LanguageTag[];
		}
		interface PluralRulesConstructor {
			supportedLocalesOf(
				locales: LocalesArgument,
				options?: { localeMatcher?: "lookup" | "best fit" },
			): LanguageTag[];
		}
	}

	interface JSON {
		stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): Json;
		stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): Json;
	}

	function encodeURIComponent(uriComponent: string | number | boolean): EncodedUriComponent;
	function encodeURI(uri: string): EncodedUri;
}
