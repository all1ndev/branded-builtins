/// <reference types="node" preserve="true" />

// Module overloads for the current @types/node layout, which declares modules under "node:fs"
// and re-exports them from "fs": 26 and newer. If a version changes or drops an API, older
// entries keep their own copy of the old overload.
//
// A plain signature after a group's branded overloads restates the original's last one, as
// es2024/index.ts explains for Math.floor; `this: never` keeps calls off it where the original has
// other overloads. test/overloads.mjs checks every group.

import type { TextDecodeOptions, TextEncoderEncodeIntoResult } from "node:util";
import type {
	AbsolutePath,
	AbsoluteUrl,
	AsyncId,
	Bytes,
	EpochMilliseconds,
	FileDescriptor,
	FormUrlEncoded,
	Gid,
	HeaderName,
	Hex,
	Integer,
	IPv4,
	IPv6,
	Json,
	LowercaseHeaderName,
	Microseconds,
	Milliseconds,
	Cidr,
	EncodedUriComponent,
	MacAddress,
	PerformanceTimestamp,
	Pem,
	Pointer,
	Port,
	SafeInteger,
	Seconds,
	Uid,
	Uint32,
	WellFormedString,
	ZeroBased,
} from "../index.ts";
// Inside `declare module "node:crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type {
	AnyRecord,
	CaaRecord,
	LookupAllOptions,
	LookupOneOptions,
	LookupOptions,
	MxRecord,
	NaptrRecord,
	RecordWithTtl,
	ResolveOptions,
	ResolveWithTtlOptions,
	SoaRecord,
	SrvRecord,
	TlsaRecord,
} from "node:dns";
import type {
	BigIntStats,
	BigIntStatsFs,
	EncodingOption,
	MakeDirectoryOptions,
	Mode,
	OpenMode,
	PathLike,
	ReadOptions,
	ReadOptionsWithBuffer,
	ReadPosition,
	ObjectEncodingOptions,
	ReadFileOptions,
	ReadVResult,
	Stats,
	StatFsOptions,
	StatsFs,
	StatOptions,
	WriteVResult,
} from "node:fs";
import type { ReadableStream } from "node:stream/web";
import type { HeapInfo } from "node:v8";
import type {
	BinaryEncoding,
	BrandedAddressInfo,
	BrandedCallSite,
	BrandedChanges,
	BrandedEventLoopUtilization,
	BrandedGCStatistics,
	BrandedJsonWebKey,
	BrandedLookupAddress,
	BrandedPeerCertificate,
	BrandedPerformanceEntry,
	BrandedPerformanceResourceTiming,
	BrandedSettings,
	BrandedSoaRecord,
	BrandedStats,
	BrandedStatsFs,
	Encoded,
	EventLoopDelays,
	OneBasedPosition,
	PathEncodingOption,
	SizesInBytes,
	TextEncoding,
	ZeroBasedSourceMapping,
} from "./types.ts";

// Augmentations are merged with higher priority, so these overloads win over the originals.
// Only the module that holds the declarations can be augmented: augmenting a module that
// re-exports it would shadow the original overloads instead of adding to them.

// @types/node 26 declares the functions of "node:path" in a namespace exported with `export =`.
declare module "node:path" {
	function resolve(...paths: string[]): AbsolutePath;
	function join(path: AbsolutePath, ...paths: string[]): AbsolutePath;
	function join(...paths: string[]): string;
	function normalize(path: AbsolutePath): AbsolutePath;
	function normalize(path: string): string;
	function dirname(path: AbsolutePath): AbsolutePath;
	function dirname(path: string): string;
	function toNamespacedPath(path: AbsolutePath): AbsolutePath;
	function toNamespacedPath(path: string): string;
	function parse(path: AbsolutePath): ParsedPath & { root: AbsolutePath; dir: AbsolutePath };
	function parse(path: string): ParsedPath;
	function isAbsolute(path: string): path is AbsolutePath;
}

declare module "node:url" {
	// `windows: true` gives a Windows path, which isn't absolute on POSIX, and "C:" for file:///C:.
	function fileURLToPath(
		url: string | URL,
		options?: FileUrlToPathOptions & { windows?: false | undefined },
	): AbsolutePath;
	function fileURLToPath(url: string | URL, options?: FileUrlToPathOptions): string;
	// Options can make the result differ from `href`, so only the plain call is branded.
	function format(urlObject: URL): AbsoluteUrl;
	function format(this: never, urlString: string): string;
	interface URL {
		toString(): AbsoluteUrl;
		toJSON(): AbsoluteUrl;
	}
	interface URLSearchParams {
		toString(): FormUrlEncoded;
	}
}

