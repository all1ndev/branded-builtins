// Checks at runtime the facts the brands claim. Types alone can't prove these.
import assert from "node:assert/strict";
import { executionAsyncId } from "node:async_hooks";
import { execFileSync, spawnSync } from "node:child_process";
import crypto, { randomInt } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import http2 from "node:http2";
import { createRequire, enableCompileCache, findPackageJSON, SourceMap } from "node:module";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import querystring from "node:querystring";
import { DatabaseSync } from "node:sqlite";
import tls from "node:tls";
import url, { fileURLToPath } from "node:url";
import util from "node:util";
import v8 from "node:v8";
import zlib from "node:zlib";

// AbsolutePath: overloads that keep the brand, under both POSIX and Windows rules.
const samples = {
	posix: ["/", "/a", "/a/b/..", "/a/../..", "/a/b/c.txt"],
	win32: ["C:\\", "C:\\a", "C:\\a\\..\\..", "\\\\server\\share\\a", "\\a", "C:/a/b.txt"],
};
for (const [flavor, inputs] of Object.entries(samples)) {
	const p = path[flavor];
	for (const input of inputs) {
		assert.ok(p.isAbsolute(input), `${flavor} sample ${input}`);
		for (const output of [
			p.join(input, "..", "x"),
			p.join(input, "../../.."),
			p.normalize(input),
			p.dirname(input),
			p.toNamespacedPath(input),
			p.parse(input).dir,
			p.parse(input).root,
		]) {
			assert.ok(p.isAbsolute(output), `${flavor}: ${input} -> ${output}`);
		}
	}
	assert.ok(p.isAbsolute(p.resolve("relative")), `${flavor} resolve`);
}

// AbsolutePath: producers.
const require = createRequire(import.meta.url);
const tmp = fs.realpathSync(os.tmpdir());
for (const value of [
	process.cwd(),
	os.homedir(),
	os.tmpdir(),
	os.userInfo().homedir,
	fileURLToPath(import.meta.url),
	fs.realpathSync("."),
	fs.realpathSync.native("."),
	await fs.promises.realpath("."),
	findPackageJSON(import.meta.url),
	...(require.resolve.paths("some-package") ?? []),
]) {
	assert.ok(path.isAbsolute(value), String(value));
}
assert.equal(require.resolve.paths("node:fs"), null);
const dir = fs.mkdtempSync(path.join(tmp, "branded-"));
assert.ok(path.isAbsolute(dir));
assert.ok(path.isAbsolute(fs.mkdirSync(path.join(dir, "a", "b"), { recursive: true })));
fs.rmSync(dir, { recursive: true });

