/// <reference types="node" preserve="true" />

// Module overloads for the current @types/node layout, which declares modules under "node:fs"
// and re-exports them from "fs": 26 and newer. If a version changes or drops an API, older
// entries keep their own copy of the old overload.

import type {
	AbsolutePath,
	AbsoluteUrl,
	AsyncId,
	Base64,
	Base64Url,
	Bytes,
	FileDescriptor,
	Gid,
	Hex,
	IPv4,
	IPv6,
	Milliseconds,
	PerformanceTimestamp,
	SafeInteger,
	Seconds,
	Uid,
} from "../index.ts";
// Inside `declare module "node:crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type { LookupAllOptions, LookupOneOptions, LookupOptions, RecordWithTtl, ResolveWithTtlOptions } from "node:dns";
import type {
	EncodingOption,
	MakeDirectoryOptions,
	Mode,
	ObjectEncodingOptions,
	PathLike,
	ReadOptions,
	ReadOptionsWithBuffer,
	ReadPosition,
	StatOptions,
} from "node:fs";
import type { BrandedAddressInfo, BrandedLookupAddress, BrandedStats, EventLoopDelays } from "./types.ts";

// Augmentations are merged with higher priority, so these overloads win over the originals.
// Only the module that holds the declarations can be augmented: augmenting a module that
// re-exports it would shadow the original overloads instead of adding to them.

// @types/node 26 declares the functions of "node:path" in a namespace exported with `export =`.
declare module "node:path" {
	function resolve(...paths: string[]): AbsolutePath;
	function join(path: AbsolutePath, ...paths: string[]): AbsolutePath;
	function normalize(path: AbsolutePath): AbsolutePath;
	function dirname(path: AbsolutePath): AbsolutePath;
	function toNamespacedPath(path: AbsolutePath): AbsolutePath;
	function parse(path: AbsolutePath): ParsedPath & { root: AbsolutePath; dir: AbsolutePath };
	function isAbsolute(path: string): path is AbsolutePath;
}

declare module "node:url" {
	function fileURLToPath(url: string | URL, options?: FileUrlToPathOptions): AbsolutePath;
	interface URL {
		toString(): AbsoluteUrl;
		toJSON(): AbsoluteUrl;
	}
}

declare module "node:module" {
	function findPackageJSON(specifier: string | URL, base?: string | URL): AbsolutePath | undefined;
	function getCompileCacheDir(): AbsolutePath | undefined;
}

declare module "node:fs" {
	function realpathSync(path: PathLike, options?: EncodingOption): AbsolutePath;
	namespace realpathSync {
		function native(path: PathLike, options?: EncodingOption): AbsolutePath;
	}
	// A relative prefix or path gives a relative result, so only absolute input keeps the brand.
	function mkdtempSync(prefix: AbsolutePath, options?: EncodingOption): AbsolutePath;
	function mkdtempDisposableSync(
		prefix: AbsolutePath,
		options?: EncodingOption,
	): DisposableTempDir & { path: AbsolutePath };
	function mkdirSync(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): AbsolutePath | undefined;
	function openSync(path: PathLike, flags?: OpenMode, mode?: Mode | null): FileDescriptor;

	function readSync(
		fd: number,
		buffer: NodeJS.ArrayBufferView,
		offset: number,
		length: number,
		position: ReadPosition | null,
	): Bytes;
	function readSync(fd: number, buffer: NodeJS.ArrayBufferView, opts?: ReadOptions): Bytes;
	function writeSync(
		fd: number,
		buffer: NodeJS.ArrayBufferView,
		offset?: number | null,
		length?: number | null,
		position?: number | null,
	): Bytes;
	function writeSync(fd: number, string: string, position?: number | null, encoding?: BufferEncoding | null): Bytes;

	function statSync(path: PathLike): BrandedStats;
	function statSync(
		path: PathLike,
		options?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): BrandedStats;
	function statSync(
		path: PathLike,
		options: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): BrandedStats | undefined;
	function lstatSync(path: PathLike): BrandedStats;
	function lstatSync(
		path: PathLike,
		options?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): BrandedStats;
	function lstatSync(
		path: PathLike,
		options: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): BrandedStats | undefined;
}

declare module "node:fs/promises" {
	function realpath(path: PathLike, options?: ObjectEncodingOptions | BufferEncoding | null): Promise<AbsolutePath>;
	function mkdtemp(
		prefix: AbsolutePath,
		options?: ObjectEncodingOptions | BufferEncoding | null,
	): Promise<AbsolutePath>;
	function mkdtempDisposable(
		prefix: AbsolutePath,
		options?: EncodingOption,
	): Promise<DisposableTempDir & { path: AbsolutePath }>;
	function mkdir(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): Promise<AbsolutePath | undefined>;
	function open(
		path: PathLike,
		flags?: string | number,
		mode?: Mode,
	): Promise<FileHandle & { readonly fd: FileDescriptor }>;

