// Web API augmentations shared by the dom and node entries: both the DOM lib and @types/node
// declare these globals. Anything DOM-only belongs in dom/index.ts.

import type { AbsoluteUrl, Base64, PerformanceTimestamp, UUID } from "../index.ts";

declare global {
	interface Crypto {
		randomUUID(): UUID;
	}
	interface Performance {
		now(): PerformanceTimestamp;
	}
	interface URL {
		toString(): AbsoluteUrl;
		toJSON(): AbsoluteUrl;
	}

	function btoa(data: string): Base64;
}
