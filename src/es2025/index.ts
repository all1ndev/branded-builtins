/// <reference path="../es2024/index.ts" preserve="true" />

// Augmentations for APIs added in TypeScript's "es2025" lib.

import type { LanguageTag, RegExpSource } from "../index.ts";

declare global {
	interface RegExpConstructor {
		escape(string: string): RegExpSource;
	}

	namespace Intl {
		interface DurationFormat {
			resolvedOptions(): ResolvedDurationFormatOptions & { locale: LanguageTag };
		}
	}
}