// es2024
assert.match(new Date(0).toISOString(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
assert.throws(() => new Date(NaN).toISOString(), RangeError);
assert.equal("e\u0301".normalize(), "e\u0301".normalize("NFC"));
assert.ok("a\ud800".toWellFormed().isWellFormed());
assert.ok(Math.abs(new Date().getTimezoneOffset()) <= 14 * 60, "getTimezoneOffset is minutes");
assert.equal(new Date(0).setUTCHours(1), 3_600_000, "Date setters return epoch milliseconds");
assert.match(new Date(0).toUTCString(), /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
assert.ok(Number.isSafeInteger(Math.clz32(NaN)) && Number.isSafeInteger(Math.imul(NaN, 1.5)));
assert.deepEqual(Intl.getCanonicalLocales("EN-latn-us"), ["en-Latn-US"]);
assert.equal(new Intl.Locale("EN-us").toString(), "en-US");
for (const timeZone of [...Intl.supportedValuesOf("timeZone"), new Intl.DateTimeFormat().resolvedOptions().timeZone]) {
	new Intl.DateTimeFormat("en", { timeZone });
}
// Decoders never produce lone surrogates: bytes of an encoded U+D800, and a lone UTF-16 surrogate.
const surrogate = new Uint8Array([0xed, 0xa0, 0x80]);
assert.ok(new TextDecoder().decode(surrogate).isWellFormed());
assert.ok(new TextDecoder("utf-16le").decode(new Uint8Array([0x00, 0xd8])).isWellFormed());
assert.ok((await new Blob([surrogate]).text()).isWellFormed());
assert.ok((await new Response(surrogate).text()).isWellFormed());
assert.equal(new TextEncoder().encodeInto("é", new Uint8Array(4)).written, 2, "encodeInto().written is bytes");
// es2025 and esnext, on Node versions that have them.
if (RegExp.escape) assert.ok(new RegExp(RegExp.escape("a.b")).test("a.b"));
if (Uint8Array.prototype.toBase64) {
	const bytes = new Uint8Array([251, 255]);
	assert.equal(bytes.toBase64(), Buffer.from(bytes).toString("base64"));
	assert.equal(
		bytes.toBase64({ alphabet: "base64url", omitPadding: true }),
		Buffer.from(bytes).toString("base64url"),
	);
	assert.equal(bytes.toHex(), Buffer.from(bytes).toString("hex"));
}

// URL serializes to an absolute URL.
assert.ok(URL.canParse(new URL("../a?b#c", "https://example.com/x/y").toString()));

// Units.
assert.ok(Math.abs(fs.statSync(".").mtimeMs - Date.now()) < 1e12, "mtimeMs is epoch milliseconds");
const rssKilobytes = process.resourceUsage().maxRSS;
assert.ok(rssKilobytes * 1024 >= process.memoryUsage.rss() / 4, "maxRSS is kilobytes");
assert.equal(Buffer.alloc(4).write("é"), 2, "Buffer#write returns bytes");
assert.equal(Buffer.from("é").copy(new Uint8Array(4)), 2, "Buffer#copy returns bytes");
assert.ok(Number.isSafeInteger(randomInt(2 ** 47)));
assert.ok(os.cpus()[0].times.idle <= os.uptime() * 1000 * 2, "cpus() times are milliseconds");
const cpu = process.cpuUsage();
assert.ok(cpu.user > 1000, "cpuUsage is microseconds");
const delays = monitorEventLoopDelay({ resolution: 10 });
delays.enable();
await new Promise((resolve) => setTimeout(resolve, 100));
delays.disable();
assert.ok(delays.min > 1e6, `event loop delays are nanoseconds: ${delays.min}`);

// Encodings that keep a path a path, and text without lone surrogates.
for (const encoding of ["utf8", "latin1", "ascii"]) assert.ok(path.isAbsolute(fs.realpathSync(".", encoding)));
const loneSurrogate = Buffer.from([0xed, 0xa0, 0x80, 0xff]);
for (const encoding of [undefined, "utf8", "latin1", "binary", "ascii"]) {
	assert.ok(loneSurrogate.toString(encoding).isWellFormed(), `Buffer#toString(${encoding})`);
}
assert.ok(!Buffer.from([0x00, 0xd8]).toString("utf16le").isWellFormed(), "utf16le can give lone surrogates");
assert.ok(util.toUSVString("a\ud800").isWellFormed());
assert.ok(atob("7aCA/w==").isWellFormed(), "atob gives code units up to 0xFF");
assert.match(fs.readFileSync(import.meta.filename, "hex"), /^[0-9a-f]+$/);

// crypto output formats.
const ecdh = crypto.createECDH("prime256v1");
assert.match(ecdh.generateKeys("hex"), /^[0-9a-f]+$/);
const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.alloc(16), Buffer.alloc(16));
for (const chunk of [cipher.update("a".repeat(37), "utf8", "base64"), cipher.final("base64")]) {
	assert.equal(Buffer.from(chunk, "base64").toString("base64"), chunk, "cipher chunks are whole base64");
}
const [caCertificate] = tls.getCACertificates();
const x509 = new crypto.X509Certificate(caCertificate);
assert.match(caCertificate, /^-----BEGIN CERTIFICATE-----\n/);
assert.equal(x509.toJSON(), x509.toString());
assert.match(x509.toString(), /^-----BEGIN CERTIFICATE-----\n/);
assert.match(x509.toLegacyObject().fingerprint256, /^[0-9A-F]{2}(:[0-9A-F]{2})+$/);
const { publicKey } = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" });
assert.match(publicKey.export({ type: "spki", format: "pem" }), /^-----BEGIN PUBLIC KEY-----\n/);
assert.match(publicKey.export({ format: "jwk" }).x, /^[A-Za-z0-9_-]+$/);
assert.equal(crypto.getCipherInfo("aes-256-cbc").keyLength, 32, "getCipherInfo lengths are bytes");
assert.ok(Number.isInteger(zlib.crc32("a")) && zlib.crc32("\xff".repeat(9)) < 2 ** 32);
assert.ok(v8.cachedDataVersionTag() >= 0 && v8.cachedDataVersionTag() < 2 ** 32);

// Network formats.
for (const info of Object.values(os.networkInterfaces()).flat()) {
	assert.equal(net.isIP(info.netmask), info.family === "IPv4" ? 4 : 6, info.netmask);
	assert.match(info.mac, /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/);
	if (info.cidr !== null) assert.match(info.cidr, /^[0-9a-f.:]+\/\d+$/);
}
assert.equal(new URLSearchParams({ a: "b c" }).toString(), "a=b+c");
assert.ok(URL.canParse(import.meta.resolve("node:fs")) && URL.canParse(import.meta.resolve("./x.mjs")));
const unicodeUrl = new URL("https://例え.jp/a b");
assert.equal(url.format(unicodeUrl), unicodeUrl.href);
const response = new http.ServerResponse(new http.IncomingMessage(null));
response.setHeader("X-Mixed-Case", "1");
assert.deepEqual(response.getHeaderNames(), ["x-mixed-case"]);
assert.throws(() => http.validateHeaderName("bad name"));
assert.equal(http2.getDefaultSettings().maxFrameSize, 16384, "http2 settings are octets");

// More units.
assert.ok(process.hrtime()[1] < 1e9);
if (process.threadCpuUsage) assert.ok(process.threadCpuUsage().user > 1000, "threadCpuUsage is microseconds");
assert.ok(v8.getHeapStatistics().used_heap_size > 1e6, "heap statistics are bytes");
assert.ok(fs.statSync(".").blksize >= 512, "blksize is bytes");
assert.equal(process.umask(), process.umask(), "umask() returns the mask");
const gcProfiler = new v8.GCProfiler();
gcProfiler.start();
const gcResult = gcProfiler.stop();
assert.ok(Math.abs(gcResult.startTime - Date.now()) < 60_000, "GCProfiler times are epoch milliseconds");
if (v8.startCpuProfile) JSON.parse(v8.startCpuProfile().stop());
const elu = performance.eventLoopUtilization();
assert.ok(elu.idle + elu.active <= performance.now() + 1, "eventLoopUtilization is milliseconds");
if (DatabaseSync.prototype.location) {
	const tmpDb = path.join(tmp, `branded-${process.pid}.db`);
	const db = new DatabaseSync(tmpDb);
	assert.ok(path.isAbsolute(db.location()));
	assert.equal(new DatabaseSync(":memory:").location(), null);
	db.close();
	fs.rmSync(tmpDb);
}

// Child process output is decoded from one buffer per stream, so base64 has no padding mid-string.
const childBase64 = execFileSync(process.execPath, ["-e", "process.stdout.write(Buffer.alloc(1e5, 7))"], {
	encoding: "base64",
});
assert.equal(Buffer.from(childBase64, "base64").toString("base64"), childBase64);
const childText = spawnSync(process.execPath, ["-e", "process.stdout.write(Buffer.from([0xed, 0xa0, 0x80]))"], {
	encoding: "utf8",
}).stdout;
assert.ok(childText.isWellFormed());
let allCodeUnits = "";
for (let i = 0; i < 0x800; i++) allCodeUnits += String.fromCharCode(i);
assert.equal(querystring.escape(allCodeUnits + "😀"), encodeURIComponent(allCodeUnits + "😀"));
const cacheDir = path.join(tmp, `branded-cache-${process.pid}`);
const compileCache = enableCompileCache(path.relative(process.cwd(), cacheDir));
if (compileCache.directory !== undefined) assert.ok(path.isAbsolute(compileCache.directory));
fs.rmSync(cacheDir, { recursive: true, force: true });

// Positions: source map offsets count from 0, stack trace positions from 1.
const sourceMap = new SourceMap({ version: 3, sources: ["a.ts"], names: [], mappings: "AAAA" });
assert.equal(sourceMap.findEntry(0, 0).generatedLine, 0);
assert.deepEqual([sourceMap.findOrigin(1, 1).lineNumber, sourceMap.findOrigin(1, 1).columnNumber], [1, 1]);
if (util.getCallSites) {
	const [callSite] = util.getCallSites();
	const callLine = fs.readFileSync(import.meta.filename, "utf8").split("\n")[callSite.lineNumber - 1];
	assert.equal(callSite.columnNumber, callLine.indexOf("getCallSites()") + 1, "getCallSites positions count from 1");
}

// Intl, Headers and Temporal formats.
assert.equal(new Intl.NumberFormat("EN-us", { style: "currency", currency: "usd" }).resolvedOptions().currency, "USD");
assert.equal(new Intl.Collator("EN-us").resolvedOptions().locale, "en-US");
assert.deepEqual(Intl.NumberFormat.supportedLocalesOf("EN-us"), ["en-US"]);
for (const code of Intl.supportedValuesOf("currency")) assert.match(code, /^[A-Z]{3}$/);
assert.deepEqual([...new Headers({ "X-Mixed": "1" }).keys()], ["x-mixed"]);
if (globalThis.Temporal) {
	assert.match(Temporal.Now.instant().toString(), /Z$/);
	assert.match(Temporal.Now.plainTimeISO().toString(), /^\d{2}:\d{2}:\d{2}/);
	assert.equal(Temporal.Duration.from({ hours: 1 }).toString(), "PT1H");
	assert.equal(Temporal.Duration.from({ minutes: 90 }).total("hours"), 1.5);
	Temporal.Instant.from(new Date().toISOString());
}

const timeout = setTimeout(() => {
	assert.equal(+timeout, executionAsyncId(), "a Timeout converts to its async id");
	console.log("runtime checks passed");
}, 1);
