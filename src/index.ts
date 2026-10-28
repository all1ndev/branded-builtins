// Brand types only. Built-in APIs return them once an augmentation entry is loaded:
// "@all1ndev/branded-builtins/es2024", "/es2025", "/esnext", "/dom", "/node22", "/node24" or "/node26".

// Not exported, so branded values can only come from the augmented APIs.
declare const brand: unique symbol;

// A map of tags rather than a single tag, so brands can stack: a SafeInteger is also an Integer.
type Brand<T, B extends string> = T & { readonly [brand]: { readonly [K in B]: true } };

/** A path that `path.isAbsolute()` accepts. */
export type AbsolutePath = Brand<string, "AbsolutePath">;
/** A file descriptor returned by `fs.openSync()`. */
export type FileDescriptor = Brand<number, "FileDescriptor">;

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
export type AsyncId = Brand<number, "AsyncId">;
export type Uid = Brand<number, "Uid">;
export type Gid = Brand<number, "Gid">;

/** Output of `JSON.stringify()`. */
export type Json = Brand<string, "Json">;
/** Output of `encodeURIComponent()`. */
export type EncodedUriComponent = Brand<string, "EncodedUriComponent">;
/** Output of `encodeURI()`. */
export type EncodedUri = Brand<string, "EncodedUri">;
/** The serialized form of a `URL` object. */
export type AbsoluteUrl = Brand<string, "AbsoluteUrl">;
/** Output of `Date#toISOString()`: `YYYY-MM-DDTHH:mm:ss.sssZ`. */
export type IsoUtcString = Brand<string, "IsoUtcString">;
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
/** A time zone identifier that `Intl.DateTimeFormat` and Temporal accept: an IANA name or a UTC offset. */
export type TimeZoneId = Brand<string, "TimeZoneId">;

/** A number that is not NaN or ±Infinity. */
export type Finite = Brand<number, "Finite">;
export type Integer = Brand<number, "Finite" | "Integer">;
/** An integer between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`. */
export type SafeInteger = Brand<number, "Finite" | "Integer" | "SafeInteger">;
