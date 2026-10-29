// Helper types for the node entries. Not exported from the package.

import type { LookupAddress, SoaRecord } from "node:dns";
import type { Stats, StatsFs } from "node:fs";
import type { Settings } from "node:http2";
import type { AddressInfo } from "node:net";
import type { EventLoopUtilization, PerformanceEntry, PerformanceResourceTiming } from "node:perf_hooks";
import type { StatementResultingChanges } from "node:sqlite";
import type { PeerCertificate } from "node:tls";
import type { CallSiteObject } from "node:util";
import type { HeapSpaceStatistics, HeapStatistics } from "node:v8";
import type {
	Base64,
	Base64Url,
	BigIntNanoseconds,
	Bytes,
	ColonHexFingerprint,
	EpochMilliseconds,
	FileMode,
	Gid,
	Hex,
	IPv4,
	Integer,
	IPv6,
	Milliseconds,
	Nanoseconds,
	OneBased,
	PerformanceTimestamp,
	Port,
	Seconds,
	Uid,
	WellFormedString,
	ZeroBased,
} from "../index.ts";

export type BrandedStats = Stats & {
	size: Bytes;
	blksize: Bytes;
	mode: FileMode;
	uid: Uid;
	gid: Gid;
	atimeMs: EpochMilliseconds;
	mtimeMs: EpochMilliseconds;
	ctimeMs: EpochMilliseconds;
	birthtimeMs: EpochMilliseconds;
};

// @types/node 22 has no `frsize`.
export type BrandedStatsFs = StatsFs & { bsize: Bytes } & ("frsize" extends keyof StatsFs ? { frsize: Bytes } : {});

export type BrandedAddressInfo = AddressInfo & { address: IPv4 | IPv6; port: Port };
export type BrandedLookupAddress = LookupAddress & { address: IPv4 | IPv6 };

// Decoding to these never gives lone surrogates (UTF-8 replaces invalid input with U+FFFD, the
// others give code units up to 0xFF), and keeps ASCII as is, so a decoded path stays a path.
export type TextEncoding = "utf8" | "utf-8" | "latin1" | "binary" | "ascii";
export type BinaryEncoding = "hex" | "base64" | "base64url";
export type Encoded<E extends TextEncoding | BinaryEncoding> = E extends "hex"
	? Hex
	: E extends "base64"
		? Base64
		: E extends "base64url"
			? Base64Url
			: WellFormedString;
// Options of fs APIs that return a path. Other encodings ("hex", "utf16le") don't give a path.
export type PathEncodingOption = TextEncoding | { encoding?: TextEncoding | null | undefined } | null | undefined;

// Listed before the histogram export type in the intersection, so these methods win over its own.
export type EventLoopDelays = {
	readonly min: Nanoseconds;
	readonly max: Nanoseconds;
	readonly mean: Nanoseconds;
	readonly stddev: Nanoseconds;
	readonly minBigInt: BigIntNanoseconds;
	percentile(percentile: number): Nanoseconds;
	percentileBigInt(percentile: number): BigIntNanoseconds;
};

export type BrandedPeerCertificate<T extends PeerCertificate = PeerCertificate> = T & {
	fingerprint: ColonHexFingerprint;
	fingerprint256: ColonHexFingerprint;
	fingerprint512: ColonHexFingerprint;
};

// RFC 7518 encodes these members as base64url without padding.
export type BrandedJsonWebKey<T> = T & {
	[K in "d" | "dp" | "dq" | "e" | "k" | "n" | "p" | "q" | "qi" | "x" | "y"]?: Base64Url | undefined;
};

// For V8 heap statistics: every number is a size in bytes, except the counts and the flag.
export type SizesInBytes<T> = {
	[K in keyof T]: K extends `number_of_${string}`
		? Integer
		: K extends "does_zap_garbage"
			? T[K]
			: T[K] extends number
				? Bytes
				: T[K];
};

// SQLite counts are 64-bit integers: a number that may have lost precision, or a bigint.
export type BrandedChanges = StatementResultingChanges & {
	changes: Integer | bigint;
	lastInsertRowid: Integer | bigint;
};

export type BrandedPerformanceEntry = PerformanceEntry & {
	readonly startTime: PerformanceTimestamp;
	readonly duration: Milliseconds;
};
export type BrandedPerformanceResourceTiming = PerformanceResourceTiming &
	BrandedPerformanceEntry & {
		readonly transferSize: Bytes;
		readonly encodedBodySize: Bytes;
		readonly decodedBodySize: Bytes;
	};
export type BrandedEventLoopUtilization = EventLoopUtilization & { idle: Milliseconds; active: Milliseconds };

export type BrandedGCStatistics<T> = T & {
	beforeGC: {
		heapStatistics: SizesInBytes<HeapStatistics>;
		heapSpaceStatistics: SizesInBytes<HeapSpaceStatistics>[];
	};
	afterGC: { heapStatistics: SizesInBytes<HeapStatistics>; heapSpaceStatistics: SizesInBytes<HeapSpaceStatistics>[] };
};

// RFC 9113 counts these settings in octets.
export type BrandedSettings = Settings & {
	headerTableSize?: Bytes | undefined;
	initialWindowSize?: Bytes | undefined;
	maxFrameSize?: Bytes | undefined;
	maxHeaderListSize?: Bytes | undefined;
};

// SOA timers are seconds by RFC 1035.
export type BrandedSoaRecord = SoaRecord & { refresh: Seconds; retry: Seconds; expire: Seconds; minttl: Seconds };

// SourceMap#findEntry() counts from 0.
export type ZeroBasedSourceMapping<T> = T & {
	generatedLine: ZeroBased;
	generatedColumn: ZeroBased;
	originalLine: ZeroBased;
	originalColumn: ZeroBased;
};
// Stack trace positions count from 1.
export type OneBasedPosition<T> = T & { lineNumber: OneBased; columnNumber: OneBased };
export type BrandedCallSite = OneBasedPosition<CallSiteObject>;
