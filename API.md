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

| Group     | Brand                                                                                | Meaning                                                                   |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Paths     | `AbsolutePath`                                                                       | A path `path.isAbsolute()` accepts                                        |
| Files     | `FileDescriptor`                                                                     | A file descriptor                                                         |
|           | `FileMode`                                                                           | File type and permission bits                                             |
| Time      | `EpochMilliseconds`                                                                  | Milliseconds since the Unix epoch (wall clock)                            |
|           | `PerformanceTimestamp`                                                               | Milliseconds since `performance.timeOrigin` (monotonic clock)             |
|           | `Hours`, `Minutes`, `Seconds`, `Milliseconds`, `Microseconds`, `Nanoseconds`         | Durations                                                                 |
|           | `BigIntNanoseconds`                                                                  | A duration in nanoseconds, as a `bigint`                                  |
| Size      | `Bytes`, `Kilobytes`                                                                 | Amounts of memory or data                                                 |
| Numbers   | `Finite`, `Integer`, `SafeInteger`                                                   | Stacked: a `SafeInteger` is also an `Integer`, which is also `Finite`     |
|           | `Uint32`                                                                             | An integer from 0 to 2³² − 1, also a `SafeInteger`                        |
|           | `ZeroBased`, `OneBased`                                                              | A line or column number counted from 0 or from 1, also a `SafeInteger`    |
| Encodings | `Hex`, `Base64`, `Base64Url`                                                         | Binary data as text                                                       |
|           | `Json`                                                                               | Output of `JSON.stringify`                                                |
|           | `EncodedUriComponent`, `EncodedUri`                                                  | Output of `encodeURIComponent`, `encodeURI`                               |
|           | `AbsoluteUrl`                                                                        | A serialized `URL`                                                        |
|           | `DataUrl`                                                                            | A `data:` URL, also an `AbsoluteUrl`                                      |
|           | `FormUrlEncoded`                                                                     | Output of `URLSearchParams#toString`                                      |
|           | `Pem`                                                                                | PEM-encoded keys or certificates                                          |
|           | `ColonHexFingerprint`                                                                | A certificate fingerprint: `AB:CD:…`                                      |
|           | `IsoUtcString`                                                                       | `YYYY-MM-DDTHH:mm:ss.sssZ`, also an `IsoInstant`                          |
|           | `IsoInstant`, `IsoDate`, `IsoTime`, `IsoDateTime`, `IsoZonedDateTime`, `IsoDuration` | Temporal's ISO 8601 strings: `2026-01-01T12:00:00Z`, `2026-01-01`, `PT1H` |
|           | `NfcString`, `NfdString`, `NfkcString`, `NfkdString`                                 | A Unicode-normalized string                                               |
|           | `WellFormedString`                                                                   | A string without lone surrogates                                          |
|           | `RegExpSource`                                                                       | A pattern that matches a string literally                                 |
|           | `HttpDate`                                                                           | `Www, DD Mmm YYYY HH:mm:ss GMT`                                           |
|           | `CssIdentifier`                                                                      | Output of `CSS.escape`                                                    |
| Identity  | `UUID`                                                                               | A random UUID                                                             |
|           | `Uid`, `Gid`                                                                         | A user or group id                                                        |
|           | `AsyncId`                                                                            | An `async_hooks` id                                                       |
|           | `TimerId`, `AnimationFrameId`, `IdleCallbackId`                                      | A DOM timer, animation frame or idle callback handle                      |
|           | `Pointer`                                                                            | A native memory address from `node:ffi`, as a `bigint`                    |
| Locales   | `LanguageTag`                                                                        | A canonical BCP 47 locale identifier                                      |
|           | `TimeZoneId`                                                                         | A time zone `Intl` and Temporal accept                                    |
|           | `CurrencyCode`                                                                       | An uppercase ISO 4217 code: `USD`                                         |
| Network   | `IPv4`, `IPv6`                                                                       | An IP address                                                             |
|           | `Cidr`                                                                               | An IP address with a prefix length                                        |
|           | `MacAddress`                                                                         | `xx:xx:xx:xx:xx:xx`, lowercase                                            |
|           | `Port`                                                                               | A port from 0 to 65535, also a `SafeInteger`                              |
|           | `HeaderName`, `LowercaseHeaderName`                                                  | An HTTP header name; a `LowercaseHeaderName` is also a `HeaderName`       |