	function stat(path: PathLike): Promise<BrandedStats>;
	function stat(
		path: PathLike,
		opts?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): Promise<BrandedStats>;
	function stat(
		path: PathLike,
		opts: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): Promise<BrandedStats | undefined>;
	function lstat(path: PathLike, opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;

	interface FileHandle {
		stat(opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;
		read<T extends NodeJS.ArrayBufferView>(
			buffer: T,
			offset?: number | null,
			length?: number | null,
			position?: ReadPosition | null,
		): Promise<FileReadResult<T> & { bytesRead: Bytes }>;
		read<T extends NodeJS.ArrayBufferView>(
			buffer: T,
			options?: ReadOptions,
		): Promise<FileReadResult<T> & { bytesRead: Bytes }>;
		read<T extends NodeJS.ArrayBufferView = NonSharedBuffer>(
			options?: ReadOptionsWithBuffer<T>,
		): Promise<FileReadResult<T> & { bytesRead: Bytes }>;
		write<TBuffer extends NodeJS.ArrayBufferView>(
			buffer: TBuffer,
			offset?: number | null,
			length?: number | null,
			position?: number | null,
		): Promise<{ bytesWritten: Bytes; buffer: TBuffer }>;
		write<TBuffer extends Uint8Array>(
			buffer: TBuffer,
			options?: { offset?: number; length?: number; position?: number },
		): Promise<{ bytesWritten: Bytes; buffer: TBuffer }>;
		write(
			data: string,
			position?: number | null,
			encoding?: BufferEncoding | null,
		): Promise<{ bytesWritten: Bytes; buffer: string }>;
	}
}

declare module "node:os" {
	function homedir(): AbsolutePath;
	function tmpdir(): AbsolutePath;
	function uptime(): Seconds;
	function totalmem(): Bytes;
	function freemem(): Bytes;
	function cpus(): (CpuInfo & {
		times: { user: Milliseconds; nice: Milliseconds; sys: Milliseconds; idle: Milliseconds; irq: Milliseconds };
	})[];
	function userInfo(
		options?: UserInfoOptionsWithStringEncoding,
	): UserInfo<string> & { uid: Uid; gid: Gid; homedir: AbsolutePath };
	function networkInterfaces(): NodeJS.Dict<
		((NetworkInterfaceInfoIPv4 & { address: IPv4 }) | (NetworkInterfaceInfoIPv6 & { address: IPv6 }))[]
	>;
}

declare module "node:crypto" {
	interface Hash {
		digest(encoding: "hex"): Hex;
		digest(encoding: "base64"): Base64;
		digest(encoding: "base64url"): Base64Url;
	}
	interface X509Certificate {
		checkIP(ip: string): IPv4 | IPv6 | undefined;
	}
	interface Hmac {
		digest(encoding: "hex"): Hex;
		digest(encoding: "base64"): Base64;
		digest(encoding: "base64url"): Base64Url;
	}
	// "hex" is the default output encoding.
	function hash(algorithm: string, data: BinaryLike, options?: "hex"): Hex;
	function hash(algorithm: string, data: BinaryLike, options: "base64"): Base64;
	function hash(algorithm: string, data: BinaryLike, options: "base64url"): Base64Url;
	function randomUUID(options?: RandomUUIDOptions): BrandedUUID;
	// Node requires max - min < 2 ** 48, so the result is always safe.
	function randomInt(max: number): SafeInteger;
	function randomInt(min: number, max: number): SafeInteger;
	function randomUUIDv7(options?: RandomUUIDV7Options): BrandedUUID;
	namespace webcrypto {
		interface Crypto {
			randomUUID(): BrandedUUID;
		}
	}
}

declare module "node:perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & ELDHistogram;
	interface Performance {
		now(): PerformanceTimestamp;
		mark(
			markName: string,
			markOptions?: PerformanceMarkOptions,
		): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		measure(
			measureName: string,
			startMark?: string,
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(
			measureName: string,
			options: PerformanceMeasureOptions,
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
	}
}

declare module "node:net" {
	function isIPv4(input: string): input is IPv4;
	function isIPv6(input: string): input is IPv6;
	interface Server {
		// A string for a pipe or Unix domain socket.
		address(): BrandedAddressInfo | string | null;
	}
	interface Socket {
		address(): BrandedAddressInfo | {};
	}
}

declare module "node:dgram" {
	interface Socket {
		address(): BrandedAddressInfo;
	}
}

declare module "node:dns/promises" {
	function lookup(hostname: string, family: number): Promise<BrandedLookupAddress>;
	function lookup(hostname: string, options: LookupOneOptions): Promise<BrandedLookupAddress>;
	function lookup(hostname: string, options: LookupAllOptions): Promise<BrandedLookupAddress[]>;
	function lookup(hostname: string, options: LookupOptions): Promise<BrandedLookupAddress | BrandedLookupAddress[]>;
	function lookup(hostname: string): Promise<BrandedLookupAddress>;
	function resolve(hostname: string): Promise<IPv4[]>;
	function resolve(hostname: string, rrtype: "A"): Promise<IPv4[]>;
	function resolve(hostname: string, rrtype: "AAAA"): Promise<IPv6[]>;
	function resolve4(hostname: string): Promise<IPv4[]>;
	function resolve4(hostname: string, options: ResolveWithTtlOptions): Promise<(RecordWithTtl & { address: IPv4 })[]>;
	function resolve6(hostname: string): Promise<IPv6[]>;
	function resolve6(hostname: string, options: ResolveWithTtlOptions): Promise<(RecordWithTtl & { address: IPv6 })[]>;
}

declare module "node:async_hooks" {
	function executionAsyncId(): AsyncId;
	function triggerAsyncId(): AsyncId;
	interface AsyncResource {
		asyncId(): AsyncId;
		triggerAsyncId(): AsyncId;
	}
}
