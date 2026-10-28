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
buf.write(raw) satisfies B.Bytes;
buf.write(raw, 0, "utf8") satisfies B.Bytes;
buf.write(raw, 0, 1, "utf8") satisfies B.Bytes;
buf.copy(new Uint8Array(4)) satisfies B.Bytes;
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
atob(raw) satisfies B.WellFormedString;
// @ts-expect-error
atob(raw) satisfies B.Base64;

// UUID
crypto.randomUUID() satisfies B.UUID;
crypto.webcrypto.randomUUID() satisfies B.UUID;
globalThis.crypto.randomUUID() satisfies B.UUID;
crypto.randomUUID() satisfies crypto.UUID;
// @ts-expect-error a matching template literal is not enough
"a-b-c-d-e" as crypto.UUID satisfies B.UUID;

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
os.cpus()[0]?.times.idle satisfies B.Milliseconds | undefined;
crypto.randomInt(10) satisfies B.SafeInteger;
crypto.randomInt(1, 10) satisfies B.SafeInteger;
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
perf.measure("a", { start: "b" }).startTime satisfies B.PerformanceTimestamp;
perf.measure("a", { start: perf.now() }).startTime satisfies B.PerformanceTimestamp;
perf.measure("a", { start: 0 }).duration satisfies B.Milliseconds;
// @ts-expect-error a plain start time is the caller's number
perf.measure("a", { start: 0 }).startTime satisfies B.PerformanceTimestamp;
perf.mark("a", { startTime: perf.now() }).startTime satisfies B.PerformanceTimestamp;
// @ts-expect-error
perf.mark("a", { startTime: 0 }).startTime satisfies B.PerformanceTimestamp;
perf.getEntries()[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
perf.getEntriesByName(raw)[0]?.duration satisfies B.Milliseconds | undefined;
perf.getEntriesByType("mark")[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
perf.getEntriesByType("resource")[0]?.transferSize satisfies B.Bytes | undefined;
perf.getEntriesByType("resource")[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
declare const entryList: PerformanceObserverEntryList;
entryList.getEntries()[0]?.duration satisfies B.Milliseconds | undefined;
entryList.getEntriesByType("resource")[0]?.decodedBodySize satisfies B.Bytes | undefined;
new PerformanceObserver(() => {}).takeRecords()[0]?.startTime satisfies B.PerformanceTimestamp | undefined;
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
import { monitorEventLoopDelay, PerformanceObserver, type PerformanceObserverEntryList } from "node:perf_hooks";
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

// Path encodings: only text encodings keep a path a path
fs.realpathSync(raw, "latin1") satisfies B.AbsolutePath;
fs.realpathSync(raw, { encoding: "utf8" }) satisfies B.AbsolutePath;
fs.realpathSync(raw, null) satisfies B.AbsolutePath;
// @ts-expect-error a hex-encoded path is not a path
fs.realpathSync(raw, "hex") satisfies B.AbsolutePath;
// @ts-expect-error
fs.realpathSync.native(raw, { encoding: "base64" }) satisfies B.AbsolutePath;
// @ts-expect-error
fs.mkdtempSync(abs, "utf16le") satisfies B.AbsolutePath;
(async () => {
	(await fsp.realpath(raw, "utf8")) satisfies B.AbsolutePath;
	// @ts-expect-error
	(await fsp.realpath(raw, { encoding: "hex" })) satisfies B.AbsolutePath;
	// @ts-expect-error
	(await fsp.mkdtemp(abs, "base64")) satisfies B.AbsolutePath;
})();

// File contents
fs.readFileSync(raw, "hex") satisfies B.Hex;
fs.readFileSync(raw, { encoding: "base64" }) satisfies B.Base64;
fs.readFileSync(raw, { encoding: "base64url", flag: "r" }) satisfies B.Base64Url;
fs.readFileSync(raw, "utf8") satisfies B.WellFormedString;
fs.readFileSync(raw, "latin1") satisfies B.WellFormedString;
fs.readFileSync(raw) satisfies Buffer;
// @ts-expect-error utf16le can give lone surrogates
fs.readFileSync(raw, "utf16le") satisfies B.WellFormedString;
(async () => {
	(await fsp.readFile(raw, "hex")) satisfies B.Hex;
	(await fsp.readFile(raw, { encoding: "utf8", signal: AbortSignal.timeout(1) })) satisfies B.WellFormedString;
	(await fsp.readFile(raw)) satisfies Buffer;
	const fh = await fsp.open(raw);
	(await fh.readFile("base64")) satisfies B.Base64;
	(await fh.readFile({ encoding: "utf-8" })) satisfies B.WellFormedString;
	(await fh.readFile()) satisfies Buffer;
	(await fh.readv([buf])).bytesRead satisfies B.Bytes;
	(await fh.writev([buf])).bytesWritten satisfies B.Bytes;
	// @ts-expect-error
	(await fh.readFile("ucs2")) satisfies B.WellFormedString;
})();

// Buffer
buf.toString() satisfies B.WellFormedString;
buf.toString("utf8", 0, 1) satisfies B.WellFormedString;
buf.toString("latin1") satisfies B.WellFormedString;
// @ts-expect-error
buf.toString("utf16le") satisfies B.WellFormedString;
buf.readUInt32LE() satisfies B.SafeInteger;
buf.readIntBE(0, 6) satisfies B.SafeInteger;
buf.readInt8(0) satisfies B.SafeInteger;
// @ts-expect-error
buf.readDoubleLE() satisfies B.Finite;

// More Stats
st.uid satisfies B.Uid;
st.gid satisfies B.Gid;
st.blksize satisfies B.Bytes;
st.mode satisfies B.FileMode;
// @ts-expect-error blocks counts 512-byte blocks
st.blocks satisfies B.Bytes;
fs.fstatSync(fd).size satisfies B.Bytes;
fs.fstatSync(fd, { bigint: true }).size satisfies bigint;
fs.statfsSync(raw).bsize satisfies B.Bytes;
fs.statfsSync(raw, { bigint: true }).bsize satisfies bigint;
// @ts-expect-error a block count
fs.statfsSync(raw).blocks satisfies B.Bytes;
fs.readvSync(fd, [buf]) satisfies B.Bytes;
fs.writevSync(fd, [buf]) satisfies B.Bytes;
(async () => {
	(await fsp.statfs(raw)).bsize satisfies B.Bytes;
	(await fs.openAsBlob(raw)).size satisfies B.Bytes;
})();

// Blobs and text decoding
import { Blob as NodeBlob, resolveObjectURL } from "node:buffer";
import util from "node:util";
declare const bytes: Uint8Array;
declare const request: Request;
resolveObjectURL(raw)?.size satisfies B.Bytes | undefined;
util.toUSVString(raw) satisfies B.WellFormedString;
new TextDecoder().decode(bytes) satisfies B.WellFormedString;
new util.TextDecoder().decode() satisfies B.WellFormedString;
const encoded = new TextEncoder().encodeInto(raw, bytes);
encoded.written satisfies B.Bytes;
// @ts-expect-error read counts UTF-16 code units
encoded.read satisfies B.Bytes;
(async () => {
	(await new NodeBlob([raw]).text()) satisfies B.WellFormedString;
	(await new Blob([raw]).text()) satisfies B.WellFormedString;
	(await (await fetch(raw)).text()) satisfies B.WellFormedString;
	(await request.text()) satisfies B.WellFormedString;
})();

// URLs
import url from "node:url";
import.meta.resolve(raw) satisfies B.AbsoluteUrl;
url.format(new URL(raw)) satisfies B.AbsoluteUrl;
// @ts-expect-error options can change the output
url.format(new URL(raw), { unicode: true }) satisfies B.AbsoluteUrl;
new URLSearchParams({ a: raw }).toString() satisfies B.FormUrlEncoded;
new url.URLSearchParams({ a: raw }).toString() satisfies B.FormUrlEncoded;
// @ts-expect-error
new URLSearchParams({ a: raw }).toString() satisfies B.EncodedUriComponent;

// os and process
os.availableParallelism() satisfies B.SafeInteger;
for (const info of Object.values(os.networkInterfaces()).flat()) {
	if (info?.family === "IPv4") info.netmask satisfies B.IPv4;
	if (info?.family === "IPv6") info.netmask satisfies B.IPv6;
	info?.mac satisfies B.MacAddress | undefined;
	info?.cidr satisfies B.Cidr | null | undefined;
}
process.threadCpuUsage().user satisfies B.Microseconds;
process.umask() satisfies B.FileMode;
process.umask(0o22) satisfies B.FileMode;
process.hrtime()[1] satisfies B.Nanoseconds;
setTimeout(() => {}, 1)[Symbol.toPrimitive]() satisfies B.AsyncId;

// crypto encodings
declare const key: crypto.KeyObject;
crypto.createSign("sha256").sign(key, "hex") satisfies B.Hex;
crypto.createSign("sha256").sign(key) satisfies Buffer;
const ecdh = crypto.createECDH("prime256v1");
ecdh.generateKeys("base64") satisfies B.Base64;
ecdh.getPublicKey("hex", "compressed") satisfies B.Hex;
ecdh.getPrivateKey("base64url") satisfies B.Base64Url;
ecdh.computeSecret(raw, "hex", "base64") satisfies B.Base64;
ecdh.getPublicKey() satisfies Buffer;
const dh = crypto.createDiffieHellman(512);
dh.getPrime("hex") satisfies B.Hex;
dh.getGenerator("base64") satisfies B.Base64;
dh.generateKeys("hex") satisfies B.Hex;
dh.computeSecret(raw, "hex", "hex") satisfies B.Hex;
// @ts-expect-error
dh.getPrime("binary") satisfies B.Hex;
const cipher = crypto.createCipheriv("aes-128-cbc", buf, buf);
cipher.update(raw, "utf8", "hex") satisfies B.Hex;
cipher.update(buf, undefined, "base64") satisfies B.Base64;
cipher.final("base64url") satisfies B.Base64Url;
cipher.update(raw) satisfies Buffer;
// @ts-expect-error
cipher.final("latin1") satisfies B.Hex;
crypto.createDecipheriv("aes-128-cbc", buf, buf).update(raw, "hex", "base64") satisfies B.Base64;
key.export({ type: "spki", format: "pem" }) satisfies B.Pem;
key.export({ format: "jwk" }).x satisfies B.Base64Url | undefined;
key.export({ format: "jwk" }).kty satisfies string | undefined;
key.export({ type: "spki", format: "der" }) satisfies Buffer;
cert.toString() satisfies B.Pem;
cert.toJSON() satisfies B.Pem;
cert.toLegacyObject().fingerprint256 satisfies B.ColonHexFingerprint;
// @ts-expect-error
cert.toJSON() satisfies B.Json;
crypto.getCipherInfo("aes-128-cbc")?.keyLength satisfies B.Bytes | undefined;
crypto.getCipherInfo("aes-128-cbc")?.ivLength satisfies B.Bytes | undefined;
crypto.secureHeapUsed().total satisfies B.Bytes;
// @ts-expect-error a ratio
crypto.secureHeapUsed().utilization satisfies B.Bytes;

// tls
import tls from "node:tls";
declare const tlsSocket: tls.TLSSocket;
tls.getCACertificates() satisfies B.Pem[];
const ownCert = tlsSocket.getCertificate();
if (ownCert && "fingerprint" in ownCert) ownCert.fingerprint256 satisfies B.ColonHexFingerprint;

// v8, workers and vm
import v8 from "node:v8";
import vm from "node:vm";
import { Worker } from "node:worker_threads";
v8.getHeapStatistics().used_heap_size satisfies B.Bytes;
v8.getHeapStatistics().number_of_native_contexts satisfies B.Integer;
v8.getHeapStatistics().does_zap_garbage satisfies 0 | 1;
// @ts-expect-error a count
v8.getHeapStatistics().number_of_native_contexts satisfies B.Bytes;
v8.getHeapSpaceStatistics()[0]?.space_size satisfies B.Bytes | undefined;
v8.getHeapSpaceStatistics()[0]?.space_name satisfies string | undefined;
v8.getHeapCodeStatistics().code_and_metadata_size satisfies B.Bytes;
v8.cachedDataVersionTag() satisfies B.Uint32;
v8.cachedDataVersionTag() satisfies B.SafeInteger;
const gc = new v8.GCProfiler().stop();
gc.startTime satisfies B.EpochMilliseconds;
gc.statistics[0]?.beforeGC.heapStatistics.usedHeapSize satisfies B.Bytes | undefined;
gc.statistics[0]?.afterGC.heapSpaceStatistics[0]?.spaceSize satisfies B.Bytes | undefined;
gc.statistics[0]?.gcType satisfies string | undefined;
declare const worker: Worker;
(async () => {
	(await worker.cpuUsage()).user satisfies B.Microseconds;
	(await worker.getHeapStatistics()).total_heap_size satisfies B.Bytes;
	(await vm.measureMemory()).total.jsMemoryEstimate satisfies B.Bytes;
	(await vm.measureMemory()).total.jsMemoryRange[1] satisfies B.Bytes;
})();

// Integers
import zlib from "node:zlib";
import { DatabaseSync } from "node:sqlite";
import tty from "node:tty";
import readline from "node:readline";
import { mock } from "node:test";
zlib.crc32(raw) satisfies B.Uint32;
const db = new DatabaseSync(":memory:");
db.location() satisfies B.AbsolutePath | null;
db.prepare(raw).run().changes satisfies B.Integer | bigint;
db.prepare(raw).run({ a: 1 }).lastInsertRowid satisfies B.Integer | bigint;
// @ts-expect-error may exceed 2 ** 53
db.prepare(raw).run().changes satisfies B.SafeInteger | bigint;
declare const ttyStream: tty.WriteStream;
ttyStream.getWindowSize() satisfies [B.Integer, B.Integer];
declare const rl: readline.Interface;
rl.getCursorPos().rows satisfies B.Integer;
mock.fn().mock.callCount() satisfies B.Integer;
mock.property({ a: 1 }, "a").mock.accessCount() satisfies B.Integer;

// net, dgram and ports
net.getDefaultAutoSelectFamilyAttemptTimeout() satisfies B.Milliseconds;
if (serverAddress && typeof serverAddress !== "string") serverAddress.port satisfies B.Port;
const udp = dgram.createSocket("udp4");
udp.address().port satisfies B.Port;
udp.address().port satisfies B.SafeInteger;
udp.remoteAddress().address satisfies B.IPv4 | B.IPv6;
udp.getRecvBufferSize() satisfies B.Bytes;
udp.getSendQueueSize() satisfies B.Bytes;
// @ts-expect-error a count
udp.getSendQueueCount() satisfies B.Bytes;

// HTTP header names
import http from "node:http";
import http2 from "node:http2";
declare const res: http.ServerResponse;
declare const clientRequest: http.ClientRequest;
declare const h2res: http2.Http2ServerResponse;
res.getHeaderNames() satisfies B.LowercaseHeaderName[];
res.getHeaderNames() satisfies B.HeaderName[];
clientRequest.getRawHeaderNames() satisfies B.HeaderName[];
// @ts-expect-error raw names keep their case
clientRequest.getRawHeaderNames() satisfies B.LowercaseHeaderName[];
h2res.getHeaderNames() satisfies B.LowercaseHeaderName[];
{
	const name: string = raw;
	http.validateHeaderName(name);
	name satisfies B.HeaderName;
}
http2.getDefaultSettings().maxFrameSize satisfies B.Bytes | undefined;
http2.getUnpackedSettings(bytes).headerTableSize satisfies B.Bytes | undefined;
// @ts-expect-error a count
http2.getDefaultSettings().maxConcurrentStreams satisfies B.Bytes | undefined;

// DNS records
(async () => {
	(await dnsp.resolve4(raw, { ttl: true }))[0]!.ttl satisfies B.Seconds;
	(await dnsp.resolve6(raw, { ttl: true }))[0]!.ttl satisfies B.Seconds;
	(await dnsp.resolveSoa(raw)).refresh satisfies B.Seconds;
	(await dnsp.resolveSoa(raw)).serial satisfies number;
	// @ts-expect-error a serial number, not a duration
	(await dnsp.resolveSoa(raw)).serial satisfies B.Seconds;
	(await dnsp.resolveSrv(raw))[0]!.port satisfies B.Port;
	(await new dnsp.Resolver().resolveSoa(raw)).expire satisfies B.Seconds;
})();
