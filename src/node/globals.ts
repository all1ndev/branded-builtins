/// <reference types="node" preserve="true" />
/// <reference path="../shared/web.ts" preserve="true" />

// Global augmentations for every node entry: these globals are the same in each @types/node.
// If a version drops one, move its overload out of here into the older entries.

import type { AbsolutePath, Base64, Base64Url, BigIntNanoseconds, Bytes, Hex, Kilobytes, Microseconds, Seconds } from "../index.ts";

declare global {
	interface Buffer {
		toString(encoding: "hex", start?: number, end?: number): Hex;
		toString(encoding: "base64", start?: number, end?: number): Base64;
		toString(encoding: "base64url", start?: number, end?: number): Base64Url;
	}
	interface BufferConstructor {
		byteLength(string: string | NodeJS.ArrayBufferView | ArrayBufferLike, encoding?: BufferEncoding): Bytes;
	}

	// Also in shared/web.ts, but that file loads before @types/node declares btoa, and the
	// overload from the later file wins.
	function btoa(data: string): Base64;

	namespace NodeJS {
		interface Process {
			cwd(): AbsolutePath;
			uptime(): Seconds;
			availableMemory(): Bytes;
			constrainedMemory(): Bytes;
			cpuUsage(previousValue?: CpuUsage): CpuUsage & { user: Microseconds; system: Microseconds };
			resourceUsage(): ResourceUsage & { userCPUTime: Microseconds; systemCPUTime: Microseconds; maxRSS: Kilobytes };
		}
		interface HRTime {
			(time?: [number, number]): [Seconds, number];
			bigint(): BigIntNanoseconds;
		}
		interface MemoryUsageFn {
			(): { [K in keyof MemoryUsage]: Bytes };
			rss(): Bytes;
		}
		interface RequireResolve {
			// null for built-in modules.
			paths(request: string): AbsolutePath[] | null;
		}
	}
}
