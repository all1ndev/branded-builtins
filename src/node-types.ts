// Helper types shared by the node entries. Not exported from the package.

import type { AddressInfo } from "node:net";
import type { LookupAddress } from "node:dns";
import type { Stats } from "node:fs";
import type { BigIntNanoseconds, Bytes, EpochMilliseconds, IPv4, IPv6, Nanoseconds } from "./index.ts";

export type BrandedStats = Stats & {
	size: Bytes;
	atimeMs: EpochMilliseconds;
	mtimeMs: EpochMilliseconds;
	ctimeMs: EpochMilliseconds;
	birthtimeMs: EpochMilliseconds;
};

export type BrandedAddressInfo = AddressInfo & { address: IPv4 | IPv6 };
export type BrandedLookupAddress = LookupAddress & { address: IPv4 | IPv6 };

// Listed before the histogram type in the intersection, so these methods win over its own.
export type EventLoopDelays = {
	readonly min: Nanoseconds;
	readonly max: Nanoseconds;
	readonly mean: Nanoseconds;
	readonly stddev: Nanoseconds;
	readonly minBigInt: BigIntNanoseconds;
	percentile(percentile: number): Nanoseconds;
	percentileBigInt(percentile: number): BigIntNanoseconds;
};