## `es2024`

Also loaded by `es2025` and `esnext`.

| API                                                                                                                                                             | Returns                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Date.now()`, `Date.parse()`, `Date.UTC()`                                                                                                                      | `EpochMilliseconds`                                  |
| `Date#getTime()`, `Date#valueOf()`                                                                                                                              | `EpochMilliseconds`                                  |
| `Date#toISOString()`, `Date#toJSON()`                                                                                                                           | `IsoUtcString`                                       |
| `Date#getTimezoneOffset()`                                                                                                                                      | `Minutes`                                            |
| `Date#setTime()` and every other `Date#set…()` method                                                                                                           | `EpochMilliseconds`                                  |
| `Date#toUTCString()`                                                                                                                                            | `HttpDate`                                           |
| `String#normalize()`, `normalize("NFC")`                                                                                                                        | `NfcString`                                          |
| `String#normalize("NFD" \| "NFKC" \| "NFKD")`                                                                                                                   | `NfdString`, `NfkcString`, `NfkdString`              |
| `String#toWellFormed()`                                                                                                                                         | `WellFormedString`                                   |
| `String#isWellFormed()`                                                                                                                                         | Type guard: `this is WellFormedString`               |
| `Number.isFinite(x)`, `Number.isInteger(x)`, `Number.isSafeInteger(x)`                                                                                          | Type guards: `x is Finite`, `Integer`, `SafeInteger` |
| `Math.floor()`, `Math.ceil()`, `Math.round()`, `Math.trunc()` given a `Finite`                                                                                  | `Integer`                                            |
| `Math.clz32()`, `Math.imul()`, `DataView#getInt8/16/32()`, `getUint8/16/32()`                                                                                   | `SafeInteger`                                        |
| `Intl.getCanonicalLocales()`, `Intl.Locale#toString()`                                                                                                          | `LanguageTag`                                        |
| `resolvedOptions().locale` of `Intl.Collator`, `DateTimeFormat`, `DisplayNames`, `ListFormat`, `NumberFormat`, `PluralRules`, `RelativeTimeFormat`, `Segmenter` | `LanguageTag`                                        |
| `Intl.Collator`, `DateTimeFormat`, `NumberFormat`, `PluralRules`: `.supportedLocalesOf()`                                                                       | `LanguageTag[]`                                      |
| `Intl.supportedValuesOf("currency")`, `Intl.NumberFormat#resolvedOptions().currency`                                                                            | `CurrencyCode`                                       |
| `Intl.supportedValuesOf("timeZone")`, `Intl.DateTimeFormat#resolvedOptions().timeZone`                                                                          | `TimeZoneId`                                         |
| `JSON.stringify()`                                                                                                                                              | `Json`                                               |
| `encodeURIComponent()`, `encodeURI()`                                                                                                                           | `EncodedUriComponent`, `EncodedUri`                  |
| `Array#indexOf()`, `lastIndexOf()`, `findIndex()`, `findLastIndex()`, `push()`, `unshift()`, and the same search methods on `ReadonlyArray`                     | `SafeInteger`                                        |
| `String#indexOf()`, `lastIndexOf()`, `search()` with a string or `RegExp`, `codePointAt()`                                                                      | `SafeInteger` (`\| undefined` for `codePointAt()`)   |

The other formatters' `supportedLocalesOf()` stay plain: their constructors are anonymous types, which can't be augmented. Typed arrays and `Buffer` keep plain `indexOf()` results.

