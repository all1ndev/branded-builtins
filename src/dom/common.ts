// "dom" lib augmentations that also work under @types/node, which declares these globals too.

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
