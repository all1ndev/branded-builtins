// APIs added in Node 26, checked against the node26 entry only.
import ffi from "node:ffi";
import v8 from "node:v8";
import type * as B from "@all1ndev/branded-builtins";

declare const lib: ffi.DynamicLibrary;
declare const pointer: B.Pointer;
lib.getSymbol("f") satisfies B.Pointer;
lib.getSymbols()["f"] satisfies B.Pointer | undefined;
lib.registerCallback(() => {}) satisfies B.Pointer;
ffi.dlsym(lib, "f") satisfies B.Pointer;
ffi.getRawPointer(new ArrayBuffer(8)) satisfies B.Pointer;
ffi.getCurrentEventLoop() satisfies B.Pointer;
ffi.getUint32(pointer) satisfies B.Uint32;
ffi.getInt16(pointer, 2) satisfies B.SafeInteger;
// @ts-expect-error
ffi.getFloat64(pointer) satisfies B.SafeInteger;
pointer satisfies bigint;
v8.startHeapProfile().stop() satisfies B.Json;