`Date.parse()`, `Date#getTime()` and the setters return `NaN` for an invalid date, `Date#toUTCString()` returns `"Invalid Date"`, and `Date#toJSON()` returns `null`: the brand marks the unit or format, not validity. `Date#toISOString()` throws instead, so its brand always holds.

## `es2025`

Also loaded by `esnext`. Needs TypeScript 7, since TypeScript 5.9 has no `es2025` lib.

| API                                            | Returns        |
| ---------------------------------------------- | -------------- |
| `RegExp.escape()`                              | `RegExpSource` |
| `Intl.DurationFormat#resolvedOptions().locale` | `LanguageTag`  |

## `esnext`

Needs TypeScript 7.

| API                                                                                                                                   | Returns                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Uint8Array#toBase64()`, `toBase64({ alphabet: "base64" })`                                                                           | `Base64`                                                                             |
| `Uint8Array#toBase64({ alphabet: "base64url" })`                                                                                      | `Base64Url`                                                                          |
| `Uint8Array#toHex()`                                                                                                                  | `Hex`                                                                                |
| `Temporal.Duration#total("minutes")`, and `"seconds"`, `"milliseconds"`, `"microseconds"`, `"nanoseconds"`, singular or as `{ unit }` | `Minutes`, `Seconds`, `Milliseconds`, `Microseconds`, `Nanoseconds`                  |
| `Temporal.Now.timeZoneId()`, `Intl.Locale#getTimeZones()`                                                                             | `TimeZoneId`                                                                         |
| `Temporal.Duration#total("hours")`, singular or as `{ unit }`                                                                         | `Hours`                                                                              |
| `toString()` and `toJSON()` of `Temporal.Instant`, `PlainDate`, `PlainTime`, `PlainDateTime`, `ZonedDateTime`, `Duration`             | `IsoInstant`, `IsoDate`, `IsoTime`, `IsoDateTime`, `IsoZonedDateTime`, `IsoDuration` |

`toString()` with options stays plain, since options can drop the offset, time zone or seconds.

## `dom`

| API                                                                                                                                                                                         | Returns                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `performance.now()`                                                                                                                                                                         | `PerformanceTimestamp`                 |
| `performance.mark().startTime`, `performance.measure().startTime`                                                                                                                           | `PerformanceTimestamp`                 |
| `performance.measure().duration`                                                                                                                                                            | `Milliseconds`                         |
| `performance.getEntries…()`, `PerformanceObserverEntryList#getEntries…()`, `PerformanceObserver#takeRecords()`: `.startTime`, `.duration`                                                   | `PerformanceTimestamp`, `Milliseconds` |
| `IdleDeadline#timeRemaining()`                                                                                                                                                              | `Milliseconds`                         |
| `TimeRanges#start()`, `end()` (`media.buffered`, `.played`, `.seekable`), `SVGAnimationElement#getCurrentTime()`, `getStartTime()`, `getSimpleDuration()`, `SVGSVGElement#getCurrentTime()` | `Seconds`                              |
| `performance.getEntriesByType("resource")`, `PerformanceObserverEntryList#getEntriesByType("resource")`: `.transferSize`, `.encodedBodySize`, `.decodedBodySize`                            | `Bytes`                                |
| `AudioContext#getOutputTimestamp()`: `.contextTime`, `.performanceTime`                                                                                                                     | `Seconds`, `PerformanceTimestamp`      |
| `AudioData#allocationSize()`, `VideoFrame#allocationSize()`, `TextEncoder#encodeInto().written`, `navigator.storage.estimate()`: `.usage`, `.quota`                                         | `Bytes`                                |
| `TextDecoder#decode()`, `Blob#text()`, `Response#text()`, `Request#text()`                                                                                                                  | `WellFormedString`                     |
| `CSS.escape()`                                                                                                                                                                              | `CssIdentifier`                        |
| `crypto.randomUUID()`                                                                                                                                                                       | `UUID`                                 |
| `btoa()`                                                                                                                                                                                    | `Base64`                               |
| `atob()`                                                                                                                                                                                    | `WellFormedString`                     |
| `URL#toString()`, `URL#toJSON()`, `location.toString()`, `import.meta.resolve()`                                                                                                            | `AbsoluteUrl`                          |
| `URLSearchParams#toString()`                                                                                                                                                                | `FormUrlEncoded`                       |

