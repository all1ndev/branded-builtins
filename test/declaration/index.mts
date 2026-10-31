// Inferred branded types must stay nameable in a library's declaration files.
import fs from "node:fs";
import os from "node:os";
import v8 from "node:v8";

export const stats = fs.statSync("x");
export const size = fs.statSync("x").size;
export const uid = os.userInfo().uid;
export const heap = v8.getHeapStatistics();
export const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
