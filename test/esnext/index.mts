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

declare const duration: Temporal.Duration;
duration.total("minutes") satisfies B.Minutes;
duration.total("second") satisfies B.Seconds;
duration.total({ unit: "milliseconds" }) satisfies B.Milliseconds;
duration.total({ unit: "microsecond", relativeTo: "2026-01-01" }) satisfies B.Microseconds;
duration.total("nanoseconds") satisfies B.Nanoseconds;
duration.total("hours") satisfies number;
// @ts-expect-error
duration.total("hours") satisfies B.Minutes;
// @ts-expect-error
duration.total("seconds") satisfies B.Milliseconds;
Temporal.Now.timeZoneId() satisfies B.TimeZoneId;
new Intl.Locale(raw).getTimeZones() satisfies B.TimeZoneId[] | undefined;
// @ts-expect-error
Temporal.Now.instant().toString() satisfies B.TimeZoneId;