`mark()` and `measure()` keep `startTime` branded only when a start time you pass is a `PerformanceTimestamp` (or a mark name). Given a plain number, `startTime` is that number, so only `measure().duration` stays branded.

The global `setTimeout()` and `setInterval()` stay plain: in a project that also loads `@types/node`, they may be Node's, which return a `Timeout` object. `crypto.subtle.exportKey("jwk")` stays plain, in the DOM and in Node, because its original overload has a literal parameter. `URL.createObjectURL()` stays plain because it's a static method.

## `node22`, `node24`, `node26`

The same overloads for each Node version, except where noted. Both import names work: `fs` and `node:fs`, `path` and `node:path`, and so on.

### Paths

| API                                                                                                         | Returns                         |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `path.resolve()`, `process.cwd()`, `os.homedir()`, `os.tmpdir()`, `os.userInfo().homedir`                   | `AbsolutePath`                  |
| `url.fileURLToPath()`, `module.findPackageJSON()`, `module.getCompileCacheDir()`, `require.resolve.paths()` | `AbsolutePath`                  |
| `module.enableCompileCache().directory`                                                                     | `AbsolutePath \| undefined`     |
| `fs.realpathSync()`, `fs.realpathSync.native()`, `fs/promises.realpath()`                                   | `AbsolutePath`                  |
| `sqlite` `DatabaseSync#location()`                                                                          | `AbsolutePath \| null`          |
| `path.isAbsolute(p)`                                                                                        | Type guard: `p is AbsolutePath` |

Given an `AbsolutePath`, these keep the brand: `path.join()`, `path.normalize()`, `path.dirname()`, `path.toNamespacedPath()`, `path.parse().dir` and `.root`, `fs.mkdtempSync()`, `fs.mkdirSync(…, { recursive: true })`, `fs/promises.mkdtemp()`, `fs/promises.mkdir(…, { recursive: true })`, and in `node24`+ `fs.mkdtempDisposableSync().path` and `fs/promises.mkdtempDisposable().path`. `path.posix` and `path.win32` get the same overloads.

The fs path APIs are branded only with no encoding or a text one (`"utf8"`, `"latin1"`, `"ascii"`): `realpathSync(p, "hex")` is a hex string, not a path.

### Files

| API                                                                                                                                  | Returns                  |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `fs.openSync()`, `fs/promises.open().fd`                                                                                             | `FileDescriptor`         |
| `fs.readSync()`, `fs.writeSync()`, `fs.readvSync()`, `fs.writevSync()`                                                               | `Bytes`                  |
| `FileHandle#read().bytesRead`, `FileHandle#write().bytesWritten`, `FileHandle#readv().bytesRead`, `FileHandle#writev().bytesWritten` | `Bytes`                  |
| `fs.statSync()`, `fs.lstatSync()`, `fs.fstatSync()`, `fs/promises.stat()`, `lstat()`, `FileHandle#stat()`: `.size`, `.blksize`       | `Bytes`                  |
| The same stats: `.atimeMs`, `.mtimeMs`, `.ctimeMs`, `.birthtimeMs`                                                                   | `EpochMilliseconds`      |
| The same stats: `.mode`, `.uid`, `.gid`                                                                                              | `FileMode`, `Uid`, `Gid` |
| `fs.statfsSync()`, `fs/promises.statfs()`: `.bsize`, and `.frsize` in `node24`+                                                      | `Bytes`                  |
| `fs.openAsBlob().size`, `buffer.resolveObjectURL().size`                                                                             | `Bytes`                  |
| `process.umask()`                                                                                                                    | `FileMode`               |

