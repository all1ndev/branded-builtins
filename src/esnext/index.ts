/// <reference path="../es2025/index.ts" preserve="true" />

// Augmentations for APIs added in TypeScript's "esnext" lib.

import type { Base64, Base64Url, Hex } from "../index.ts";

declare global {
	interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
		// "base64" is the default alphabet.
		toBase64(options?: { alphabet?: "base64" | undefined; omitPadding?: boolean | undefined }): Base64;
		toBase64(options: { alphabet: "base64url"; omitPadding?: boolean | undefined }): Base64Url;
		toHex(): Hex;
	}
}
