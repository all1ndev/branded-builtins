// Checks at runtime the facts the brands claim. Types alone can't prove these.
import assert from "node:assert/strict";
import { randomInt } from "node:crypto";
import fs from "node:fs";
import { createRequire, findPackageJSON } from "node:module";
import os from "node:os";
import path from "node:path";
import { monitorEventLoopDelay } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

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

console.log("runtime checks passed");
