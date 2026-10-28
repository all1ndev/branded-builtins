# CLAUDE.md

Types-only package that brands JavaScript, DOM and Node.js built-ins through declaration merging.

## Where to look

| For                                                                  | Read              |
| -------------------------------------------------------------------- | ----------------- |
| Layout, how node entries share files, adding a brand or Node version | `CONTRIBUTING.md` |
| Every branded API, per entry                                         | `API.md`          |
| Setup, entries, compatibility and versioning promises                | `README.md`       |
| The brand types                                                      | `src/index.ts`    |

## Not written down elsewhere

- Run `npm test` before reporting done, and `npm run format` after editing.
- Call compilers by path: `node node_modules/typescript/bin/tsc` (TypeScript 7) or `node node_modules/typescript5/bin/tsc`. `npx tsc` runs TypeScript 5 because both packages claim `.bin/tsc`.
- Check an API's signature in the installed lib files (`node_modules/@typescript/*/lib`, `node_modules/typescript5/lib`) and `node_modules/@types{22,24,26}/node`, not from memory.
- Augment the module that declares the API, not the one re-exporting it: `"fs"` in `@types/node` 22/24, `"node:fs"` in 26. Augmenting the re-exporter shadows the original overloads.
- Properties can't be retyped: brand returned objects with an intersection (`Stats & { size: Bytes }`), and skip APIs exposed only as properties.
- A new `@ts-expect-error` must fail for the intended reason: replace each with a marker, compile, and count the errors.
- TypeScript 5.9 has no `es2025` lib or esnext `Uint8Array` base64 methods, so `test/esnext` runs on TypeScript 7 only.
- Commit and push only when asked. The user runs `npm publish` (it needs their one-time password).
