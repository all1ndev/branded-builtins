// APIs only @types/node 22 declares this way, checked against the node22 entry only.
import type { Worker } from "node:worker_threads";
import type * as B from "@all1ndev/branded-builtins";

declare const worker: Worker;
(async () => {
	(await (await worker.startCpuProfile("cpu")).stop()) satisfies B.Json;
})();
