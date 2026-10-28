import path from "node:path";
import { join } from "path";
import os from "node:os";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { findPackageJSON, getCompileCacheDir } from "node:module";
import crypto from "node:crypto";
import { performance as perf } from "node:perf_hooks";
import net from "node:net";
import dns from "node:dns";
import dnsp from "node:dns/promises";
import { AsyncResource, executionAsyncId, triggerAsyncId } from "node:async_hooks";
import type * as B from "@all1ndev/branded-builtins";
import * as pkg from "@all1ndev/branded-builtins";

declare const raw: string;
declare const abs: B.AbsolutePath;

// AbsolutePath producers
abs satisfies string;
path.resolve(raw) satisfies B.AbsolutePath;
path.posix.resolve(raw) satisfies B.AbsolutePath;
path.win32.resolve(raw) satisfies B.AbsolutePath;
os.homedir() satisfies B.AbsolutePath;
os.tmpdir() satisfies B.AbsolutePath;
fileURLToPath(import.meta.url) satisfies B.AbsolutePath;
process.cwd() satisfies B.AbsolutePath;
findPackageJSON(raw) satisfies B.AbsolutePath | undefined;
getCompileCacheDir() satisfies B.AbsolutePath | undefined;
fs.realpathSync(raw) satisfies B.AbsolutePath;
fs.realpathSync.native(raw) satisfies B.AbsolutePath;
fs.realpathSync(raw, "buffer") satisfies Buffer;
(async () => {
	(await fsp.realpath(raw)) satisfies B.AbsolutePath;
	(await fs.promises.realpath(raw)) satisfies B.AbsolutePath;
	(await fsp.realpath(raw, "buffer")) satisfies Buffer;
	(await fsp.mkdtemp(abs)) satisfies B.AbsolutePath;
	(await fsp.mkdir(abs, { recursive: true })) satisfies B.AbsolutePath | undefined;
	// @ts-expect-error relative prefix gives a relative result
	(await fsp.mkdtemp(raw)) satisfies B.AbsolutePath;
	// @ts-expect-error
	(await fsp.mkdir(raw, { recursive: true })) satisfies B.AbsolutePath | undefined;
})();

// AbsolutePath kept through overloads on branded input
join(abs, raw) satisfies B.AbsolutePath;
path.join(abs, raw) satisfies B.AbsolutePath;
path.normalize(abs) satisfies B.AbsolutePath;
path.dirname(abs) satisfies B.AbsolutePath;
path.toNamespacedPath(abs) satisfies B.AbsolutePath;
fs.mkdtempSync(abs) satisfies B.AbsolutePath;
fs.mkdirSync(abs, { recursive: true }) satisfies B.AbsolutePath | undefined;
fs.mkdirSync(abs) satisfies void;

// Plain input still works and stays plain
path.join(raw, raw) satisfies string;
// @ts-expect-error
path.join(raw, raw) satisfies B.AbsolutePath;
// @ts-expect-error
path.normalize(raw) satisfies B.AbsolutePath;
// @ts-expect-error
path.dirname(raw) satisfies B.AbsolutePath;
// @ts-expect-error
path.relative(abs, abs) satisfies B.AbsolutePath;
// @ts-expect-error
fs.mkdtempSync(raw) satisfies B.AbsolutePath;

// Type guards
if (path.isAbsolute(raw)) {
	raw satisfies B.AbsolutePath;
} else {
	// @ts-expect-error
	raw satisfies B.AbsolutePath;
}
if (net.isIPv4(raw)) raw satisfies B.IPv4;
if (net.isIPv6(raw)) raw satisfies B.IPv6;

// FileDescriptor
const fd = fs.openSync(raw, "r");
fd satisfies B.FileDescriptor;
fs.closeSync(fd);
// @ts-expect-error
fs.closeSync(1) satisfies B.FileDescriptor;

// Encodings
const buf = Buffer.from(raw);
buf.toString("hex") satisfies B.Hex;
buf.toString("base64") satisfies B.Base64;
buf.toString("base64url") satisfies B.Base64Url;
crypto.randomBytes(16).toString("hex") satisfies B.Hex;
// @ts-expect-error
buf.toString("utf8") satisfies B.Hex;
// @ts-expect-error
buf.toString("hex") satisfies B.Base64;
crypto.createHash("sha256").update(raw).digest("hex") satisfies B.Hex;
crypto.createHash("sha256").digest("base64") satisfies B.Base64;
crypto.createHmac("sha256", "k").digest("base64url") satisfies B.Base64Url;
crypto.createHash("sha256").digest() satisfies Buffer;
crypto.hash("sha256", raw) satisfies B.Hex;
crypto.hash("sha256", raw, "hex") satisfies B.Hex;
crypto.hash("sha256", raw, "base64") satisfies B.Base64;
crypto.hash("sha256", raw, "buffer") satisfies Buffer;
btoa(raw) satisfies B.Base64;