declare module "node:module" {
	function findPackageJSON(specifier: string | URL, base?: string | URL): AbsolutePath | undefined;
	function getCompileCacheDir(): AbsolutePath | undefined;
	// A relative cache directory is resolved against the working directory.
	function enableCompileCache(
		options?: string | EnableCompileCacheOptions,
	): EnableCompileCacheResult & { directory?: AbsolutePath };
	interface SourceMap {
		findEntry(lineOffset: number, columnOffset: number): ZeroBasedSourceMapping<SourceMapping> | {};
		findOrigin(lineNumber: number, columnNumber: number): OneBasedPosition<SourceOrigin> | {};
	}
}

// Output with an encoding is decoded from one buffer per stream, like Buffer#toString().
// An `any` options object infers nothing for E, so it defaults to any and the result stays unbranded.
declare module "node:child_process" {
	function execSync<E extends TextEncoding | BinaryEncoding = any>(
		command: string,
		options: ExecSyncOptions & { encoding: E },
	): Encoded<E>;
	function execSync(this: never, command: string, options?: ExecSyncOptions): string | NonSharedBuffer;
	function execFileSync<E extends TextEncoding | BinaryEncoding = any>(
		file: string,
		options: ExecFileSyncOptions & { encoding: E },
	): Encoded<E>;
	function execFileSync<E extends TextEncoding | BinaryEncoding = any>(
		file: string,
		args: readonly string[],
		options: ExecFileSyncOptions & { encoding: E },
	): Encoded<E>;
	function execFileSync(
		this: never,
		file: string,
		args?: readonly string[],
		options?: ExecFileSyncOptions,
	): string | NonSharedBuffer;
	function spawnSync<E extends TextEncoding | BinaryEncoding = any>(
		command: string,
		options: SpawnSyncOptions & { encoding: E },
	): SpawnSyncReturns<Encoded<E>>;
	function spawnSync<E extends TextEncoding | BinaryEncoding = any>(
		command: string,
		args: readonly string[],
		options: SpawnSyncOptions & { encoding: E },
	): SpawnSyncReturns<Encoded<E>>;
	function spawnSync(
		this: never,
		command: string,
		args?: readonly string[],
		options?: SpawnSyncOptions,
	): SpawnSyncReturns<string | NonSharedBuffer>;
}

declare module "node:stream" {
	// Object mode counts objects; otherwise the mark is in bytes.
	function getDefaultHighWaterMark(objectMode: false): Bytes;
	function getDefaultHighWaterMark(objectMode: true): Integer;
	function getDefaultHighWaterMark(objectMode: boolean): number;
}

declare module "node:querystring" {
	// Escapes the same characters as encodeURIComponent().
	function escape(str: string): EncodedUriComponent;
}

declare module "node:fs" {
	function realpathSync(path: PathLike, options?: PathEncodingOption): AbsolutePath;
	function realpathSync(this: never, path: PathLike, options?: EncodingOption): string | NonSharedBuffer;
	namespace realpathSync {
		function native(path: PathLike, options?: PathEncodingOption): AbsolutePath;
		function native(this: never, path: PathLike, options?: EncodingOption): string | NonSharedBuffer;
	}
	// A relative prefix or path gives a relative result, so only absolute input keeps the brand.
	function mkdtempSync(prefix: AbsolutePath, options?: PathEncodingOption): AbsolutePath;
	function mkdtempSync(this: never, prefix: string, options?: EncodingOption): string | NonSharedBuffer;
	function mkdtempDisposableSync(
		prefix: AbsolutePath,
		options?: PathEncodingOption,
	): DisposableTempDir & { path: AbsolutePath };
	function mkdtempDisposableSync(prefix: string, options?: EncodingOption): DisposableTempDir;
	function mkdirSync(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): AbsolutePath | undefined;
	function mkdirSync(this: never, path: PathLike, options?: Mode | MakeDirectoryOptions | null): string | undefined;
	function openSync(path: PathLike, flags: OpenMode, mode?: Mode | null): FileDescriptor;
	function openAsBlob(path: PathLike, options?: OpenAsBlobOptions): Promise<Blob & { readonly size: Bytes }>;
	function readFileSync<E extends TextEncoding | BinaryEncoding>(
		path: PathOrFileDescriptor,
		options: E | { encoding: E; flag?: string | undefined },
	): Encoded<E>;
	function readFileSync(
		this: never,
		path: PathOrFileDescriptor,
		options: ReadFileSyncOptions,
	): string | NonSharedBuffer;

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
	function readvSync(fd: number, buffers: readonly NodeJS.ArrayBufferView[], position?: number): Bytes;
	function writevSync(fd: number, buffers: readonly NodeJS.ArrayBufferView[], position?: number): Bytes;

