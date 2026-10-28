import type * as B from "@all1ndev/branded-builtins";

crypto.randomUUID() satisfies B.UUID;
performance.now() satisfies B.PerformanceTimestamp;
performance.mark("a").startTime satisfies B.PerformanceTimestamp;
performance.measure("a", "b").duration satisfies B.Milliseconds;
