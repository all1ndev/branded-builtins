// The dom entry on its own: the DOM lib, no @types/node.
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;

crypto.randomUUID() satisfies B.UUID;
performance.now() satisfies B.PerformanceTimestamp;
performance.mark("a").startTime satisfies B.PerformanceTimestamp;
performance.measure("a", "b").duration satisfies B.Milliseconds;
performance.measure("a", { start: "b" }).startTime satisfies B.PerformanceTimestamp;
performance.measure("a", { start: performance.now() }).startTime satisfies B.PerformanceTimestamp;
performance.measure("a", { start: 0 }).duration satisfies B.Milliseconds;
// @ts-expect-error a plain start time is the caller's number
performance.measure("a", { start: 0 }).startTime satisfies B.PerformanceTimestamp;
performance.mark("a", { startTime: performance.now() }).startTime satisfies B.PerformanceTimestamp;
// @ts-expect-error
performance.mark("a", { startTime: 0 }).startTime satisfies B.PerformanceTimestamp;
new URLSearchParams({ a: raw }).toString() satisfies B.FormUrlEncoded;
// @ts-expect-error
new URLSearchParams({ a: raw }).toString() satisfies B.EncodedUriComponent;
btoa(raw) satisfies B.Base64;
atob(raw) satisfies B.WellFormedString;
new URL(raw).toString() satisfies B.AbsoluteUrl;
new URL(raw).toJSON() satisfies B.AbsoluteUrl;
Date.now() satisfies B.EpochMilliseconds;
JSON.stringify({}) satisfies B.Json;
// @ts-expect-error
performance.now() satisfies B.EpochMilliseconds;

declare const bytes: Uint8Array;
declare const blob: Blob;
performance.getEntries()[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
performance.getEntriesByName(raw)[0]?.duration satisfies B.Milliseconds | undefined;
performance.getEntriesByType("mark")[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
declare const entryList: PerformanceObserverEntryList;
entryList.getEntries()[0]?.duration satisfies B.Milliseconds | undefined;
declare const observer: PerformanceObserver;
observer.takeRecords()[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
declare const deadline: IdleDeadline;
deadline.timeRemaining() satisfies B.Milliseconds;
declare const video: HTMLVideoElement;
video.buffered.start(0) satisfies B.Seconds;
video.buffered.end(0) satisfies B.Seconds;
// @ts-expect-error
video.buffered.end(0) satisfies B.Milliseconds;
declare const svg: SVGSVGElement;
declare const animation: SVGAnimationElement;
svg.getCurrentTime() satisfies B.Seconds;
animation.getCurrentTime() satisfies B.Seconds;
animation.getStartTime() satisfies B.Seconds;
animation.getSimpleDuration() satisfies B.Seconds;
declare const frame: VideoFrame;
declare const audio: AudioData;
frame.allocationSize() satisfies B.Bytes;
audio.allocationSize({ planeIndex: 0 }) satisfies B.Bytes;
const estimate = await navigator.storage.estimate();
estimate.usage satisfies B.Bytes | undefined;
estimate.quota satisfies B.Bytes | undefined;
const encoded = new TextEncoder().encodeInto(raw, bytes);
encoded.written satisfies B.Bytes;
// @ts-expect-error read counts UTF-16 code units
encoded.read satisfies B.Bytes;
new TextDecoder().decode(bytes) satisfies B.WellFormedString;
new TextDecoder().decode() satisfies B.WellFormedString;
(await blob.text()) satisfies B.WellFormedString;
(await new Response(blob).text()) satisfies B.WellFormedString;
(await new Request(raw).text()) satisfies B.WellFormedString;
location.toString() satisfies B.AbsoluteUrl;
import.meta.resolve(raw) satisfies B.AbsoluteUrl;
// @ts-expect-error
location.href satisfies B.AbsoluteUrl;
CSS.escape(raw) satisfies B.CssIdentifier;

declare const canvas: HTMLCanvasElement;
canvas.toDataURL() satisfies B.DataUrl;
canvas.toDataURL("image/webp", 0.8) satisfies B.AbsoluteUrl;
// @ts-expect-error
new URL(raw).toString() satisfies B.DataUrl;
performance.getEntriesByType("resource")[0]?.transferSize satisfies B.Bytes | undefined;
entryList.getEntriesByType("resource")[0]?.decodedBodySize satisfies B.Bytes | undefined;
performance.getEntriesByType("resource")[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
// @ts-expect-error a status code
performance.getEntriesByType("resource")[0]?.responseStatus satisfies B.Bytes | undefined;
declare const audioContext: AudioContext;
audioContext.getOutputTimestamp().contextTime satisfies B.Seconds | undefined;
audioContext.getOutputTimestamp().performanceTime satisfies B.PerformanceTimestamp | undefined;
window.setTimeout(() => {}, 1) satisfies B.TimerId;
self.setInterval(() => {}, 1) satisfies B.TimerId;
requestAnimationFrame(() => {}) satisfies B.AnimationFrameId;
window.requestAnimationFrame(() => {}) satisfies B.AnimationFrameId;
requestIdleCallback(() => {}) satisfies B.IdleCallbackId;
window.requestIdleCallback(() => {}) satisfies B.IdleCallbackId;
// @ts-expect-error
requestAnimationFrame(() => {}) satisfies B.TimerId;
declare const headers: Headers;
for (const [name] of headers) name satisfies B.LowercaseHeaderName;
[...headers.keys()] satisfies B.HeaderName[];
[...headers.entries()][0]?.[0] satisfies B.LowercaseHeaderName | undefined;
// @ts-expect-error
[...headers.values()] satisfies B.HeaderName[];
// @ts-expect-error
CSS.escape(raw) satisfies B.RegExpSource;