	function statSync(path: PathLike): BrandedStats;
	function statSync(
		path: PathLike,
		options?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): BrandedStats;
	function statSync(
		path: PathLike,
		options: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): BrandedStats | undefined;
	function statSync(this: never, path: PathLike, options?: StatOptions): Stats | BigIntStats | undefined;
	function lstatSync(path: PathLike): BrandedStats;
	function lstatSync(
		path: PathLike,
		options?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): BrandedStats;
	function lstatSync(
		path: PathLike,
		options: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): BrandedStats | undefined;
	function lstatSync(this: never, path: PathLike, options?: StatOptions): Stats | BigIntStats | undefined;
	function fstatSync(fd: number, options?: StatOptions & { bigint?: false | undefined }): BrandedStats;
	function fstatSync(this: never, fd: number, options?: StatOptions): Stats | BigIntStats;
	function statfsSync(path: PathLike, options?: StatFsOptions & { bigint?: false | undefined }): BrandedStatsFs;
	function statfsSync(this: never, path: PathLike, options?: StatFsOptions): StatsFs | BigIntStatsFs;
}

declare module "node:fs/promises" {
	function realpath(path: PathLike, options?: PathEncodingOption): Promise<AbsolutePath>;
	function realpath(
		this: never,
		path: PathLike,
		options?: ObjectEncodingOptions | BufferEncoding | null,
	): Promise<string | NonSharedBuffer>;
	function mkdtemp(prefix: AbsolutePath, options?: PathEncodingOption): Promise<AbsolutePath>;
	function mkdtemp(
		this: never,
		prefix: string,
		options?: ObjectEncodingOptions | BufferEncoding | null,
	): Promise<string | NonSharedBuffer>;
	function mkdtempDisposable(
		prefix: AbsolutePath,
		options?: PathEncodingOption,
	): Promise<DisposableTempDir & { path: AbsolutePath }>;
	function mkdtempDisposable(prefix: PathLike, options?: EncodingOption): Promise<DisposableTempDir>;
	function mkdir(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): Promise<AbsolutePath | undefined>;
	function mkdir(
		this: never,
		path: PathLike,
		options?: Mode | MakeDirectoryOptions | null,
	): Promise<string | undefined>;
	function open(
		path: PathLike,
		flags?: string | number,
		mode?: Mode,
	): Promise<FileHandle & { readonly fd: FileDescriptor }>;
	function readFile<E extends TextEncoding | BinaryEncoding>(
		path: PathLike | FileHandle,
		options: E | { encoding: E; flag?: OpenMode | undefined; signal?: AbortSignal | undefined },
	): Promise<Encoded<E>>;
	function readFile(
		this: never,
		path: PathLike | FileHandle,
		options: ReadFileOptions | BufferEncoding | null,
	): Promise<string | NonSharedBuffer>;

	function stat(path: PathLike): Promise<BrandedStats>;
	function stat(
		path: PathLike,
		opts?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
	): Promise<BrandedStats>;
	function stat(
		path: PathLike,
		opts: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
	): Promise<BrandedStats | undefined>;
	function stat(this: never, path: PathLike, opts?: StatOptions): Promise<Stats | BigIntStats | undefined>;
	function lstat(path: PathLike, opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;
	function lstat(this: never, path: PathLike, opts?: StatOptions): Promise<Stats | BigIntStats>;
	function statfs(path: PathLike, opts?: StatFsOptions & { bigint?: false | undefined }): Promise<BrandedStatsFs>;
	function statfs(this: never, path: PathLike, opts?: StatFsOptions): Promise<StatsFs | BigIntStatsFs>;

	interface FileHandle {
		stat(opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;
		stat(this: never, opts?: StatOptions): Promise<Stats | BigIntStats>;
		readFile<E extends TextEncoding | BinaryEncoding>(
			options: E | { encoding: E; signal?: AbortSignal | undefined },
		): Promise<Encoded<E>>;
		readFile(
			this: never,
			options: Omit<ReadFileOptions, "flag"> | BufferEncoding | null,
		): Promise<string | NonSharedBuffer>;
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
		readv<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
			buffers: TBuffers,
			position?: number,
		): Promise<ReadVResult<TBuffers> & { bytesRead: Bytes }>;
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
		writev<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
			buffers: TBuffers,
			position?: number,
		): Promise<WriteVResult<TBuffers> & { bytesWritten: Bytes }>;
	}
}

