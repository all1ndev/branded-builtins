/// <reference path="../es2025/index.ts" preserve="true" />

// Augmentations for APIs added in TypeScript's "esnext" lib.

import type {
	Base64,
	Base64Url,
	Hex,
	Hours,
	IsoDate,
	IsoDateTime,
	IsoDuration,
	IsoInstant,
	IsoTime,
	IsoZonedDateTime,
	Microseconds,
	Milliseconds,
	Minutes,
	Nanoseconds,
	Seconds,
	TimeZoneId,
} from "../index.ts";

declare global {
	interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
		// "base64" is the default alphabet.
		toBase64(options?: { alphabet?: "base64" | undefined; omitPadding?: boolean | undefined }): Base64;
		toBase64(options: { alphabet: "base64url"; omitPadding?: boolean | undefined }): Base64Url;
		toBase64(options?: {
			alphabet?: "base64" | "base64url" | undefined;
			omitPadding?: boolean | undefined;
		}): string;
		toHex(): Hex;
	}

	namespace Intl {
		interface Locale {
			getTimeZones(): TimeZoneId[] | undefined;
		}
	}

	// Options can drop the offset, time zone or seconds, so only the plain calls are branded. Each original
	// is restated last, as es2024/index.ts explains for Math.floor.
	namespace Temporal {
		interface PlainDate {
			toString(): IsoDate;
			toString(options?: PlainDateToStringOptions): string;
			toJSON(): IsoDate;
		}
		interface PlainTime {
			toString(): IsoTime;
			toString(options?: PlainTimeToStringOptions): string;
			toJSON(): IsoTime;
		}
		interface PlainDateTime {
			toString(): IsoDateTime;
			toString(options?: PlainDateTimeToStringOptions): string;
			toJSON(): IsoDateTime;
		}
		interface ZonedDateTime {
			toString(): IsoZonedDateTime;
			toString(options?: ZonedDateTimeToStringOptions): string;
			toJSON(): IsoZonedDateTime;
		}
		interface Instant {
			toString(): IsoInstant;
			toString(options?: InstantToStringOptions): string;
			toJSON(): IsoInstant;
		}
		interface Duration {
			toString(): IsoDuration;
			toString(options?: DurationToStringOptions): string;
			toJSON(): IsoDuration;
			total(totalOf: TotalOf<"hour">): Hours;
			total(totalOf: TotalOf<"minute">): Minutes;
			total(totalOf: TotalOf<"second">): Seconds;
			total(totalOf: TotalOf<"millisecond">): Milliseconds;
			total(totalOf: TotalOf<"microsecond">): Microseconds;
			total(totalOf: TotalOf<"nanosecond">): Nanoseconds;
			total(this: never, totalOf: DurationTotalOptions): number;
		}
		namespace Now {
			function timeZoneId(): TimeZoneId;
		}
	}
}

type TotalOf<T extends Temporal.TimeUnit> =
	Temporal.PluralizeUnit<T> | (Temporal.DurationTotalOptions & { unit: Temporal.PluralizeUnit<T> });
