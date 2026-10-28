// Works alongside @total-typescript/ts-reset: both packages' overloads apply.
import "@total-typescript/ts-reset";
import path from "node:path";
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;

JSON.parse(raw) satisfies unknown;
// @ts-expect-error ts-reset makes JSON.parse return unknown
JSON.parse(raw).anything;
JSON.stringify({}) satisfies B.Json;
[1, undefined].filter(Boolean) satisfies number[];
path.resolve(raw) satisfies B.AbsolutePath;
Date.now() satisfies B.EpochMilliseconds;