declare module "node:buffer" {
	function resolveObjectURL(id: string): (Blob & { readonly size: Bytes }) | undefined;
	// Blobs decode as UTF-8 with replacement, so the text has no lone surrogates.
	interface Blob {
		text(): Promise<WellFormedString>;
		textStream(): ReadableStream<WellFormedString>;
	}
}

declare module "node:os" {
	function homedir(): AbsolutePath;
	function tmpdir(): AbsolutePath;
	function uptime(): Seconds;
	function totalmem(): Bytes;
	function freemem(): Bytes;
	function availableParallelism(): SafeInteger;
	function cpus(): (CpuInfo & {
		times: { user: Milliseconds; nice: Milliseconds; sys: Milliseconds; idle: Milliseconds; irq: Milliseconds };
	})[];
	// Other encodings ("hex", "utf16le") don't give a path, like PathEncodingOption.
	function userInfo(
		options?: UserInfoOptionsWithStringEncoding & { encoding?: TextEncoding | undefined },
	): UserInfo<string> & { uid: Uid; gid: Gid; homedir: AbsolutePath };
	function userInfo(this: never, options: UserInfoOptions): UserInfo<string | NonSharedBuffer>;
	function networkInterfaces(): NodeJS.Dict<
		(
			| (NetworkInterfaceInfoIPv4 & { address: IPv4; netmask: IPv4; mac: MacAddress; cidr: Cidr | null })
			| (NetworkInterfaceInfoIPv6 & { address: IPv6; netmask: IPv6; mac: MacAddress; cidr: Cidr | null })
		)[]
	>;
}

