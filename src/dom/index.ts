/// <reference path="../shared/web.ts" preserve="true" />

// Augmentations for APIs in TypeScript's "dom" lib.

import type {
	AbsoluteUrl,
	Bytes,
	CssIdentifier,
	Milliseconds,
	PerformanceTimestamp,
	Seconds,
	WellFormedString,
} from "../index.ts";

type BrandedPerformanceEntry = PerformanceEntry & {
	readonly startTime: PerformanceTimestamp;
	readonly duration: Milliseconds;
};

declare global {
	interface Performance {
		mark(
			markName: string,
			markOptions?: PerformanceMarkOptions,
		): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		measure(
			measureName: string,
			startOrMeasureOptions?: string | PerformanceMeasureOptions,
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: string): BrandedPerformanceEntry[];
		getEntriesByType(type: string): BrandedPerformanceEntry[];
	}
	interface PerformanceObserverEntryList {
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: string): BrandedPerformanceEntry[];
		getEntriesByType(type: string): BrandedPerformanceEntry[];
	}
	interface IdleDeadline {
		timeRemaining(): Milliseconds;
	}

	// Media and SVG animation timelines count in seconds.
	interface TimeRanges {
		start(index: number): Seconds;
		end(index: number): Seconds;
	}
	interface SVGAnimationElement {
		getCurrentTime(): Seconds;
		getStartTime(): Seconds;
		getSimpleDuration(): Seconds;
	}
	interface SVGSVGElement {
		getCurrentTime(): Seconds;
	}

	interface AudioData {
		allocationSize(options: AudioDataCopyToOptions): Bytes;
	}
	interface VideoFrame {
		allocationSize(options?: VideoFrameCopyToOptions): Bytes;
	}
	interface StorageManager {
		estimate(): Promise<StorageEstimate & { quota?: Bytes; usage?: Bytes }>;
	}
	interface TextEncoder {
		// `read` counts UTF-16 code units, so it stays a plain number.
		encodeInto(
			source: string,
			destination: Uint8Array<ArrayBufferLike>,
		): TextEncoderEncodeIntoResult & { written: Bytes };
	}

	// Decoders replace invalid sequences with U+FFFD (or throw when fatal), so the result has no lone surrogates.
	interface TextDecoder {
		decode(input?: AllowSharedBufferSource, options?: TextDecodeOptions): WellFormedString;
	}
	interface Blob {
		text(): Promise<WellFormedString>;
	}
	interface Body {
		text(): Promise<WellFormedString>;
	}

	interface Location {
		toString(): AbsoluteUrl;
	}
	interface ImportMeta {
		resolve(specifier: string): AbsoluteUrl;
	}

	namespace CSS {
		function escape(ident: string): CssIdentifier;
	}
}
