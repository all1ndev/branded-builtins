/// <reference types="node" preserve="true" />
/// <reference path="../node22/common.ts" preserve="true" />

// Augmentations for @types/node 24: the overloads shared with 22, plus the APIs added or
// renamed in 24.
// @types/node 24 still declares its modules under bare names ("fs"), like 22.

import type { AbsolutePath } from "../index.ts";
// Inside `declare module "crypto"`, `UUID` means crypto's own type.
import type { UUID as BrandedUUID } from "../index.ts";
import type { EncodingOption } from "node:fs";
import type { EventLoopDelays } from "../node-types.ts";

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
