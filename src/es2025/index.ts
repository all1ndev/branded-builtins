/// <reference path="../es2024/index.ts" preserve="true" />

// Augmentations for APIs added in TypeScript's "es2025" lib.

import type { RegExpSource } from "../index.ts";

declare global {
	interface RegExpConstructor {
		escape(string: string): RegExpSource;
	}
}