declare module "node:crypto" {
	interface Hash {
		digest<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		digest(this: never, encoding: BufferEncoding): string;
	}
	interface Hmac {
		digest<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		digest(this: never, encoding: BufferEncoding): string;
	}
	// Cipher output goes through a string decoder, so each chunk is whole hex pairs or base64 groups.
	interface Cipheriv {
		update<E extends BinaryEncoding>(
			data: string | NodeJS.ArrayBufferView,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: E,
		): Encoded<E>;
		update(
			this: never,
			data: string | NodeJS.ArrayBufferView,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: BufferEncoding,
		): string;
		final<E extends BinaryEncoding>(outputEncoding: E): Encoded<E>;
		final(this: never, outputEncoding: BufferEncoding): string;
	}
	interface Decipheriv {
		update<E extends BinaryEncoding>(
			data: string | NodeJS.ArrayBufferView,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: E,
		): Encoded<E>;
		update(
			this: never,
			data: string | NodeJS.ArrayBufferView,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: BufferEncoding,
		): string;
		final<E extends BinaryEncoding>(outputEncoding: E): Encoded<E>;
		final(this: never, outputEncoding: BufferEncoding): string;
	}
	interface Sign {
		sign<E extends BinaryEncoding>(
			privateKey:
				KeyLike | SignKeyObjectInput | SignPrivateKeyInput | SignRawPrivateKeyInput | SignJsonWebKeyInput,
			outputFormat: E,
		): Encoded<E>;
		sign(
			this: never,
			privateKey:
				KeyLike | SignKeyObjectInput | SignPrivateKeyInput | SignRawPrivateKeyInput | SignJsonWebKeyInput,
			outputFormat: BufferEncoding,
		): string;
	}
	interface DiffieHellman {
		generateKeys<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		generateKeys(this: never, encoding: BufferEncoding): string;
		computeSecret<E extends BinaryEncoding>(
			otherPublicKey: BinaryLike,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: E,
		): Encoded<E>;
		computeSecret(
			this: never,
			otherPublicKey: BinaryLike,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: BufferEncoding,
		): string;
		getPrime<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPrime(this: never, encoding: BufferEncoding): string;
		getGenerator<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getGenerator(this: never, encoding: BufferEncoding): string;
		getPublicKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPublicKey(this: never, encoding: BufferEncoding): string;
		getPrivateKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPrivateKey(this: never, encoding: BufferEncoding): string;
	}
	interface ECDH {
		generateKeys<E extends BinaryEncoding>(encoding: E, format?: ECDHKeyFormat): Encoded<E>;
		generateKeys(this: never, encoding: BufferEncoding, format?: ECDHKeyFormat): string;
		computeSecret<E extends BinaryEncoding>(
			otherPublicKey: BinaryLike,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: E,
		): Encoded<E>;
		computeSecret(
			this: never,
			otherPublicKey: BinaryLike,
			inputEncoding: BufferEncoding | null | undefined,
			outputEncoding: BufferEncoding,
		): string;
		getPrivateKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPrivateKey(this: never, encoding: BufferEncoding): string;
		getPublicKey<E extends BinaryEncoding>(encoding: E, format?: ECDHKeyFormat): Encoded<E>;
		getPublicKey(this: never, encoding: BufferEncoding, format?: ECDHKeyFormat): string;
	}
	interface KeyObject {
		export(options: (PublicKeyExportOptions | PrivateKeyExportOptions) & { format: "pem" }): Pem;
		export(options: JwkKeyExportOptions): BrandedJsonWebKey<webcrypto.JsonWebKey>;
		export<T extends KeyExportOptions = {}>(options?: T): KeyExportResult<T, NonSharedBuffer>;
	}
	interface X509Certificate {
		checkIP(ip: string): IPv4 | IPv6 | undefined;
		// toJSON() returns the PEM certificate too, not JSON.
		toJSON(): Pem;
		toString(): Pem;
		toLegacyObject(): BrandedPeerCertificate;
	}
	// "hex" is the default output encoding.
	function hash(algorithm: string, data: BinaryLike): Hex;
	function hash<E extends BinaryEncoding>(algorithm: string, data: BinaryLike, options: E): Encoded<E>;
	function hash(
		this: never,
		algorithm: string,
		data: BinaryLike,
		options: OneShotDigestOptions | BufferEncoding | "buffer",
	): string | NonSharedBuffer;
	function randomUUID(options?: RandomUUIDOptions): BrandedUUID;
	// Node requires max - min < 2 ** 48, so the result is always safe.
	function randomInt(max: number): SafeInteger;
	function randomInt(min: number, max: number): SafeInteger;
	function randomInt(
		this: never,
		min: number,
		max: number,
		callback: (err: Error | null, value: number) => void,
	): void;
	function randomUUIDv7(options?: RandomUUIDV7Options): BrandedUUID;
	function getCipherInfo(
		nameOrNid: string | number,
		options?: CipherInfoOptions,
	): (CipherInfo & { keyLength: Bytes; blockSize?: Bytes; ivLength?: Bytes }) | undefined;
	function secureHeapUsed(): SecureHeapUsage & { total: Bytes; min: Bytes; used: Bytes };
	namespace webcrypto {
		interface Crypto {
			randomUUID(): BrandedUUID;
		}
	}
}

declare module "node:tls" {
	function getCACertificates(type?: "default" | "system" | "bundled" | "extra"): Pem[];
	interface TLSSocket {
		getCertificate(): BrandedPeerCertificate | object | null;
	}
}

declare module "node:perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & ELDHistogram;
	function eventLoopUtilization(
		utilization1?: EventLoopUtilization,
		utilization2?: EventLoopUtilization,
	): BrandedEventLoopUtilization;
	interface Performance {
		now(): PerformanceTimestamp;
		// A caller-supplied start time keeps the brand only if it already has it.
		mark(
			markName: string,
			markOptions?: PerformanceMarkOptions & { startTime?: PerformanceTimestamp | undefined },
		): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		mark(markName: string, markOptions?: PerformanceMarkOptions): PerformanceMark;
		// A named start mark can carry a caller's start time, so only a measure from the time origin or
		// from a branded start keeps startTime branded.
		measure(
			measureName: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(
			measureName: string,
			startMark?: string,
			endMark?: string,
		): PerformanceMeasure & { readonly duration: Milliseconds };
		measure(
			measureName: string,
			options: PerformanceMeasureOptions & { start: PerformanceTimestamp },
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(
			measureName: string,
			options: PerformanceMeasureOptions,
			endMark?: string,
		): PerformanceMeasure & { readonly duration: Milliseconds };
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: EntryType): BrandedPerformanceEntry[];
		getEntriesByType(type: "resource"): BrandedPerformanceResourceTiming[];
		getEntriesByType(type: EntryType): BrandedPerformanceEntry[];
		eventLoopUtilization(
			utilization1?: EventLoopUtilization,
			utilization2?: EventLoopUtilization,
		): BrandedEventLoopUtilization;
	}
	interface PerformanceObserverEntryList {
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: EntryType): BrandedPerformanceEntry[];
		getEntriesByType(type: "resource"): BrandedPerformanceResourceTiming[];
		getEntriesByType(type: EntryType): BrandedPerformanceEntry[];
	}
	interface PerformanceObserver {
		takeRecords(): BrandedPerformanceEntry[];
	}
}

