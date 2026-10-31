/// <reference types="node" preserve="true" />
/// <reference path="../shared/web.ts" preserve="true" />

// Global augmentations for every node entry: these globals are the same in each @types/node.
// If a version drops one, move its overload out of here into the older entries.

import type {
	AbsolutePath,
	AbsoluteUrl,
	AsyncId,
	Base64,
	Base64Url,
	BigIntNanoseconds,
	Bytes,
	Hex,
	Kilobytes,
	FileMode,
	Microseconds,
	Nanoseconds,
	SafeInteger,
	Seconds,
	WellFormedString,
} from "../index.ts";
import type { TextEncoding } from "./types.ts";

declare global {
	interface Buffer {
		toString(encoding: "hex", start?: number, end?: number): Hex;
		toString(encoding: "base64", start?: number, end?: number): Base64;
		toString(encoding: "base64url", start?: number, end?: number): Base64Url;
		// UTF-8 decoding replaces invalid input with U+FFFD; "utf16le" can give lone surrogates.
		toString(encoding?: TextEncoding, start?: number, end?: number): WellFormedString;
		// At most 6 bytes, so below 2 ** 48.
		readUIntLE(offset: number, byteLength: number): SafeInteger;
		readUintLE(offset: number, byteLength: number): SafeInteger;
		readUIntBE(offset: number, byteLength: number): SafeInteger;
		readUintBE(offset: number, byteLength: number): SafeInteger;
		readIntLE(offset: number, byteLength: number): SafeInteger;
		readIntBE(offset: number, byteLength: number): SafeInteger;
		readUInt8(offset?: number): SafeInteger;
		readUint8(offset?: number): SafeInteger;
		readUInt16LE(offset?: number): SafeInteger;
		readUint16LE(offset?: number): SafeInteger;
		readUInt16BE(offset?: number): SafeInteger;
		readUint16BE(offset?: number): SafeInteger;
		readUInt32LE(offset?: number): SafeInteger;
		readUint32LE(offset?: number): SafeInteger;
		readUInt32BE(offset?: number): SafeInteger;
		readUint32BE(offset?: number): SafeInteger;
		readInt8(offset?: number): SafeInteger;
		readInt16LE(offset?: number): SafeInteger;
		readInt16BE(offset?: number): SafeInteger;
		readInt32LE(offset?: number): SafeInteger;
		readInt32BE(offset?: number): SafeInteger;
		write(string: string, encoding?: BufferEncoding): Bytes;
		write(string: string, offset: number, encoding?: BufferEncoding): Bytes;
		write(string: string, offset: number, length: number, encoding?: BufferEncoding): Bytes;
		copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): Bytes;
	}
	interface BufferConstructor {
		byteLength(string: string | NodeJS.ArrayBufferView | ArrayBufferLike, encoding?: BufferEncoding): Bytes;
	}

	// Also in shared/web.ts, but that file loads before @types/node declares btoa and atob, and the
	// overload from the later file wins.
	function btoa(data: string): Base64;
	function atob(data: string): WellFormedString;

	interface ImportMeta {
		resolve(specifier: string, parent?: string | URL): AbsoluteUrl;
	}

	// fetch bodies decode as UTF-8 with replacement. undici declares `text` as a property, so branding
	// the global Response would reject undici's own instances: only fetch()'s result is branded, with
	// the brand listed first in the intersection so its `text` wins. The original is restated last,
	// as for Math.floor in es2024.
	function fetch(
		input: string | URL | Request,
		init?: RequestInit,
	): Promise<{ text(): Promise<WellFormedString> } & Response>;
	function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;

	namespace NodeJS {
		interface Process {
			cwd(): AbsolutePath;
			uptime(): Seconds;
			availableMemory(): Bytes;
			constrainedMemory(): Bytes;
			cpuUsage(previousValue?: CpuUsage): CpuUsage & { user: Microseconds; system: Microseconds };
			threadCpuUsage(previousValue?: CpuUsage): CpuUsage & { user: Microseconds; system: Microseconds };
			umask(): FileMode;
			// Returns the previous mask.
			umask(mask: string | number): FileMode;
			resourceUsage(): ResourceUsage & {
				userCPUTime: Microseconds;
				systemCPUTime: Microseconds;
				maxRSS: Kilobytes;
			};
		}
		interface HRTime {
			(time?: [number, number]): [Seconds, Nanoseconds];
			bigint(): BigIntNanoseconds;
		}
		interface MemoryUsageFn {
			(): { [K in keyof MemoryUsage]: Bytes };
			rss(): Bytes;
		}
		interface Timeout {
			// The timer's async id, which clearTimeout() also accepts.
			[Symbol.toPrimitive](): AsyncId;
		}
		interface RequireResolve {
			// null for built-in modules.
			paths(request: string): AbsolutePath[] | null;
		}
	}
}
