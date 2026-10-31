// APIs only @types/node 22 declares this way, checked against the node22 entry only.
import type { Worker } from "node:worker_threads";
import type * as B from "@all1ndev/branded-builtins";

declare const worker: Worker;
(async () => {
	(await (await worker.startCpuProfile("cpu")).stop()) satisfies B.Json;
})();

// @types/node 22 declares no global Crypto or Performance type without the DOM lib, so none is added.
// @ts-expect-error
undefined satisfies Crypto | undefined;
// @ts-expect-error
undefined satisfies Performance | undefined;
crypto.randomUUID() satisfies B.UUID;
performance.now() satisfies B.PerformanceTimestamp;

declare const fileHandle: import("node:fs/promises").FileHandle;
// @ts-expect-error 22's FileHandle#stat takes no throwIfNoEntry
void fileHandle.stat({ throwIfNoEntry: true });
