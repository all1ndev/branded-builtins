/// <reference types="node" preserve="true" />

// Module overloads for the older @types/node layout, which declares modules under bare names
// ("fs") and re-exports them from "node:fs": 22 and 24. If one of them changes an API, it takes
// its own copy of the overload.

import type {
	AbsolutePath,
	AbsoluteUrl,
	AsyncId,
	Base64,
	Base64Url,
	Bytes,
	Cidr,
	EncodedUriComponent,
	EpochMilliseconds,
	FileDescriptor,
	FormUrlEncoded,
	Gid,
	HeaderName,
	Hex,
	Integer,
	IPv4,
	IPv6,
	LowercaseHeaderName,
	MacAddress,
	Microseconds,
	Milliseconds,
	PerformanceTimestamp,
	Pem,
	Port,
	SafeInteger,
	Seconds,
	Uid,
	Uint32,
	WellFormedString,
	ZeroBased,
} from "../index.ts";
// Inside `declare module "crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type {
	LookupAllOptions,
	LookupOneOptions,
	LookupOptions,
	RecordWithTtl,
	ResolveWithTtlOptions,
	SrvRecord,
} from "node:dns";
import type {
	MakeDirectoryOptions,
	Mode,
	OpenMode,
	PathLike,
	ReadOptions,
	ReadOptionsWithBuffer,
	ReadPosition,
	ReadVResult,
	StatFsOptions,
	StatOptions,
	WriteVResult,
} from "node:fs";
import type { HeapInfo } from "node:v8";
import type {
	BinaryEncoding,
	BrandedAddressInfo,
	BrandedCallSite,
	BrandedChanges,
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
	OneBasedPosition,
	PathEncodingOption,
	SizesInBytes,
	TextEncoding,
	ZeroBasedSourceMapping,
} from "../node/types.ts";

// Augmentations are merged with higher priority, so these overloads win over the originals.
// Only the module that holds the declarations can be augmented: augmenting a module that
// re-exports it would shadow the original overloads instead of adding to them.

// @types/node 22 types "path" as a `PlatformPath` object, so overloads go on that interface.
// Members of a module that uses `export =` are augmented at the module top level.
declare module "path" {
	interface PlatformPath {
		resolve(...paths: string[]): AbsolutePath;
		join(path: AbsolutePath, ...paths: string[]): AbsolutePath;
		normalize(path: AbsolutePath): AbsolutePath;
		dirname(path: AbsolutePath): AbsolutePath;
		toNamespacedPath(path: AbsolutePath): AbsolutePath;
		parse(path: AbsolutePath): ParsedPath & { root: AbsolutePath; dir: AbsolutePath };
		isAbsolute(path: string): path is AbsolutePath;
	}
}

declare module "url" {
	function fileURLToPath(url: string | URL, options?: FileUrlToPathOptions): AbsolutePath;
	// Options can make the result differ from `href`, so only the plain call is branded.
	function format(urlObject: URL): AbsoluteUrl;
	interface URL {
		toString(): AbsoluteUrl;
		toJSON(): AbsoluteUrl;
	}
	interface URLSearchParams {
		toString(): FormUrlEncoded;
	}
}

declare module "module" {
	function findPackageJSON(specifier: string | URL, base?: string | URL): AbsolutePath | undefined;
	function getCompileCacheDir(): AbsolutePath | undefined;
	// A relative cache directory is resolved against the working directory.
	function enableCompileCache(cacheDir?: string): EnableCompileCacheResult & { directory?: AbsolutePath };
	interface SourceMap {
		findEntry(lineOffset: number, columnOffset: number): ZeroBasedSourceMapping<SourceMapping> | {};
		findOrigin(lineNumber: number, columnNumber: number): OneBasedPosition<SourceOrigin> | {};
	}
}

// Output with an encoding is decoded from one buffer per stream, like Buffer#toString().
declare module "child_process" {
	function execSync<E extends TextEncoding | BinaryEncoding>(
		command: string,
		options: ExecSyncOptions & { encoding: E },
	): Encoded<E>;
	function execFileSync<E extends TextEncoding | BinaryEncoding>(
		file: string,
		options: ExecFileSyncOptions & { encoding: E },
	): Encoded<E>;
	function execFileSync<E extends TextEncoding | BinaryEncoding>(
		file: string,
		args: readonly string[],
		options: ExecFileSyncOptions & { encoding: E },
	): Encoded<E>;
	function spawnSync<E extends TextEncoding | BinaryEncoding>(
		command: string,
		options: SpawnSyncOptions & { encoding: E },
	): SpawnSyncReturns<Encoded<E>>;
	function spawnSync<E extends TextEncoding | BinaryEncoding>(
		command: string,
		args: readonly string[],
		options: SpawnSyncOptions & { encoding: E },
	): SpawnSyncReturns<Encoded<E>>;
}

