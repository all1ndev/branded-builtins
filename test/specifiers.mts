// Both import names see the brands, whichever one @types/node declares the module under.
import fs1 from "fs";
import fs2 from "node:fs";
import fsp1 from "fs/promises";
import fsp2 from "node:fs/promises";
import os1 from "os";
import os2 from "node:os";
import path1 from "path";
import path2 from "node:path";
import { randomUUID as uuid1 } from "crypto";
import { randomUUID as uuid2 } from "node:crypto";
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;

fs1.realpathSync(raw) satisfies B.AbsolutePath;
fs2.realpathSync(raw) satisfies B.AbsolutePath;
fs1.realpathSync(raw, "buffer") satisfies Buffer;
fs2.realpathSync(raw, "buffer") satisfies Buffer;
fs1.statSync(raw).size satisfies B.Bytes;
fs2.statSync(raw).size satisfies B.Bytes;
(async () => {
	(await fsp1.realpath(raw)) satisfies B.AbsolutePath;
	(await fsp2.realpath(raw)) satisfies B.AbsolutePath;
})();
os1.homedir() satisfies B.AbsolutePath;
os2.homedir() satisfies B.AbsolutePath;
path1.resolve(raw) satisfies B.AbsolutePath;
path2.resolve(raw) satisfies B.AbsolutePath;
uuid1() satisfies B.UUID;
uuid2() satisfies B.UUID;

import { fileURLToPath as f1 } from "url";
import { fileURLToPath as f2 } from "node:url";
import { findPackageJSON as m1 } from "module";
import { findPackageJSON as m2 } from "node:module";
import { performance as p1 } from "perf_hooks";
import { performance as p2 } from "node:perf_hooks";
import { isIPv4 as n1 } from "net";
import { isIPv4 as n2 } from "node:net";
import { resolve4 as d1 } from "dns/promises";
import { resolve4 as d2 } from "node:dns/promises";
import { executionAsyncId as a1 } from "async_hooks";
import { executionAsyncId as a2 } from "node:async_hooks";
import dgram1 from "dgram";
import dgram2 from "node:dgram";

f1(raw) satisfies B.AbsolutePath;
f2(raw) satisfies B.AbsolutePath;
m1(raw) satisfies B.AbsolutePath | undefined;
m2(raw) satisfies B.AbsolutePath | undefined;
p1.now() satisfies B.PerformanceTimestamp;
p2.now() satisfies B.PerformanceTimestamp;
if (n1(raw)) raw satisfies B.IPv4;
if (n2(raw)) raw satisfies B.IPv4;
(async () => {
	(await d1(raw)) satisfies B.IPv4[];
	(await d2(raw)) satisfies B.IPv4[];
})();
a1() satisfies B.AsyncId;
a2() satisfies B.AsyncId;

dgram1.createSocket("udp4").address().address satisfies B.IPv4 | B.IPv6;
dgram2.createSocket("udp4").address().address satisfies B.IPv4 | B.IPv6;
