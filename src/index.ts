// Brand types only. Built-in APIs return them once an augmentation entry is loaded:
// "@all1ndev/branded-builtins/es2024", "/es2025", "/esnext", "/dom", "/node22", "/node24" or "/node26".

// Not exported, so branded values can only come from the augmented APIs.
declare const brand: unique symbol;

// A map of tags rather than a single tag, so brands can stack: a SafeInteger is also an Integer.
// A named interface, so declaration emit can still name a brand that an intersection has flattened,
// as in `Stats & { size: Bytes }`.
export interface BrandTags<B extends string> {
	readonly [brand]: { readonly [K in B]: true };
}
type Brand<T, B extends string> = T & BrandTags<B>;

/** A path that `path.isAbsolute()` accepts. */
export type AbsolutePath = Brand<string, "AbsolutePath">;
/** A file descriptor returned by `fs.openSync()`. */
export type FileDescriptor = Brand<number, "FileDescriptor">;
/** File type and permission bits, as in `Stats#mode` and `process.umask()`. */
export type FileMode = Brand<number, "FileMode">;

export type Hex = Brand<string, "Hex">;
/** Base64 with the standard alphabet (`+/`). Padding may be omitted. */
export type Base64 = Brand<string, "Base64">;
/** Base64 with the URL-safe alphabet (`-_`). Padding may be omitted. */
export type Base64Url = Brand<string, "Base64Url">;

/** Milliseconds since the Unix epoch, as returned by `Date.now()`. */
export type EpochMilliseconds = Brand<number, "EpochMilliseconds">;
/** Milliseconds since `performance.timeOrigin`, as returned by `performance.now()`. */
export type PerformanceTimestamp = Brand<number, "PerformanceTimestamp">;
/** A duration in milliseconds. */
export type Milliseconds = Brand<number, "Milliseconds">;
/** A duration in hours. */
export type Hours = Brand<number, "Hours">;
/** A duration in minutes. */
export type Minutes = Brand<number, "Minutes">;
/** A duration in seconds. */
export type Seconds = Brand<number, "Seconds">;
/** A duration in microseconds. */
export type Microseconds = Brand<number, "Microseconds">;
/** A duration in nanoseconds. */
export type Nanoseconds = Brand<number, "Nanoseconds">;
/** A duration in nanoseconds, as a bigint. */
export type BigIntNanoseconds = Brand<bigint, "BigIntNanoseconds">;

export type Bytes = Brand<number, "Bytes">;
export type Kilobytes = Brand<number, "Kilobytes">;
export type UUID = Brand<`${string}-${string}-${string}-${string}-${string}`, "UUID">;
export type IPv4 = Brand<string, "IPv4">;
export type IPv6 = Brand<string, "IPv6">;
/** An IP address with a prefix length: `192.168.1.10/24`, `fe80::1/64`. */
export type Cidr = Brand<string, "Cidr">;
/** A MAC address as six lowercase hex pairs joined by colons: `00:1a:2b:3c:4d:5e`. */
export type MacAddress = Brand<string, "MacAddress">;
/** A TCP or UDP port: an integer from 0 to 65535. */
export type Port = Brand<number, "Finite" | "Integer" | "SafeInteger" | "Port">;
/** An HTTP header name: a token as RFC 9110 defines it. */
export type HeaderName = Brand<string, "HeaderName">;
/** An HTTP header name in lowercase. */
export type LowercaseHeaderName = Brand<string, "HeaderName" | "LowercaseHeaderName">;
/** PEM-encoded data: one or more `-----BEGIN …-----` blocks. */
export type Pem = Brand<string, "Pem">;
/** A certificate fingerprint as uppercase hex pairs joined by colons: `AB:CD:…`. */
export type ColonHexFingerprint = Brand<string, "ColonHexFingerprint">;
/** A native memory address, as `node:ffi` returns. */
export type Pointer = Brand<bigint, "Pointer">;
export type AsyncId = Brand<number, "AsyncId">;
/** A `setTimeout()` or `setInterval()` handle; `clearTimeout()` and `clearInterval()` accept either. */
export type TimerId = Brand<number, "TimerId">;
/** A `requestAnimationFrame()` handle. */
export type AnimationFrameId = Brand<number, "AnimationFrameId">;
/** A `requestIdleCallback()` handle. */
export type IdleCallbackId = Brand<number, "IdleCallbackId">;
export type Uid = Brand<number, "Uid">;
export type Gid = Brand<number, "Gid">;