declare module "node:v8" {
	function cachedDataVersionTag(): Uint32;
	function getHeapStatistics(): SizesInBytes<HeapInfo>;
	function getHeapSpaceStatistics(): SizesInBytes<HeapSpaceInfo>[];
	function getHeapCodeStatistics(): SizesInBytes<HeapCodeStatistics>;
	// Profiles are the JSON of a .cpuprofile or .heapprofile file.
	interface SyncCPUProfileHandle {
		stop(): Json;
	}
	interface SyncHeapProfileHandle {
		stop(): Json;
	}
	interface CPUProfileHandle {
		stop(): Promise<Json>;
	}
	interface HeapProfileHandle {
		stop(): Promise<Json>;
	}
	interface GCProfiler {
		stop(): {
			startTime: EpochMilliseconds;
			endTime: EpochMilliseconds;
			statistics: BrandedGCStatistics<GCProfilerResult["statistics"][number]>[];
		} & GCProfilerResult;
	}
}

declare module "node:worker_threads" {
	interface Worker {
		cpuUsage(prev?: NodeJS.CpuUsage): Promise<NodeJS.CpuUsage & { user: Microseconds; system: Microseconds }>;
		getHeapStatistics(): Promise<SizesInBytes<HeapInfo>>;
	}
}

declare module "node:vm" {
	function measureMemory(
		options?: MeasureMemoryOptions,
	): Promise<{ total: { jsMemoryEstimate: Bytes; jsMemoryRange: [Bytes, Bytes] } } & MemoryMeasurement>;
}

declare module "node:util" {
	// Unpaired surrogates become U+FFFD.
	function toUSVString(string: string): WellFormedString;
	function getCallSites(frameCount?: number, options?: GetCallSitesOptions): BrandedCallSite[];
	function getCallSites(options: GetCallSitesOptions): BrandedCallSite[];
	// Decoders replace invalid sequences with U+FFFD (or throw when fatal), so the result has no lone surrogates.
	interface TextDecoder {
		decode(input?: NodeJS.AllowSharedBufferSource, options?: TextDecodeOptions): WellFormedString;
	}
	interface TextEncoder {
		// `read` counts UTF-16 code units, so it stays a plain number.
		encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult & { written: Bytes };
	}
}

// @types/node 26 declares the global TextDecoder and TextEncoder as extending util's, so they need the
// same overloads: otherwise the DOM lib's declarations of them no longer match their base.
declare global {
	interface TextDecoder {
		decode(input?: NodeJS.AllowSharedBufferSource, options?: TextDecodeOptions): WellFormedString;
	}
	interface TextEncoder {
		encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult & { written: Bytes };
	}
}

declare module "node:zlib" {
	function crc32(data: string | NodeJS.ArrayBufferView, value?: number): Uint32;
}

declare module "node:sqlite" {
	interface DatabaseSync {
		// null for an in-memory or temporary database.
		location(dbName?: string): AbsolutePath | null;
	}
	interface StatementSync {
		run(...anonymousParameters: SQLInputValue[]): BrandedChanges;
		run(namedParameters: Record<string, SQLInputValue>, ...anonymousParameters: SQLInputValue[]): BrandedChanges;
	}
	interface SQLTagStore {
		run(stringElements: TemplateStringsArray, ...boundParameters: SQLInputValue[]): BrandedChanges;
	}
}

declare module "node:tty" {
	interface WriteStream {
		getWindowSize(): [columns: Integer, rows: Integer];
	}
}