Stats with `bigint: true` stay unbranded.

### Text and encodings

| API                                                                                                                                                                                                                              | Returns                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `Buffer#toString("hex" \| "base64" \| "base64url")`                                                                                                                                                                              | `Hex`, `Base64`, `Base64Url`                     |
| `Buffer#toString()`, and with `"utf8"`, `"latin1"`, `"binary"` or `"ascii"`                                                                                                                                                      | `WellFormedString`                               |
| `fs.readFileSync()`, `fs/promises.readFile()`, `FileHandle#readFile()` with one of those encodings                                                                                                                               | `Hex`, `Base64`, `Base64Url`, `WellFormedString` |
| `Hash#digest(…)`, `Hmac#digest(…)`, `crypto.hash(…)` with the same encodings                                                                                                                                                     | `Hex`, `Base64`, `Base64Url`                     |
| `Sign#sign(…)`, `Cipheriv#update(…)`, `#final(…)`, `Decipheriv#update(…)`, `#final(…)`, and the `ECDH` and `DiffieHellman` key getters, `generateKeys()` and `computeSecret()`, with `"hex"`, `"base64"` or `"base64url"` output | `Hex`, `Base64`, `Base64Url`                     |
| `KeyObject#export({ format: "pem" })`, `X509Certificate#toString()`, `#toJSON()`, `tls.getCACertificates()`                                                                                                                      | `Pem`, `Pem[]`                                   |
| `KeyObject#export({ format: "jwk" })`: `.k`, `.n`, `.e`, `.d`, `.p`, `.q`, `.dp`, `.dq`, `.qi`, `.x`, `.y`                                                                                                                       | `Base64Url`                                      |
| `X509Certificate#toLegacyObject()`, `TLSSocket#getCertificate()`: `.fingerprint`, `.fingerprint256`, `.fingerprint512`                                                                                                           | `ColonHexFingerprint`                            |
| `TextDecoder#decode()`, `util.toUSVString()`, `Blob#text()`, `fetch()` responses' `text()`, `Request#text()`, and in `node24`+ `Blob#textStream()` chunks                                                                        | `WellFormedString`                               |
| `btoa()`                                                                                                                                                                                                                         | `Base64`                                         |
| `atob()`                                                                                                                                                                                                                         | `WellFormedString`                               |
| `child_process.execSync()`, `execFileSync()`, and `spawnSync()` `.stdout` / `.stderr`, with one of those encodings                                                                                                               | `Hex`, `Base64`, `Base64Url`, `WellFormedString` |
| `querystring.escape()`                                                                                                                                                                                                           | `EncodedUriComponent`                            |
| `URL#toString()`, `URL#toJSON()`, `url.format(url)` without options, `import.meta.resolve()`                                                                                                                                     | `AbsoluteUrl`                                    |
| `URLSearchParams#toString()`                                                                                                                                                                                                     | `FormUrlEncoded`                                 |
| `CPUProfileHandle#stop()` (`Worker#startCpuProfile()`), and in `node24`+ `v8.startCpuProfile().stop()`, `HeapProfileHandle#stop()`, in `node26` `v8.startHeapProfile().stop()`                                                   | `Json`                                           |

`utf16le` and `ucs2` can decode to lone surrogates, so those stay plain. `crypto.generateKeyPairSync()` with PEM encodings stays plain because its original overloads have literal parameters, and `ECDH.convertKey()` because it's a static method. `new Response(…)` in Node is undici's class, whose `text` is a property, so only responses typed as the global `Response`, like `fetch()`'s, are branded.

### Time and resources

