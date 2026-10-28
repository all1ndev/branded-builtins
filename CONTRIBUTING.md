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
| `src/dom/index.ts`, `src/dom/common.ts` | DOM augmentations; `common.ts` holds the ones Node shares and is loaded by the node entries |
| `src/node22/common.ts` | Overloads shared by `@types/node` 22 and 24, which declare modules under bare names (`"fs"`) |
| `src/node22`, `src/node24` | Build on `node22/common.ts`, plus what differs per version |
| `src/node26/index.ts` | `@types/node` 26 declares modules under `"node:fs"`, so it's a separate copy |
| `src/node-globals.ts`, `src/node-types.ts` | Globals and helper types shared by the node entries |
| `test/` | Type-level tests (`satisfies`, `@ts-expect-error`) and `runtime.mjs` |

Each folder has its own `tsconfig.json`, so editors check it against the right `lib` and `@types/node`.

## Adding a brand

1. Add the brand type to `src/index.ts`.
2. Add the overload to every entry that has the API. For Node, that's `src/node22/common.ts` and `src/node26/index.ts`, with the module named as each version declares it.
3. Add only APIs the entry's `lib` or `@types/node` already declares. An overload for a missing method silently creates it.
4. Add a `satisfies` line to the tests, and a `@ts-expect-error` line for the plain case that must stay unbranded.
5. If the brand claims a runtime fact (a path is absolute, a value is in kilobytes), check it in `test/runtime.mjs`.
6. List it in `API.md`.

## Adding a Node version

1. `npm i -D @typesNN/node@npm:@types/node@NN`
2. If its layout matches the previous version, create `src/nodeNN/index.ts` that loads the previous entry plus the new APIs. Otherwise copy the closest entry.
3. Add `src/nodeNN/tsconfig.json` with `typeRoots` pointing at `@typesNN`, and the project to `scripts/build.sh`.
4. Add test projects for it to `scripts/test.sh`, and `@ts-expect-error` lines for any API the new version removed.
5. Add the export to `package.json`, widen the `@types/node` peer range, and add the version to the CI matrix.
