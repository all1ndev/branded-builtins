#!/bin/sh
# Builds dist/ with TypeScript 7. Each node entry is compiled against its own @types/node.
set -e
tsc() { node node_modules/typescript/bin/tsc "$@"; }
rm -rf dist
for project in src/esnext src/dom src/node22 src/node24 src/node26; do
	tsc -p "$project"
done
