/// <reference types="node" preserve="true" />
/// <reference path="../node/globals.ts" preserve="true" />
/// <reference path="../node22-24/modules.ts" preserve="true" />

// Augmentations for @types/node 22: the shared ones, plus the ones that differ in 22.

import type { Json } from "../index.ts";
import type { BinaryEncoding, Encoded, EventLoopDelays } from "../node/types.ts";

declare module "crypto" {
	// 24 renamed these to Cipheriv and Decipheriv.
	// Cipher output goes through a string decoder, so each chunk is whole hex pairs or base64 groups.
	interface Cipher {
		update<E extends BinaryEncoding>(
			data: NodeJS.ArrayBufferView,
			inputEncoding: undefined,
			outputEncoding: E,
		): Encoded<E>;
		update<E extends BinaryEncoding>(
			data: string,
			inputEncoding: Encoding | undefined,
			outputEncoding: E,
		): Encoded<E>;
		final<E extends BinaryEncoding>(outputEncoding: E): Encoded<E>;
	}
	interface Decipher {
		update<E extends BinaryEncoding>(
			data: NodeJS.ArrayBufferView,
			inputEncoding: undefined,
			outputEncoding: E,
		): Encoded<E>;
		update<E extends BinaryEncoding>(
			data: string,
			inputEncoding: Encoding | undefined,
			outputEncoding: E,
		): Encoded<E>;
		final<E extends BinaryEncoding>(outputEncoding: E): Encoded<E>;
	}
}

declare module "perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & IntervalHistogram;
}

declare module "worker_threads" {
	// 24 moved this to v8.
	interface CPUProfileHandle {
		stop(): Promise<Json>;
	}
}
