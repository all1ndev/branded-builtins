// APIs added in Node 24, checked against the node24 and node26 entries only.
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
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