/** Output of `JSON.stringify()`. */
export type Json = Brand<string, "Json">;
/** Output of `encodeURIComponent()`. */
export type EncodedUriComponent = Brand<string, "EncodedUriComponent">;
/** Output of `encodeURI()`. */
export type EncodedUri = Brand<string, "EncodedUri">;
/** Output of `URLSearchParams#toString()`: `application/x-www-form-urlencoded`, without a leading `?`. */
export type FormUrlEncoded = Brand<string, "FormUrlEncoded">;
/** The serialized form of a `URL` object. */
export type AbsoluteUrl = Brand<string, "AbsoluteUrl">;
/** A `data:` URL, as `HTMLCanvasElement#toDataURL()` returns. */
export type DataUrl = Brand<string, "AbsoluteUrl" | "DataUrl">;
/** An exact time in UTC that `Temporal.Instant.from()` accepts: `2026-01-01T12:00:00Z`. */
export type IsoInstant = Brand<string, "IsoInstant">;
/** Output of `Date#toISOString()`: `YYYY-MM-DDTHH:mm:ss.sssZ`. Also an `IsoInstant`. */
export type IsoUtcString = Brand<string, "IsoInstant" | "IsoUtcString">;
/** A calendar date: `2026-01-01`, with a `[u-ca=…]` annotation for a non-ISO calendar. */
export type IsoDate = Brand<string, "IsoDate">;
/** A wall-clock time: `12:00:00`, with fractional seconds when nonzero. */
export type IsoTime = Brand<string, "IsoTime">;
/** A date and wall-clock time without a time zone: `2026-01-01T12:00:00`, with a `[u-ca=…]` annotation for a non-ISO calendar. */
export type IsoDateTime = Brand<string, "IsoDateTime">;
/** A date and time with its offset and time zone: `2026-01-01T12:00:00+01:00[Europe/Paris]`. */
export type IsoZonedDateTime = Brand<string, "IsoZonedDateTime">;
/** An ISO 8601 duration: `P1Y2M3DT4H5M6S`, `PT0S`, `-P1D`. */
export type IsoDuration = Brand<string, "IsoDuration">;
/** A string without lone surrogates, as `String#isWellFormed()` checks. */
export type WellFormedString = Brand<string, "WellFormedString">;
/** Output of `RegExp.escape()`: a pattern that matches the escaped string literally. */
export type RegExpSource = Brand<string, "RegExpSource">;
/** Output of `Date#toUTCString()`, the HTTP date format: `Www, DD Mmm YYYY HH:mm:ss GMT`. */
export type HttpDate = Brand<string, "HttpDate">;
/** Output of `CSS.escape()`: an identifier that matches the escaped string literally in a selector. */
export type CssIdentifier = Brand<string, "CssIdentifier">;
/** Output of `String#normalize("NFC")`. */
export type NfcString = Brand<string, "NfcString">;
/** Output of `String#normalize("NFD")`. */
export type NfdString = Brand<string, "NfdString">;
/** Output of `String#normalize("NFKC")`. */
export type NfkcString = Brand<string, "NfkcString">;
/** Output of `String#normalize("NFKD")`. */
export type NfkdString = Brand<string, "NfkdString">;

/** A canonicalized Unicode BCP 47 locale identifier, as `Intl.getCanonicalLocales()` returns. */
export type LanguageTag = Brand<string, "LanguageTag">;
/** An ISO 4217 currency code in uppercase: `USD`. */
export type CurrencyCode = Brand<string, "CurrencyCode">;
/** A time zone identifier that `Intl.DateTimeFormat` and Temporal accept: an IANA name or a UTC offset. */
export type TimeZoneId = Brand<string, "TimeZoneId">;

/** A number that is not NaN or ±Infinity. */
export type Finite = Brand<number, "Finite">;
export type Integer = Brand<number, "Finite" | "Integer">;
/** An integer between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`. */
export type SafeInteger = Brand<number, "Finite" | "Integer" | "SafeInteger">;
/** An integer from 0 to 2³² − 1. */
export type Uint32 = Brand<number, "Finite" | "Integer" | "SafeInteger" | "Uint32">;
/** A line or column number counted from 0. */
export type ZeroBased = Brand<number, "Finite" | "Integer" | "SafeInteger" | "ZeroBased">;
/** A line or column number counted from 1, as in stack traces. */
export type OneBased = Brand<number, "Finite" | "Integer" | "SafeInteger" | "OneBased">;
