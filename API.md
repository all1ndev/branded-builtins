# API reference

Every API that returns a brand, grouped by entry. Existing signatures are kept, so plain arguments work as before. Callback APIs are not branded; use the promise versions.

- [Brands](#brands)
- [`es2024`](#es2024)
- [`es2025`](#es2025)
- [`esnext`](#esnext)
- [`dom`](#dom)
- [`node22`, `node24`, `node26`](#node22-node24-node26)

## Brands

All brands are exported from the root entry: `import type { AbsolutePath } from "@all1ndev/branded-builtins"`.

| Group     | Brand                                                               | Meaning                                                               |
| --------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Paths     | `AbsolutePath`                                                      | A path `path.isAbsolute()` accepts                                    |
| Files     | `FileDescriptor`                                                    | A file descriptor                                                     |
| Time      | `EpochMilliseconds`                                                 | Milliseconds since the Unix epoch (wall clock)                        |
|           | `PerformanceTimestamp`                                              | Milliseconds since `performance.timeOrigin` (monotonic clock)         |
|           | `Minutes`, `Seconds`, `Milliseconds`, `Microseconds`, `Nanoseconds` | Durations                                                             |
|           | `BigIntNanoseconds`                                                 | A duration in nanoseconds, as a `bigint`                              |
| Size      | `Bytes`, `Kilobytes`                                                | Amounts of memory or data                                             |
| Numbers   | `Finite`, `Integer`, `SafeInteger`                                  | Stacked: a `SafeInteger` is also an `Integer`, which is also `Finite` |
| Encodings | `Hex`, `Base64`, `Base64Url`                                        | Binary data as text                                                   |
|           | `Json`                                                              | Output of `JSON.stringify`                                            |
|           | `EncodedUriComponent`, `EncodedUri`                                 | Output of `encodeURIComponent`, `encodeURI`                           |
|           | `AbsoluteUrl`                                                       | A serialized `URL`                                                    |
|           | `IsoUtcString`                                                      | `YYYY-MM-DDTHH:mm:ss.sssZ`                                            |
|           | `NfcString`, `NfdString`, `NfkcString`, `NfkdString`                | A Unicode-normalized string                                           |
|           | `WellFormedString`                                                  | A string without lone surrogates                                      |
|           | `RegExpSource`                                                      | A pattern that matches a string literally                             |
| Identity  | `UUID`                                                              | A random UUID                                                         |
|           | `Uid`, `Gid`                                                        | A user or group id                                                    |
|           | `AsyncId`                                                           | An `async_hooks` id                                                   |
| Network   | `IPv4`, `IPv6`                                                      | An IP address                                                         |

## `es2024`

Also loaded by `es2025` and `esnext`.

| API                                                                            | Returns                                              |
| ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `Date.now()`, `Date.parse()`, `Date.UTC()`                                     | `EpochMilliseconds`                                  |
| `Date#getTime()`, `Date#valueOf()`                                             | `EpochMilliseconds`                                  |
| `Date#toISOString()`, `Date#toJSON()`                                          | `IsoUtcString`                                       |
| `Date#getTimezoneOffset()`                                                     | `Minutes`                                            |
| `String#normalize()`, `normalize("NFC")`                                       | `NfcString`                                          |
| `String#normalize("NFD" \| "NFKC" \| "NFKD")`                                  | `NfdString`, `NfkcString`, `NfkdString`              |
| `String#toWellFormed()`                                                        | `WellFormedString`                                   |
| `String#isWellFormed()`                                                        | Type guard: `this is WellFormedString`               |
| `Number.isFinite(x)`, `Number.isInteger(x)`, `Number.isSafeInteger(x)`         | Type guards: `x is Finite`, `Integer`, `SafeInteger` |
| `Math.floor()`, `Math.ceil()`, `Math.round()`, `Math.trunc()` given a `Finite` | `Integer`                                            |
| `JSON.stringify()`                                                             | `Json`                                               |
| `encodeURIComponent()`, `encodeURI()`                                          | `EncodedUriComponent`, `EncodedUri`                  |

`Date.parse()` and `Date#getTime()` return `NaN` for an invalid date, and `Date#toJSON()` returns `null`: the brand marks the unit or format, not validity. `Date#toISOString()` throws instead, so its brand always holds.

## `es2025`

Also loaded by `esnext`. Needs TypeScript 7, since TypeScript 5.9 has no `es2025` lib.

| API               | Returns        |
| ----------------- | -------------- |
| `RegExp.escape()` | `RegExpSource` |

## `esnext`

Needs TypeScript 7.

| API                                                         | Returns     |
| ----------------------------------------------------------- | ----------- |
| `Uint8Array#toBase64()`, `toBase64({ alphabet: "base64" })` | `Base64`    |
| `Uint8Array#toBase64({ alphabet: "base64url" })`            | `Base64Url` |
| `Uint8Array#toHex()`                                        | `Hex`       |

## `dom`

| API                                                               | Returns                |
| ----------------------------------------------------------------- | ---------------------- |
| `performance.now()`                                               | `PerformanceTimestamp` |
| `performance.mark().startTime`, `performance.measure().startTime` | `PerformanceTimestamp` |
| `performance.measure().duration`                                  | `Milliseconds`         |
| `crypto.randomUUID()`                                             | `UUID`                 |
| `btoa()`                                                          | `Base64`               |
| `URL#toString()`, `URL#toJSON()`                                  | `AbsoluteUrl`          |

## `node22`, `node24`, `node26`

The same overloads for each Node version, except where noted. Both import names work: `fs` and `node:fs`, `path` and `node:path`, and so on.

### Paths

| API                                                                                                         | Returns                         |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `path.resolve()`, `process.cwd()`, `os.homedir()`, `os.tmpdir()`, `os.userInfo().homedir`                   | `AbsolutePath`                  |
| `url.fileURLToPath()`, `module.findPackageJSON()`, `module.getCompileCacheDir()`, `require.resolve.paths()` | `AbsolutePath`                  |
| `fs.realpathSync()`, `fs.realpathSync.native()`, `fs/promises.realpath()`                                   | `AbsolutePath`                  |
| `path.isAbsolute(p)`                                                                                        | Type guard: `p is AbsolutePath` |

Given an `AbsolutePath`, these keep the brand: `path.join()`, `path.normalize()`, `path.dirname()`, `path.toNamespacedPath()`, `path.parse().dir` and `.root`, `fs.mkdtempSync()`, `fs.mkdirSync(…, { recursive: true })`, `fs/promises.mkdtemp()`, `fs/promises.mkdir(…, { recursive: true })`, and in `node24`+ `fs.mkdtempDisposableSync().path` and `fs/promises.mkdtempDisposable().path`. `path.posix` and `path.win32` get the same overloads.

### Files

| API                                                                                                 | Returns             |
| --------------------------------------------------------------------------------------------------- | ------------------- |
| `fs.openSync()`, `fs/promises.open().fd`                                                            | `FileDescriptor`    |
| `fs.readSync()`, `fs.writeSync()`, `FileHandle#read().bytesRead`, `FileHandle#write().bytesWritten` | `Bytes`             |
| `fs.statSync()`, `fs.lstatSync()`, `fs/promises.stat()`, `lstat()`, `FileHandle#stat()`: `.size`    | `Bytes`             |
| The same stats: `.atimeMs`, `.mtimeMs`, `.ctimeMs`, `.birthtimeMs`                                  | `EpochMilliseconds` |

Stats with `bigint: true` stay unbranded.

### Time and resources

| API                                                                                                                                                                                                                | Returns                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `perf_hooks` `performance.now()`, `.mark().startTime`, `.measure().startTime`                                                                                                                                      | `PerformanceTimestamp` |
| `perf_hooks` `performance.measure().duration`                                                                                                                                                                      | `Milliseconds`         |
| `process.uptime()`, `os.uptime()`, `process.hrtime()[0]`                                                                                                                                                           | `Seconds`              |
| `process.hrtime.bigint()`                                                                                                                                                                                          | `BigIntNanoseconds`    |
| `os.cpus()[i].times` fields                                                                                                                                                                                        | `Milliseconds`         |
| `process.cpuUsage().user` / `.system`, `process.resourceUsage().userCPUTime` / `.systemCPUTime`                                                                                                                    | `Microseconds`         |
| `monitorEventLoopDelay()`: `.min`, `.max`, `.mean`, `.stddev`, `.percentile()`                                                                                                                                     | `Nanoseconds`          |
| `monitorEventLoopDelay()`: `.minBigInt`, `.percentileBigInt()`                                                                                                                                                     | `BigIntNanoseconds`    |
| `os.totalmem()`, `os.freemem()`, `Buffer.byteLength()`, `process.memoryUsage()` fields, `process.memoryUsage.rss()`, `process.availableMemory()`, `process.constrainedMemory()`, `Buffer#write()`, `Buffer#copy()` | `Bytes`                |
| `process.resourceUsage().maxRSS`                                                                                                                                                                                   | `Kilobytes`            |

### Encodings and identity

| API                                                                                                                            | Returns                      |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `Buffer#toString("hex" \| "base64" \| "base64url")`                                                                            | `Hex`, `Base64`, `Base64Url` |
| `Hash#digest(…)`, `Hmac#digest(…)`, `crypto.hash(…)` with the same encodings                                                   | `Hex`, `Base64`, `Base64Url` |
| `btoa()`                                                                                                                       | `Base64`                     |
| `crypto.randomUUID()`, `crypto.webcrypto.randomUUID()`, global `crypto.randomUUID()`, and in `node24`+ `crypto.randomUUIDv7()` | `UUID`                       |
| `crypto.randomInt()`                                                                                                           | `SafeInteger`                |
| `os.userInfo().uid` / `.gid`                                                                                                   | `Uid`, `Gid`                 |
| `async_hooks.executionAsyncId()`, `triggerAsyncId()`, `AsyncResource#asyncId()`, `AsyncResource#triggerAsyncId()`              | `AsyncId`                    |
| `URL#toString()`, `URL#toJSON()`                                                                                               | `AbsoluteUrl`                |

### Network

| API                                                                                          | Returns                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------- |
| `net.isIPv4(s)`, `net.isIPv6(s)`                                                             | Type guards: `s is IPv4`, `s is IPv6` |
| `dns/promises.resolve4()`, `resolve6()`, `resolve(…, "A" \| "AAAA")`, and `Resolver` methods | `IPv4[]`, `IPv6[]`                    |
| `dns/promises.resolve4/6(…, { ttl: true })[i].address`                                       | `IPv4`, `IPv6`                        |
| `dns/promises.lookup().address`                                                              | `IPv4 \| IPv6`                        |
| `os.networkInterfaces()[name][i].address`                                                    | `IPv4` or `IPv6`, by `family`         |
| `net.Server#address()`, `net.Socket#address()`, `dgram.Socket#address()`: `.address`         | `IPv4 \| IPv6`                        |
| `X509Certificate#checkIP()`                                                                  | `IPv4 \| IPv6 \| undefined`           |
