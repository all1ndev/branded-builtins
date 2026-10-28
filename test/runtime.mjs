// Checks at runtime the facts the brands claim. Types alone can't prove these.
import assert from "node:assert/strict";
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

// URL serializes to an absolute URL.
assert.ok(URL.canParse(new URL("../a?b#c", "https://example.com/x/y").toString()));

// Units.
assert.ok(Math.abs(fs.statSync(".").mtimeMs - Date.now()) < 1e12, "mtimeMs is epoch milliseconds");
const rssKilobytes = process.resourceUsage().maxRSS;
assert.ok(rssKilobytes * 1024 >= process.memoryUsage.rss() / 4, "maxRSS is kilobytes");
const cpu = process.cpuUsage();
assert.ok(cpu.user > 1000, "cpuUsage is microseconds");
const delays = monitorEventLoopDelay({ resolution: 10 });
delays.enable();
await new Promise((resolve) => setTimeout(resolve, 100));
delays.disable();
assert.ok(delays.min > 1e6, `event loop delays are nanoseconds: ${delays.min}`);

console.log("runtime checks passed");
