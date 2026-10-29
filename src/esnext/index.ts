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
		toHex(): Hex;
	}

	namespace Intl {
		interface Locale {
			getTimeZones(): TimeZoneId[] | undefined;
		}
	}

	// Options can drop the offset, time zone or seconds, so only the plain calls are branded.
	namespace Temporal {
		interface PlainDate {
			toString(): IsoDate;
			toJSON(): IsoDate;
		}
		interface PlainTime {
			toString(): IsoTime;
			toJSON(): IsoTime;
		}
		interface PlainDateTime {
			toString(): IsoDateTime;
			toJSON(): IsoDateTime;
		}
		interface ZonedDateTime {
			toString(): IsoZonedDateTime;
			toJSON(): IsoZonedDateTime;
		}
		interface Instant {
			toString(): IsoInstant;
			toJSON(): IsoInstant;
		}
		interface Duration {
			toString(): IsoDuration;
			toJSON(): IsoDuration;
			total(totalOf: TotalOf<"hour">): Hours;
			total(totalOf: TotalOf<"minute">): Minutes;
			total(totalOf: TotalOf<"second">): Seconds;
			total(totalOf: TotalOf<"millisecond">): Milliseconds;
			total(totalOf: TotalOf<"microsecond">): Microseconds;
			total(totalOf: TotalOf<"nanosecond">): Nanoseconds;
		}
		namespace Now {
			function timeZoneId(): TimeZoneId;
		}
	}
}

type TotalOf<T extends Temporal.TimeUnit> =
	Temporal.PluralizeUnit<T> | (Temporal.DurationTotalOptions & { unit: Temporal.PluralizeUnit<T> });
