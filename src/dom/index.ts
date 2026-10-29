/// <reference path="../shared/web.ts" preserve="true" />

// Augmentations for APIs in TypeScript's "dom" lib.

import type {
	AbsoluteUrl,
	AnimationFrameId,
	Bytes,
	CssIdentifier,
	DataUrl,
	IdleCallbackId,
	LowercaseHeaderName,
	Milliseconds,
	PerformanceTimestamp,
	Seconds,
	TimerId,
	WellFormedString,
} from "../index.ts";

type BrandedPerformanceEntry = PerformanceEntry & {
	readonly startTime: PerformanceTimestamp;
	readonly duration: Milliseconds;
};
type BrandedPerformanceResourceTiming = PerformanceResourceTiming &
	BrandedPerformanceEntry & {
		readonly transferSize: Bytes;
		readonly encodedBodySize: Bytes;
		readonly decodedBodySize: Bytes;
	};

declare global {
	interface Performance {
		// A caller-supplied start time keeps the brand only if it already has it.
		mark(
			markName: string,
			markOptions?: PerformanceMarkOptions & { startTime?: PerformanceTimestamp | undefined },
		): PerformanceMark & { readonly startTime: PerformanceTimestamp };
		measure(
			measureName: string,
			startOrMeasureOptions?:
				| string
				| (PerformanceMeasureOptions & {
						start?: string | PerformanceTimestamp | undefined;
						end?: string | PerformanceTimestamp | undefined;
				  }),
			endMark?: string,
		): PerformanceMeasure & { readonly startTime: PerformanceTimestamp; readonly duration: Milliseconds };
		measure(
			measureName: string,
			startOrMeasureOptions?: string | PerformanceMeasureOptions,
			endMark?: string,
		): PerformanceMeasure & { readonly duration: Milliseconds };
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: string): BrandedPerformanceEntry[];
		getEntriesByType(type: "resource"): BrandedPerformanceResourceTiming[];
		getEntriesByType(type: string): BrandedPerformanceEntry[];
	}
	interface PerformanceObserverEntryList {
		getEntries(): BrandedPerformanceEntry[];
		getEntriesByName(name: string, type?: string): BrandedPerformanceEntry[];
		getEntriesByType(type: "resource"): BrandedPerformanceResourceTiming[];
		getEntriesByType(type: string): BrandedPerformanceEntry[];
	}
	interface PerformanceObserver {
		takeRecords(): BrandedPerformanceEntry[];
	}
	interface IdleDeadline {
		timeRemaining(): Milliseconds;
	}

	// Only the Window and worker methods: in a project that also loads @types/node, the global
	// setTimeout() may be Node's, which returns a Timeout object.
	interface WindowOrWorkerGlobalScope {
		setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): TimerId;
		setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): TimerId;
	}
	interface AnimationFrameProvider {
		requestAnimationFrame(callback: FrameRequestCallback): AnimationFrameId;
	}
	interface Window {
		requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): IdleCallbackId;
	}
	function requestAnimationFrame(callback: FrameRequestCallback): AnimationFrameId;
	function requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): IdleCallbackId;

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
	interface AudioContext {
		getOutputTimestamp(): AudioTimestamp & { contextTime?: Seconds; performanceTime?: PerformanceTimestamp };
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
	interface HTMLCanvasElement {
		// "data:," for a canvas with no pixels, which is still a data URL.
		toDataURL(type?: string, quality?: number): DataUrl;
	}

	// TypeScript 5 declares HeadersIterator and these methods only in the dom.iterable lib, but
	// every browser has them. Iteration lowercases the names.
	interface HeadersIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
		[Symbol.iterator](): HeadersIterator<T>;
	}
	interface Headers {
		[Symbol.iterator](): HeadersIterator<[LowercaseHeaderName, string]>;
		entries(): HeadersIterator<[LowercaseHeaderName, string]>;
		keys(): HeadersIterator<LowercaseHeaderName>;
	}
	interface ImportMeta {
		resolve(specifier: string): AbsoluteUrl;
	}

	namespace CSS {
		function escape(ident: string): CssIdentifier;
	}
}
