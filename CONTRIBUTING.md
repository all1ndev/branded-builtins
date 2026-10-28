# Contributing

```sh
npm install
npm test   # builds dist/, type-checks every test project with TypeScript 7 and 5, runs runtime checks
```

## Layout

| Path | What |
| --- | --- |
| `src/index.ts` | The brand types (root entry) |
| `src/es2024`, `src/es2025`, `src/esnext` | ES lib augmentations; each loads the one below |
| `src/dom/index.ts` | DOM-only augmentations |
| `src/shared/web.ts` | Web API augmentations both the DOM lib and @types/node declare; loaded by the dom and node entries |
| `src/node/globals.ts` | Global overloads (`Buffer`, `process`, `btoa`) shared by every node entry |
| `src/node/bare-modules.ts` | Module overloads shared by versions that declare modules under bare names (`"fs"`): 22 and 24 |
| `src/node/types.ts` | Helper types for the node entries |
| `src/node22`, `src/node24`, `src/node26` | One entry per `@types/node` major: the shared files it needs, plus what only that version has. 26 declares modules under `"node:fs"`, so its module overloads live in its own file |
| `test/` | Type-level tests (`satisfies`, `@ts-expect-error`) and `runtime.mjs` |

Each folder has its own `tsconfig.json`, so editors check it against the right `lib` and `@types/node`.

ES entries build on each other in a chain, because ES and web APIs are never removed. Node entries share files as a tree instead: each entry loads the shared files it needs, never another entry. A Node version can remove an API, so when one does, move that overload out of the shared file into the entries of the older versions that still have it.

## Adding a brand

1. Add the brand type to `src/index.ts`.
2. Add the overload where every version that has the API loads it. For Node, that's usually `src/node/bare-modules.ts` (or `globals.ts`) plus `src/node26/index.ts`, with the module named as each version declares it.
3. Add only APIs the entry's `lib` or `@types/node` already declares. An overload for a missing method silently creates it.
4. Add a `satisfies` line to the tests, and a `@ts-expect-error` line for the plain case that must stay unbranded.
5. If the brand claims a runtime fact (a path is absolute, a value is in kilobytes), check it in `test/runtime.mjs`.
6. List it in `API.md`.

## Adding a Node version

1. `npm i -D @typesNN/node@npm:@types/node@NN`
2. Create `src/nodeNN/index.ts` that loads the shared files matching its layout, plus its new APIs. If it shares the `"node:fs"` layout with 26, first move 26's module overloads into a shared file. For any API it removed, move that overload out of the shared file into the older entries.
3. Add `src/nodeNN/tsconfig.json` with `typeRoots` pointing at `@typesNN`, and the project to `scripts/build.sh`.
4. Add test projects for it to `scripts/test.sh`, and `@ts-expect-error` lines for any API the new version removed.
5. Add the export to `package.json`, widen the `@types/node` peer range, and add the version to the CI matrix.
