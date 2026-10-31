#!/bin/sh
# Type-checks every test project with TypeScript 7 and with the latest TypeScript 5.
set -e
projects="
test
test/tsconfig.node24.json
test/tsconfig.node22.json
test/node-dom
test/node-dom/tsconfig.node24.json
test/node-dom/tsconfig.node22.json
test/node-dom/tsconfig.no-dom-entry.json
test/ts-reset
test/dom
test/es2024
test/esnext
test/root
test/declaration
"
for compiler in typescript typescript5; do
	echo "$compiler $(node "node_modules/$compiler/bin/tsc" -v)"
	for project in $projects; do
		# TypeScript 5 has no es2025 lib and no esnext Uint8Array base64 methods.
		if [ "$compiler" = typescript5 ] && [ "$project" = test/esnext ]; then continue; fi
		node "node_modules/$compiler/bin/tsc" -p "$project"
	done
done
node test/runtime.mjs
