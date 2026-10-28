// The dom entry on its own: the DOM lib, no @types/node.
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;

crypto.randomUUID() satisfies B.UUID;
performance.now() satisfies B.PerformanceTimestamp;
performance.mark("a").startTime satisfies B.PerformanceTimestamp;
performance.measure("a", "b").duration satisfies B.Milliseconds;
performance.measure("a", { start: 0 }).startTime satisfies B.PerformanceTimestamp;
btoa(raw) satisfies B.Base64;
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
// @ts-expect-error
CSS.escape(raw) satisfies B.RegExpSource;
