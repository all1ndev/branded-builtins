// The root entry exports types without augmenting anything.
import path from "node:path";
import type { AbsolutePath, Json } from "@all1ndev/branded-builtins";
import * as pkg from "@all1ndev/branded-builtins";

// @ts-expect-error
path.resolve("x") satisfies AbsolutePath;
// @ts-expect-error
JSON.stringify({}) satisfies Json;
// @ts-expect-error
pkg.brand;