declare module "stream" {
	// Object mode counts objects; otherwise the mark is in bytes.
	function getDefaultHighWaterMark(objectMode: false): Bytes;
	function getDefaultHighWaterMark(objectMode: true): Integer;
}

declare module "querystring" {
	// Escapes the same characters as encodeURIComponent().
	function escape(str: string): EncodedUriComponent;
}

declare module "fs" {
	function realpathSync(path: PathLike, options?: PathEncodingOption): AbsolutePath;
	namespace realpathSync {
		function native(path: PathLike, options?: PathEncodingOption): AbsolutePath;
	}
	// A relative prefix or path gives a relative result, so only absolute input keeps the brand.
	function mkdtempSync(prefix: AbsolutePath, options?: PathEncodingOption): AbsolutePath;
	function mkdirSync(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): AbsolutePath | undefined;
	function openSync(path: PathLike, flags?: OpenMode, mode?: Mode | null): FileDescriptor;
	function openAsBlob(path: PathLike, options?: OpenAsBlobOptions): Promise<Blob & { readonly size: Bytes }>;
	function readFileSync<E extends TextEncoding | BinaryEncoding>(
		path: PathOrFileDescriptor,
		options: E | { encoding: E; flag?: string | undefined },
	): Encoded<E>;

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

	// statSync and lstatSync are both typed as StatSyncFn.
	interface StatSyncFn {
		(path: PathLike, options?: undefined): BrandedStats;
		(
			path: PathLike,
			options?: StatSyncOptions & { bigint?: false | undefined; throwIfNoEntry: false },
		): BrandedStats | undefined;
		(path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined }): BrandedStats;
	}
	function fstatSync(fd: number, options?: StatOptions & { bigint?: false | undefined }): BrandedStats;
	function statfsSync(path: PathLike, options?: StatFsOptions & { bigint?: false | undefined }): BrandedStatsFs;
}

declare module "fs/promises" {
	function realpath(path: PathLike, options?: PathEncodingOption): Promise<AbsolutePath>;
	function mkdtemp(prefix: AbsolutePath, options?: PathEncodingOption): Promise<AbsolutePath>;
	function mkdir(
		path: AbsolutePath,
		options: MakeDirectoryOptions & { recursive: true },
	): Promise<AbsolutePath | undefined>;
	function open(
		path: PathLike,
		flags?: string | number,
		mode?: Mode,
	): Promise<FileHandle & { readonly fd: FileDescriptor }>;
	function readFile<E extends TextEncoding | BinaryEncoding>(
		path: PathLike | FileHandle,
		options: E | { encoding: E; flag?: OpenMode | undefined; signal?: AbortSignal | undefined },
	): Promise<Encoded<E>>;