// UUID
crypto.randomUUID() satisfies B.UUID;
crypto.webcrypto.randomUUID() satisfies B.UUID;
globalThis.crypto.randomUUID() satisfies B.UUID;
crypto.randomUUID() satisfies crypto.UUID;
// @ts-expect-error a matching template literal is not enough
("a-b-c-d-e" as crypto.UUID) satisfies B.UUID;

// Time
performance.now() satisfies B.PerformanceTimestamp;
perf.now() satisfies B.PerformanceTimestamp;
process.uptime() satisfies B.Seconds;
os.uptime() satisfies B.Seconds;
process.hrtime.bigint() satisfies B.BigIntNanoseconds;
process.hrtime()[0] satisfies B.Seconds;
process.hrtime(process.hrtime()) satisfies [B.Seconds, number];
// @ts-expect-error
os.uptime() satisfies B.Milliseconds;

// Bytes
os.totalmem() satisfies B.Bytes;
os.freemem() satisfies B.Bytes;
process.memoryUsage().heapUsed satisfies B.Bytes;
process.memoryUsage.rss() satisfies B.Bytes;
process.availableMemory() satisfies B.Bytes;
process.constrainedMemory() satisfies B.Bytes;

// IP addresses
(async () => {
	(await dnsp.resolve4(raw)) satisfies B.IPv4[];
	(await dnsp.resolve6(raw)) satisfies B.IPv6[];
	(await dns.promises.resolve4(raw)) satisfies B.IPv4[];
	(await new dnsp.Resolver().resolve4(raw)) satisfies B.IPv4[];
	(await dnsp.resolve(raw)) satisfies B.IPv4[];
	(await dnsp.resolve(raw, "A")) satisfies B.IPv4[];
	(await dnsp.resolve(raw, "AAAA")) satisfies B.IPv6[];
	(await dnsp.resolve(raw, "MX")) satisfies dns.MxRecord[];
	(await dnsp.resolve4(raw, { ttl: true })) satisfies dns.RecordWithTtl[];
	(await dnsp.lookup(raw)).address satisfies B.IPv4 | B.IPv6;
	(await dnsp.lookup(raw, 4)).address satisfies B.IPv4 | B.IPv6;
	(await dnsp.lookup(raw, { all: true }))[0]!.address satisfies B.IPv4 | B.IPv6;
})();

// AsyncId
executionAsyncId() satisfies B.AsyncId;
triggerAsyncId() satisfies B.AsyncId;
new AsyncResource("x").asyncId() satisfies B.AsyncId;
new AsyncResource("x").triggerAsyncId() satisfies B.AsyncId;

// Brands don't mix
// @ts-expect-error
os.totalmem() satisfies B.Milliseconds;
// @ts-expect-error
executionAsyncId() satisfies B.FileDescriptor;

// No forging
// @ts-expect-error
raw satisfies B.AbsolutePath;
// @ts-expect-error
pkg.brand;

// os.userInfo
const user = os.userInfo();
user.uid satisfies B.Uid;
user.gid satisfies B.Gid;
user.homedir satisfies B.AbsolutePath;
user.username satisfies string;
// @ts-expect-error
user.uid satisfies B.Gid;
os.userInfo({ encoding: "buffer" }).homedir satisfies Buffer;

// Stats
const st = fs.statSync(raw);
st.size satisfies B.Bytes;
st.mtimeMs satisfies B.EpochMilliseconds;
st.isFile() satisfies boolean;
fs.lstatSync(raw).ctimeMs satisfies B.EpochMilliseconds;
fs.statSync(raw, { throwIfNoEntry: false })?.size satisfies B.Bytes | undefined;
fs.statSync(raw, { bigint: true }).size satisfies bigint;
// @ts-expect-error
st.mtimeMs satisfies B.PerformanceTimestamp;
(async () => {
	(await fsp.stat(raw)).size satisfies B.Bytes;
	(await fsp.lstat(raw)).birthtimeMs satisfies B.EpochMilliseconds;
	(await fsp.stat(raw, { bigint: true })).size satisfies bigint;
	const fh = await fsp.open(raw, "r");
	fh.fd satisfies B.FileDescriptor;
	(await fh.stat()).size satisfies B.Bytes;
	(await fh.read(Buffer.alloc(8), 0, 8, 0)).bytesRead satisfies B.Bytes;
	(await fh.read({ buffer: Buffer.alloc(8) })).bytesRead satisfies B.Bytes;
	(await fh.read()).buffer satisfies Buffer;
	(await fh.write(Buffer.from(raw))).bytesWritten satisfies B.Bytes;
	(await fh.write(raw)).bytesWritten satisfies B.Bytes;
})();