declare module "node:readline" {
	interface Interface {
		getCursorPos(): CursorPos & { rows: ZeroBased; cols: ZeroBased };
	}
}

declare module "node:test" {
	namespace test {
		interface MockFunctionContext<F extends Function> {
			callCount(): Integer;
		}
		interface MockPropertyContext<PropertyType = any> {
			accessCount(): Integer;
		}
	}
}

declare module "node:ffi" {
	function dlsym(handle: DynamicLibrary, symbol: string): Pointer;
	function getRawPointer(source: ArrayBuffer | NodeJS.ArrayBufferView): Pointer;
	function getCurrentEventLoop(): Pointer;
	function getInt8(pointer: bigint, offset?: number): SafeInteger;
	function getUint8(pointer: bigint, offset?: number): SafeInteger;
	function getInt16(pointer: bigint, offset?: number): SafeInteger;
	function getUint16(pointer: bigint, offset?: number): SafeInteger;
	function getInt32(pointer: bigint, offset?: number): SafeInteger;
	function getUint32(pointer: bigint, offset?: number): Uint32;
	interface DynamicLibrary {
		getSymbol(name: string): Pointer;
		getSymbols(): Record<string, Pointer>;
		registerCallback(callback: () => void): Pointer;
		registerCallback<const T extends FunctionSignature>(
			signature: T,
			callback: CallbackFunctionFromSignature<T>,
		): Pointer;
	}
}

declare module "node:net" {
	function isIPv4(input: string): input is IPv4;
	function isIPv6(input: string): input is IPv6;
	function getDefaultAutoSelectFamilyAttemptTimeout(): Milliseconds;
	interface Server {
		// A string for a pipe or Unix domain socket.
		address(): BrandedAddressInfo | string | null;
	}
	interface Socket {
		address(): BrandedAddressInfo | {};
	}
	interface BoundSocket {
		address(): BrandedAddressInfo;
	}
}

declare module "node:dgram" {
	interface Socket {
		address(): BrandedAddressInfo;
		remoteAddress(): BrandedAddressInfo;
		bindSync(options?: BindSyncOptions): BrandedAddressInfo;
		getRecvBufferSize(): Bytes;
		getSendBufferSize(): Bytes;
		getSendQueueSize(): Bytes;
		getSendQueueCount(): Integer;
	}
}

declare module "node:http" {
	// Throws unless the name is a valid header token.
	function validateHeaderName(name: string): asserts name is HeaderName;
	interface OutgoingMessage {
		// Names are stored in lowercase, and setHeader() has already validated them.
		getHeaderNames(): LowercaseHeaderName[];
	}
	interface ClientRequest {
		getRawHeaderNames(): HeaderName[];
	}
}

declare module "node:http2" {
	function getDefaultSettings(): BrandedSettings;
	function getUnpackedSettings(buf: Uint8Array): BrandedSettings;
	// Http2ServerResponse#getHeaderNames() stays plain: http2 doesn't check that names are tokens.
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
	function resolve(
		this: never,
		hostname: string,
		rrtype: string,
	): Promise<
		| string[]
		| CaaRecord[]
		| MxRecord[]
		| NaptrRecord[]
		| SoaRecord
		| SrvRecord[]
		| TlsaRecord[]
		| string[][]
		| AnyRecord[]
	>;
	function resolve4(hostname: string): Promise<IPv4[]>;
	function resolve4(
		hostname: string,
		options: ResolveWithTtlOptions,
	): Promise<(RecordWithTtl & { address: IPv4; ttl: Seconds })[]>;
	function resolve4(this: never, hostname: string, options: ResolveOptions): Promise<string[] | RecordWithTtl[]>;
	function resolve6(hostname: string): Promise<IPv6[]>;
	function resolve6(
		hostname: string,
		options: ResolveWithTtlOptions,
	): Promise<(RecordWithTtl & { address: IPv6; ttl: Seconds })[]>;
	function resolve6(this: never, hostname: string, options: ResolveOptions): Promise<string[] | RecordWithTtl[]>;
	function resolveSoa(hostname: string): Promise<BrandedSoaRecord>;
	function resolveSrv(hostname: string): Promise<(SrvRecord & { port: Port })[]>;
}

declare module "node:async_hooks" {
	function executionAsyncId(): AsyncId;
	function triggerAsyncId(): AsyncId;
	interface AsyncResource {
		asyncId(): AsyncId;
		triggerAsyncId(): AsyncId;
	}
}
