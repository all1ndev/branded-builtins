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
