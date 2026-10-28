/// <reference path="../es2025/index.ts" preserve="true" />

// Augmentations for APIs added in TypeScript's "esnext" lib.

import type {
	Base64,
	Base64Url,
	Hex,
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

	namespace Temporal {
		interface Duration {
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