// Byte counts
fs.readSync(fd, Buffer.alloc(8), 0, 8, null) satisfies B.Bytes;
fs.readSync(fd, Buffer.alloc(8)) satisfies B.Bytes;
fs.writeSync(fd, Buffer.from(raw)) satisfies B.Bytes;
fs.writeSync(fd, raw) satisfies B.Bytes;
Buffer.byteLength(raw) satisfies B.Bytes;
// @ts-expect-error
raw.length satisfies B.Bytes;

// More paths
path.parse(abs).dir satisfies B.AbsolutePath;
path.parse(abs).root satisfies B.AbsolutePath;
path.parse(abs).base satisfies string;
// @ts-expect-error
path.parse(raw).dir satisfies B.AbsolutePath;
declare const req: NodeJS.Require;
req.resolve.paths(raw) satisfies B.AbsolutePath[] | null;

// Performance entries
perf.mark("a").startTime satisfies B.PerformanceTimestamp;
perf.measure("a", "b").duration satisfies B.Milliseconds;
perf.measure("a", { start: 0 }).startTime satisfies B.PerformanceTimestamp;
// @ts-expect-error
perf.measure("a").duration satisfies B.PerformanceTimestamp;

// URL
new URL(raw).toString() satisfies B.AbsoluteUrl;
new URL(raw).toJSON() satisfies B.AbsoluteUrl;
// @ts-expect-error
new URL(raw).pathname satisfies B.AbsoluteUrl;

// es2024 (the ES entry each run loads next to the node entry)
Date.now() satisfies B.EpochMilliseconds;
new Date().getTime() satisfies B.EpochMilliseconds;
// @ts-expect-error
Date.now() satisfies B.PerformanceTimestamp;
JSON.stringify({}) satisfies B.Json;
encodeURIComponent(raw) satisfies B.EncodedUriComponent;

// Network addresses
import dgram from "node:dgram";
import { monitorEventLoopDelay } from "node:perf_hooks";
for (const info of Object.values(os.networkInterfaces()).flat()) {
	if (info?.family === "IPv4") info.address satisfies B.IPv4;
	if (info?.family === "IPv6") info.address satisfies B.IPv6;
}
const server = net.createServer();
const serverAddress = server.address();
if (serverAddress && typeof serverAddress !== "string") serverAddress.address satisfies B.IPv4 | B.IPv6;
const socketAddress = new net.Socket().address();
if ("address" in socketAddress) socketAddress.address satisfies B.IPv4 | B.IPv6;
dgram.createSocket("udp4").address().address satisfies B.IPv4 | B.IPv6;
declare const cert: crypto.X509Certificate;
cert.checkIP(raw) satisfies B.IPv4 | B.IPv6 | undefined;
(async () => {
	(await dnsp.resolve4(raw, { ttl: true }))[0]!.address satisfies B.IPv4;
	(await dnsp.resolve6(raw, { ttl: true }))[0]!.ttl satisfies number;
	const looked = await dnsp.lookup(raw, { all: Math.random() > 0.5 });
	(Array.isArray(looked) ? looked[0]!.address : looked.address) satisfies B.IPv4 | B.IPv6;
})();

// CPU, memory and event loop units
process.cpuUsage().user satisfies B.Microseconds;
process.cpuUsage(process.cpuUsage()).system satisfies B.Microseconds;
process.resourceUsage().userCPUTime satisfies B.Microseconds;
process.resourceUsage().maxRSS satisfies B.Kilobytes;
// @ts-expect-error kilobytes are not bytes
process.resourceUsage().maxRSS satisfies B.Bytes;
const delays = monitorEventLoopDelay();
delays.mean satisfies B.Nanoseconds;
delays.percentile(99) satisfies B.Nanoseconds;
delays.minBigInt satisfies B.BigIntNanoseconds;
delays.enable() satisfies boolean;
// @ts-expect-error a number of nanoseconds is not a bigint one
delays.mean satisfies B.BigIntNanoseconds;
