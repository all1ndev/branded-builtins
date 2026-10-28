/// <reference types="node" preserve="true" />
/// <reference path="../node/globals.ts" preserve="true" />
/// <reference path="../node/bare-modules.ts" preserve="true" />

// Augmentations for @types/node 22: the shared ones, plus the ones that differ in 22.

import type { EventLoopDelays } from "../node/types.ts";

declare module "perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & IntervalHistogram;
}
