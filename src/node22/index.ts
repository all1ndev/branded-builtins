/// <reference types="node" preserve="true" />
/// <reference path="./common.ts" preserve="true" />

// Augmentations for @types/node 22: the overloads shared with 24, plus the ones whose types
// were renamed in 24.

import type { EventLoopDelays } from "../node-types.ts";

declare module "perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & IntervalHistogram;
}
