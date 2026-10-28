/// <reference types="node" preserve="true" />
/// <reference path="../node/globals.ts" preserve="true" />
/// <reference path="../node22-24/modules.ts" preserve="true" />

// Augmentations for @types/node 24: the shared ones, plus the ones added or renamed in 24.

import type { AbsolutePath, Json, WellFormedString } from "../index.ts";
// Inside `declare module "crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type { ReadableStream } from "node:stream/web";
import type {
	BinaryEncoding,
	BrandedAddressInfo,
	BrandedChanges,
	BrandedEventLoopUtilization,
	Encoded,
	EventLoopDelays,
	PathEncodingOption,
} from "../node/types.ts";

declare module "fs" {
	function mkdtempDisposableSync(
		prefix: AbsolutePath,
		options?: PathEncodingOption,
	): DisposableTempDir & { path: AbsolutePath };
}

declare module "fs/promises" {
	function mkdtempDisposable(
		prefix: AbsolutePath,
		options?: PathEncodingOption,
	): Promise<DisposableTempDir & { path: AbsolutePath }>;
}

declare module "buffer" {
	interface Blob {
		textStream(): ReadableStream<WellFormedString>;
	}
}

declare module "crypto" {
	function randomUUIDv7(options?: RandomUUIDV7Options): BrandedUUID;
	// 22 names these Cipher and Decipher.
	// Cipher output goes through a string decoder, so each chunk is whole hex pairs or base64 groups.
	interface Cipheriv {
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
	interface Decipheriv {
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
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & ELDHistogram;
	function eventLoopUtilization(
		utilization1?: EventLoopUtilization,
		utilization2?: EventLoopUtilization,
	): BrandedEventLoopUtilization;
	interface Performance {
		eventLoopUtilization(
			utilization1?: EventLoopUtilization,
			utilization2?: EventLoopUtilization,
		): BrandedEventLoopUtilization;
	}
}

declare module "v8" {
	// Profiles are the JSON of a .cpuprofile or .heapprofile file.
	interface SyncCPUProfileHandle {
		stop(): Json;
	}
	interface CPUProfileHandle {
		stop(): Promise<Json>;
	}
	interface HeapProfileHandle {
		stop(): Promise<Json>;
	}
}

declare module "node:sqlite" {
	interface SQLTagStore {
		run(stringElements: TemplateStringsArray, ...boundParameters: SQLInputValue[]): BrandedChanges;
	}
}

declare module "net" {
	interface BoundSocket {
		address(): BrandedAddressInfo;
	}
}

declare module "dgram" {
	interface Socket {
		bindSync(options?: BindSyncOptions): BrandedAddressInfo;
	}
}
