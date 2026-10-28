/// <reference types="node" preserve="true" />
/// <reference path="../node/globals.ts" preserve="true" />
/// <reference path="../node22-24/modules.ts" preserve="true" />

// Augmentations for @types/node 24: the shared ones, plus the ones added or renamed in 24.

import type { AbsolutePath } from "../index.ts";
// Inside `declare module "crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type { EncodingOption } from "node:fs";
import type { EventLoopDelays } from "../node/types.ts";

declare module "fs" {
	function mkdtempDisposableSync(prefix: AbsolutePath, options?: EncodingOption): DisposableTempDir & { path: AbsolutePath };
}

declare module "fs/promises" {
	function mkdtempDisposable(prefix: AbsolutePath, options?: EncodingOption): Promise<DisposableTempDir & { path: AbsolutePath }>;
}

declare module "crypto" {
	function randomUUIDv7(options?: RandomUUIDV7Options): BrandedUUID;
}

declare module "perf_hooks" {
	function monitorEventLoopDelay(options?: EventLoopMonitorOptions): EventLoopDelays & ELDHistogram;
}
