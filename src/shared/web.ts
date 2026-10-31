// Web API augmentations shared by the dom and node entries: both the DOM lib and @types/node
// declare these globals. Anything DOM-only belongs in dom/index.ts.

import type { AbsoluteUrl, Base64, FormUrlEncoded, WellFormedString } from "../index.ts";

declare global {
	interface URL {
		toString(): AbsoluteUrl;
		toJSON(): AbsoluteUrl;
	}
	interface URLSearchParams {
		toString(): FormUrlEncoded;
	}

	function btoa(data: string): Base64;
	// Every code unit is at most 0xFF, so there are no lone surrogates.
	function atob(data: string): WellFormedString;
}
