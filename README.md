# branded-builtins

**Nominal types for the built-in APIs you already use.**

[![npm](https://img.shields.io/npm/v/@all1ndev/branded-builtins)](https://www.npmjs.com/package/@all1ndev/branded-builtins)
[![test](https://github.com/all1ndev/branded-builtins/actions/workflows/test.yml/badge.svg)](https://github.com/all1ndev/branded-builtins/actions/workflows/test.yml)
[![license](https://img.shields.io/npm/l/@all1ndev/branded-builtins)](LICENSE)

To TypeScript, `path.resolve()`, `Date.now()` and `performance.now()` return a plain `string` or `number`, so nothing stops you from mixing them up. This package makes JavaScript, DOM and Node.js built-ins return **branded types** instead, so those mix-ups become compile errors. It ships no runtime code.

```ts
import path from "node:path";
import type { AbsolutePath, EpochMilliseconds } from "@all1ndev/branded-builtins";

function readPost(file: AbsolutePath) {}

readPost(path.resolve("posts/a.md")); // ✅
readPost(path.join(process.cwd(), "posts/a.md")); // ✅ join keeps the brand of an absolute base
readPost("posts/a.md"); // ❌ string is not an AbsolutePath

function isExpired(at: EpochMilliseconds) {}

isExpired(Date.now()); // ✅
isExpired(performance.now()); // ❌ PerformanceTimestamp is a different clock
```

In the spirit of [`@total-typescript/ts-reset`](https://github.com/total-typescript/ts-reset), and it works alongside it.

## Install

```sh
npm i -D @all1ndev/branded-builtins
```

## Setup

Add one ES entry matching your `lib`, plus one entry per host, to `tsconfig.json`:

```json
{
	"compilerOptions": {
		"lib": ["es2024"],
		"types": ["node", "@all1ndev/branded-builtins/es2024", "@all1ndev/branded-builtins/node24"]
	}
}
```

| Entry                           | Use when                          |
| ------------------------------- | --------------------------------- |
| `/es2024`, `/es2025`, `/esnext` | Your ES `lib`, see below.         |
| `/dom`                          | You use `lib: ["dom"]`.           |
| `/node22`, `/node24`, `/node26` | You use that `@types/node` major. |

A Node project that also loads the DOM lib should add `/dom` too, since `performance` and `crypto` then take DOM types. The root entry only exports the brand types and changes nothing on its own.

Pick the ES entry for your `lib`, or for your `target` when `lib` isn't set:

| Your `lib`          | ES entry      |
| ------------------- | ------------- |
| `es2024`            | `/es2024`     |
| `es2025`            | `/es2025`     |
| `esnext`            | `/esnext`     |
| Older than `es2024` | Not supported |

Each entry includes the ones below it. Never pick an entry above your `lib`: it can declare methods your runtime lacks.

## Brands

|                    | Brands                                                                                           | From, for example                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| 📁 Paths and files | `AbsolutePath`, `FileDescriptor`                                                                 | `path.resolve()`, `process.cwd()`, `fs.openSync()`                            |
| ⏱️ Time            | `EpochMilliseconds`, `PerformanceTimestamp`, `Milliseconds`, `Seconds`, `Minutes`, `Nanoseconds` | `Date.now()`, `performance.now()`, `fs.statSync().mtimeMs`                    |
| 📦 Sizes           | `Bytes`, `Kilobytes`                                                                             | `fs.statSync().size`, `Buffer.byteLength()`, `process.resourceUsage().maxRSS` |
| 🔢 Numbers         | `Finite`, `Integer`, `SafeInteger`                                                               | `Number.isSafeInteger()`, `Math.floor()`, `crypto.randomInt()`                |
| 🔤 Encodings       | `Hex`, `Base64`, `Json`, `EncodedUriComponent`, `AbsoluteUrl`, `IsoUtcString`, `NfcString`       | `hash.digest("hex")`, `JSON.stringify()`, `date.toISOString()`                |
| 🪪 Identity        | `UUID`, `Uid`, `Gid`, `AsyncId`                                                                  | `crypto.randomUUID()`, `os.userInfo().uid`                                    |
| 🌍 Locales         | `LanguageTag`, `TimeZoneId`                                                                      | `Intl.getCanonicalLocales()`, `Temporal.Now.timeZoneId()`                     |
| 🌐 Network         | `IPv4`, `IPv6`                                                                                   | `net.isIPv4()`, `dns.promises.resolve4()`                                     |

See **[API.md](API.md)** for every branded API.

## How it works

Each entry adds overloads to the built-in declarations through declaration merging. The added overloads take priority over the originals, and every original signature stays, so plain arguments still type-check. Brands are erased at compile time.

## Caveats

- **New brands can break inference.** `let p = path.resolve(x); p = "other"` stops compiling, because `p` is now an `AbsolutePath`.
- **Arithmetic drops brands.** `performance.now() - start` is a plain `number`.
- **Brands mark the unit, not validity.** `Date.parse("nope")` is still an `EpochMilliseconds` (`NaN`).
- **Properties can't be branded.** Declaration merging can't change a property's type, so `process.pid`, `import.meta.dirname` and `performance.timeOrigin` stay plain. Fields are branded only on objects an API returns.

## Compatibility

- TypeScript 5.9 or later. The `/es2025` and `/esnext` entries need TypeScript 7.
- `@types/node` 22.20.5+, 24.19.2+ or 26.6.5+, with the matching entry.
- Both `fs` and `node:fs` style imports, in ES modules and CommonJS.

## Versioning

New brands ship in minor releases. Stricter types are the point of this package, so code that relied on a plain type may need an annotation after an upgrade (see [Caveats](#caveats)). Renaming or removing an exported brand type is a major release.

## Further reading

- [Branded types in TypeScript](https://all1n.dev/posts/2026-09-25-typescript-branded-types/)
- [When to use branded types, and when not to](https://all1n.dev/posts/2026-09-25-branded-types-good-bad-use-cases/)
- [Overloading on a branded type](https://all1n.dev/posts/2026-09-25-overloading-on-a-branded-type/)

## License

[MIT](LICENSE)