	function stat(path: PathLike, opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;
	function lstat(path: PathLike, opts?: StatOptions & { bigint?: false | undefined }): Promise<BrandedStats>;
	function statfs(path: PathLike, opts?: StatFsOptions & { bigint?: false | undefined }): Promise<BrandedStatsFs>;

	interface FileHandle {
		stat(
			opts?: StatOptions & { bigint?: false | undefined; throwIfNoEntry?: true | undefined },
		): Promise<BrandedStats>;
		stat(
			opts?: StatOptions & { bigint?: false | undefined; throwIfNoEntry: false },
		): Promise<BrandedStats | undefined>;
		readFile<E extends TextEncoding | BinaryEncoding>(
			options: E | { encoding: E; signal?: AbortSignal | undefined },
		): Promise<Encoded<E>>;
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

declare module "buffer" {
	function resolveObjectURL(id: string): (Blob & { readonly size: Bytes }) | undefined;
	// Blobs decode as UTF-8 with replacement, so the text has no lone surrogates.
	interface Blob {
		text(): Promise<WellFormedString>;
	}
}

declare module "os" {
	function homedir(): AbsolutePath;
	function tmpdir(): AbsolutePath;
	function uptime(): Seconds;
	function totalmem(): Bytes;
	function freemem(): Bytes;
	function availableParallelism(): SafeInteger;
	function cpus(): (CpuInfo & {
		times: { user: Milliseconds; nice: Milliseconds; sys: Milliseconds; idle: Milliseconds; irq: Milliseconds };
	})[];
	function userInfo(
		options?: UserInfoOptionsWithStringEncoding,
	): UserInfo<string> & { uid: Uid; gid: Gid; homedir: AbsolutePath };
	function networkInterfaces(): NodeJS.Dict<
		(
			| (NetworkInterfaceInfoIPv4 & { address: IPv4; netmask: IPv4; mac: MacAddress; cidr: Cidr | null })
			| (NetworkInterfaceInfoIPv6 & { address: IPv6; netmask: IPv6; mac: MacAddress; cidr: Cidr | null })
		)[]
	>;
}

declare module "crypto" {
	interface Hash {
		digest(encoding: "hex"): Hex;
		digest(encoding: "base64"): Base64;
		digest(encoding: "base64url"): Base64Url;
	}
	interface Hmac {
		digest(encoding: "hex"): Hex;
		digest(encoding: "base64"): Base64;
		digest(encoding: "base64url"): Base64Url;
	}
	interface Sign {
		sign<E extends BinaryEncoding>(
			privateKey: KeyLike | SignKeyObjectInput | SignPrivateKeyInput | SignJsonWebKeyInput,
			outputFormat: E,
		): Encoded<E>;
	}
	interface DiffieHellman {
		generateKeys<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		computeSecret<E extends BinaryEncoding>(
			otherPublicKey: NodeJS.ArrayBufferView,
			inputEncoding: null,
			outputEncoding: E,
		): Encoded<E>;
		computeSecret<E extends BinaryEncoding>(
			otherPublicKey: string,
			inputEncoding: BinaryToTextEncoding,
			outputEncoding: E,
		): Encoded<E>;
		getPrime<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getGenerator<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPublicKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPrivateKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
	}
	interface ECDH {
		generateKeys<E extends BinaryEncoding>(encoding: E, format?: ECDHKeyFormat): Encoded<E>;
		computeSecret<E extends BinaryEncoding>(otherPublicKey: NodeJS.ArrayBufferView, outputEncoding: E): Encoded<E>;
		computeSecret<E extends BinaryEncoding>(
			otherPublicKey: string,
			inputEncoding: BinaryToTextEncoding,
			outputEncoding: E,
		): Encoded<E>;
		getPrivateKey<E extends BinaryEncoding>(encoding: E): Encoded<E>;
		getPublicKey<E extends BinaryEncoding>(encoding: E, format?: ECDHKeyFormat): Encoded<E>;
	}
	interface KeyObject {
		export(options: KeyExportOptions<"pem">): Pem;
		export(options: JwkKeyExportOptions): BrandedJsonWebKey<JsonWebKey>;
	}
	interface X509Certificate {
		checkIP(ip: string): IPv4 | IPv6 | undefined;
		// toJSON() returns the PEM certificate too, not JSON.
		toJSON(): Pem;
		toString(): Pem;
		toLegacyObject(): BrandedPeerCertificate;
	}
	// "hex" is the default output encoding.
	function hash(algorithm: string, data: BinaryLike, options?: "hex"): Hex;
	function hash(algorithm: string, data: BinaryLike, options: "base64"): Base64;
	function hash(algorithm: string, data: BinaryLike, options: "base64url"): Base64Url;
	function randomUUID(options?: RandomUUIDOptions): BrandedUUID;
	// Node requires max - min < 2 ** 48, so the result is always safe.
	function randomInt(max: number): SafeInteger;
	function randomInt(min: number, max: number): SafeInteger;
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

declare module "tls" {
	function getCACertificates(type?: "default" | "system" | "bundled" | "extra"): Pem[];
	interface TLSSocket {
		getCertificate(): BrandedPeerCertificate | object | null;
	}
}

declare module "perf_hooks" {
	interface Performance {
		now(): PerformanceTimestamp;
		// A caller-supplied start time keeps the brand only if it already has it.
		mark(
			name: string,
			options?: MarkOptions & { startTime?: PerformanceTimestamp | undefined },
		): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		measure(
			name: string,
			startMark?: string,
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(
			name: string,
			options: MeasureOptions & {
				start?: string | PerformanceTimestamp | undefined;
				end?: string | PerformanceTimestamp | undefined;
			},
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(name: string, options: MeasureOptions): PerformanceMeasure & { readonly duration: Milliseconds };
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: EntryType): BrandedPerformanceEntry[];
		getEntriesByType(type: "resource"): BrandedPerformanceResourceTiming[];
		getEntriesByType(type: EntryType): BrandedPerformanceEntry[];
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

declare module "v8" {
	function cachedDataVersionTag(): Uint32;
	function getHeapStatistics(): SizesInBytes<HeapInfo>;
	function getHeapSpaceStatistics(): SizesInBytes<HeapSpaceInfo>[];
	function getHeapCodeStatistics(): SizesInBytes<HeapCodeStatistics>;
	interface GCProfiler {
		stop(): GCProfilerResult & {
			startTime: EpochMilliseconds;
			endTime: EpochMilliseconds;
			statistics: BrandedGCStatistics<GCProfilerResult["statistics"][number]>[];
		};
	}
}

declare module "worker_threads" {
	interface Worker {
		cpuUsage(prev?: NodeJS.CpuUsage): Promise<NodeJS.CpuUsage & { user: Microseconds; system: Microseconds }>;
		getHeapStatistics(): Promise<SizesInBytes<HeapInfo>>;
	}
}

declare module "vm" {
	function measureMemory(
		options?: MeasureMemoryOptions,
	): Promise<MemoryMeasurement & { total: { jsMemoryEstimate: Bytes; jsMemoryRange: [Bytes, Bytes] } }>;
}

declare module "util" {
	// Unpaired surrogates become U+FFFD.
	function toUSVString(string: string): WellFormedString;
	// "util" doesn't export GetCallSitesOptions.
	function getCallSites(frameCount?: number, options?: { sourceMap?: boolean | undefined }): BrandedCallSite[];
	function getCallSites(options: { sourceMap?: boolean | undefined }): BrandedCallSite[];
	// Decoders replace invalid sequences with U+FFFD (or throw when fatal), so the result has no lone surrogates.
	interface TextDecoder {
		decode(
			input?: NodeJS.ArrayBufferView | ArrayBuffer | null,
			options?: { stream?: boolean | undefined },
		): WellFormedString;
	}
	interface TextEncoder {
		// `read` counts UTF-16 code units, so it stays a plain number.
		encodeInto(src: string, dest: Uint8Array): EncodeIntoResult & { written: Bytes };
	}
}

declare module "zlib" {
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
}

declare module "tty" {
	interface WriteStream {
		getWindowSize(): [columns: Integer, rows: Integer];
	}
}

declare module "readline" {
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

declare module "net" {
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
}

declare module "dgram" {
	interface Socket {
		address(): BrandedAddressInfo;
		remoteAddress(): BrandedAddressInfo;
		getRecvBufferSize(): Bytes;
		getSendBufferSize(): Bytes;
		getSendQueueSize(): Bytes;
		getSendQueueCount(): Integer;
	}
}

declare module "http" {
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

declare module "http2" {
	function getDefaultSettings(): BrandedSettings;
	function getUnpackedSettings(buf: Uint8Array): BrandedSettings;
	interface Http2ServerResponse {
		getHeaderNames(): LowercaseHeaderName[];
	}
}

declare module "dns/promises" {
	function lookup(hostname: string, family: number): Promise<BrandedLookupAddress>;
	function lookup(hostname: string, options: LookupOneOptions): Promise<BrandedLookupAddress>;
	function lookup(hostname: string, options: LookupAllOptions): Promise<BrandedLookupAddress[]>;
	function lookup(hostname: string, options: LookupOptions): Promise<BrandedLookupAddress | BrandedLookupAddress[]>;
	function lookup(hostname: string): Promise<BrandedLookupAddress>;
	function resolve(hostname: string): Promise<IPv4[]>;
	function resolve(hostname: string, rrtype: "A"): Promise<IPv4[]>;
	function resolve(hostname: string, rrtype: "AAAA"): Promise<IPv6[]>;
	function resolve4(hostname: string): Promise<IPv4[]>;
	function resolve4(
		hostname: string,
		options: ResolveWithTtlOptions,
	): Promise<(RecordWithTtl & { address: IPv4; ttl: Seconds })[]>;
	function resolve6(hostname: string): Promise<IPv6[]>;
	function resolve6(
		hostname: string,
		options: ResolveWithTtlOptions,
	): Promise<(RecordWithTtl & { address: IPv6; ttl: Seconds })[]>;
	function resolveSoa(hostname: string): Promise<BrandedSoaRecord>;
	function resolveSrv(hostname: string): Promise<(SrvRecord & { port: Port })[]>;
}

declare module "async_hooks" {
	function executionAsyncId(): AsyncId;
	function triggerAsyncId(): AsyncId;
	interface AsyncResource {
		asyncId(): AsyncId;
		triggerAsyncId(): AsyncId;
	}
}
