/// <reference path="./common.ts" preserve="true" />

// Augmentations for APIs in TypeScript's "dom" lib.

import type { Milliseconds, PerformanceTimestamp } from "../index.ts";

declare global {
	interface Performance {
		mark(markName: string, markOptions?: PerformanceMarkOptions): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		measure(
			measureName: string,
			startOrMeasureOptions?: string | PerformanceMeasureOptions,
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
	}
}
