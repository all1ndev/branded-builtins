import type * as B from "@all1ndev/branded-builtins";

crypto.randomUUID() satisfies B.UUID;
performance.now() satisfies B.PerformanceTimestamp;
performance.mark("a").startTime satisfies B.PerformanceTimestamp;
performance.measure("a", "b").duration satisfies B.Milliseconds;
// Node's global setTimeout still returns a Timeout object.
setTimeout(() => {}, 1) satisfies NodeJS.Timeout;
window.setTimeout(() => {}, 1) satisfies B.TimerId;