| API                                                                                                                                                                                                                | Returns                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `perf_hooks` `performance.now()`, `.mark().startTime`, `.measure().startTime`                                                                                                                                      | `PerformanceTimestamp`                 |
| `perf_hooks` `performance.measure().duration`                                                                                                                                                                      | `Milliseconds`                         |
| `perf_hooks` `performance.getEntries…()`, `PerformanceObserverEntryList#getEntries…()`, `PerformanceObserver#takeRecords()`: `.startTime`, `.duration`                                                             | `PerformanceTimestamp`, `Milliseconds` |
| The same with `"resource"`: `.transferSize`, `.encodedBodySize`, `.decodedBodySize`                                                                                                                                | `Bytes`                                |
| `perf_hooks.eventLoopUtilization()`, `performance.eventLoopUtilization()`: `.idle`, `.active` (`node24`+)                                                                                                          | `Milliseconds`                         |
| `process.uptime()`, `os.uptime()`, `process.hrtime()[0]`                                                                                                                                                           | `Seconds`                              |
| `process.hrtime()[1]`                                                                                                                                                                                              | `Nanoseconds`                          |
| `process.hrtime.bigint()`                                                                                                                                                                                          | `BigIntNanoseconds`                    |
| `os.cpus()[i].times` fields, `net.getDefaultAutoSelectFamilyAttemptTimeout()`                                                                                                                                      | `Milliseconds`                         |
| `process.cpuUsage()`, `process.threadCpuUsage()`, `Worker#cpuUsage()`: `.user` / `.system`, `process.resourceUsage().userCPUTime` / `.systemCPUTime`                                                               | `Microseconds`                         |
| `v8.GCProfiler#stop()`: `.startTime`, `.endTime`                                                                                                                                                                   | `EpochMilliseconds`                    |
| `monitorEventLoopDelay()`: `.min`, `.max`, `.mean`, `.stddev`, `.percentile()`                                                                                                                                     | `Nanoseconds`                          |
| `monitorEventLoopDelay()`: `.minBigInt`, `.percentileBigInt()`                                                                                                                                                     | `BigIntNanoseconds`                    |
| `os.totalmem()`, `os.freemem()`, `Buffer.byteLength()`, `process.memoryUsage()` fields, `process.memoryUsage.rss()`, `process.availableMemory()`, `process.constrainedMemory()`, `Buffer#write()`, `Buffer#copy()` | `Bytes`                                |
| `v8.getHeapStatistics()`, `getHeapSpaceStatistics()`, `getHeapCodeStatistics()`, `Worker#getHeapStatistics()`, `GCProfiler#stop()` heap statistics: size fields                                                    | `Bytes`                                |
| `vm.measureMemory().total`, `crypto.getCipherInfo()` key, IV and block lengths, `crypto.secureHeapUsed()` `.total`, `.min`, `.used`                                                                                | `Bytes`                                |
| `dgram.Socket#getRecvBufferSize()`, `getSendBufferSize()`, `getSendQueueSize()`, `http2.getDefaultSettings()` and `getUnpackedSettings()` size settings                                                            | `Bytes`                                |
| `process.resourceUsage().maxRSS`                                                                                                                                                                                   | `Kilobytes`                            |
| `stream.getDefaultHighWaterMark(false)`, `getDefaultHighWaterMark(true)`                                                                                                                                           | `Bytes`, `Integer` (an object count)   |

`mark()` and `measure()` keep `startTime` branded only when a start time you pass is a `PerformanceTimestamp` (or a mark name), as in `dom`.

### Numbers and identity

