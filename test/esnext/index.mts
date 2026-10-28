// The esnext entry on its own: es2025 and esnext APIs. Needs TypeScript 7.
import type * as B from "@all1ndev/branded-builtins";

declare const raw: string;
declare const bytes: Uint8Array;

RegExp.escape(raw) satisfies B.RegExpSource;
// @ts-expect-error
raw satisfies B.RegExpSource;

bytes.toBase64() satisfies B.Base64;
bytes.toBase64({ omitPadding: true }) satisfies B.Base64;
bytes.toBase64({ alphabet: "base64url" }) satisfies B.Base64Url;
// @ts-expect-error
bytes.toBase64({ alphabet: "base64url" }) satisfies B.Base64;
bytes.toHex() satisfies B.Hex;
