// APIs added in Node 24, checked against the node24 and node26 entries only.
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { Blob as NodeBlob } from "node:buffer";
import dgram from "node:dgram";
import type net from "node:net";
import { eventLoopUtilization, performance } from "node:perf_hooks";
import type { SQLTagStore } from "node:sqlite";
import type { ReadableStream } from "node:stream/web";
import v8 from "node:v8";
import type { Worker } from "node:worker_threads";
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;
declare const abs: B.AbsolutePath;

crypto.randomUUIDv7() satisfies B.UUID;
fs.mkdtempDisposableSync(abs).path satisfies B.AbsolutePath;
(async () => {
	(await fsp.mkdtempDisposable(abs)).path satisfies B.AbsolutePath;
	// @ts-expect-error
	(await fsp.mkdtempDisposable(raw)).path satisfies B.AbsolutePath;
})();

new NodeBlob([raw]).textStream() satisfies ReadableStream<B.WellFormedString>;
declare const bound: net.BoundSocket;
bound.address().port satisfies B.Port;
dgram.createSocket("udp4").bindSync().address satisfies B.IPv4 | B.IPv6;
eventLoopUtilization().idle satisfies B.Milliseconds;
performance.eventLoopUtilization().active satisfies B.Milliseconds;
// @ts-expect-error a ratio
performance.eventLoopUtilization().utilization satisfies B.Milliseconds;
v8.startCpuProfile().stop() satisfies B.Json;
declare const store: SQLTagStore;
store.run`SELECT 1`.changes satisfies B.Integer | bigint;
declare const worker: Worker;
(async () => {
	(await (await worker.startCpuProfile()).stop()) satisfies B.Json;
	(await (await worker.startHeapProfile()).stop()) satisfies B.Json;
})();