| API                                                                                                                                                  | Returns             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `crypto.randomInt()`, `os.availableParallelism()`, `Buffer#readInt…()` / `readUInt…()`                                                               | `SafeInteger`       |
| `zlib.crc32()`, `v8.cachedDataVersionTag()`, `node26` `ffi.getUint32()`                                                                              | `Uint32`            |
| `sqlite` `StatementSync#run()` and in `node24`+ `SQLTagStore#run()`: `.changes`, `.lastInsertRowid`                                                  | `Integer \| bigint` |
| `tty.WriteStream#getWindowSize()`, `node:test` `callCount()`, `accessCount()`, `dgram.Socket#getSendQueueCount()`, the `number_of_…` heap statistics | `Integer`           |
| `readline.Interface#getCursorPos()`, `module.SourceMap#findEntry()` line and column fields                                                           | `ZeroBased`         |
| `module.SourceMap#findOrigin()`, `util.getCallSites()`: `.lineNumber`, `.columnNumber`                                                               | `OneBased`          |
| `crypto.randomUUID()`, `crypto.webcrypto.randomUUID()`, global `crypto.randomUUID()`, and in `node24`+ `crypto.randomUUIDv7()`                       | `UUID`              |
| `os.userInfo().uid` / `.gid`                                                                                                                         | `Uid`, `Gid`        |
| `async_hooks.executionAsyncId()`, `triggerAsyncId()`, `AsyncResource#asyncId()`, `AsyncResource#triggerAsyncId()`, `Timeout[Symbol.toPrimitive]()`   | `AsyncId`           |
| `node26` `ffi.dlsym()`, `DynamicLibrary#getSymbol()`, `getSymbols()`, `registerCallback()`, `ffi.getRawPointer()`, `getCurrentEventLoop()`           | `Pointer`           |

### Network

| API                                                                                                                                                                                                    | Returns                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `net.isIPv4(s)`, `net.isIPv6(s)`                                                                                                                                                                       | Type guards: `s is IPv4`, `s is IPv6` |
| `dns/promises.resolve4()`, `resolve6()`, `resolve(…, "A" \| "AAAA")`, and `Resolver` methods                                                                                                           | `IPv4[]`, `IPv6[]`                    |
| `dns/promises.resolve4/6(…, { ttl: true })[i]`: `.address`, `.ttl`                                                                                                                                     | `IPv4`, `IPv6`, `Seconds`             |
| `dns/promises.resolveSoa()`: `.refresh`, `.retry`, `.expire`, `.minttl`                                                                                                                                | `Seconds`                             |
| `dns/promises.resolveSrv()[i].port`                                                                                                                                                                    | `Port`                                |
| `dns/promises.lookup().address`                                                                                                                                                                        | `IPv4 \| IPv6`                        |
| `os.networkInterfaces()[name][i]`: `.address`, `.netmask`                                                                                                                                              | `IPv4` or `IPv6`, by `family`         |
| `os.networkInterfaces()[name][i]`: `.mac`, `.cidr`                                                                                                                                                     | `MacAddress`, `Cidr \| null`          |
| `net.Server#address()`, `net.Socket#address()`, `dgram.Socket#address()`, `dgram.Socket#remoteAddress()`, and in `node24`+ `net.BoundSocket#address()`, `dgram.Socket#bindSync()`: `.address`, `.port` | `IPv4 \| IPv6`, `Port`                |
| `X509Certificate#checkIP()`                                                                                                                                                                            | `IPv4 \| IPv6 \| undefined`           |
| `OutgoingMessage#getHeaderNames()` (`ServerResponse`, `ClientRequest`), `Http2ServerResponse#getHeaderNames()`                                                                                         | `LowercaseHeaderName[]`               |
| `ClientRequest#getRawHeaderNames()`                                                                                                                                                                    | `HeaderName[]`                        |
| `http.validateHeaderName(name)`                                                                                                                                                                        | Assertion: `name is HeaderName`       |

`dns/promises.resolve(…, "SOA" \| "SRV")` and `TLSSocket#getPeerCertificate()` stay plain: their original overloads have literal parameters, which TypeScript always tries first. In `node26`, `node:vfs` methods are picked from `node:fs`, so they inherit its brands: `vfs.openSync()` returns a `FileDescriptor` that only that virtual file system accepts.
