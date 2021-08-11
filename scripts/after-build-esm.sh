#!/bin/sh
yarn add-import-extension esm

BIN_MAIN=esm/bin/main.js
chmod +x $BIN_MAIN
sed -i.bak '2d;4d' $BIN_MAIN
rm $BIN_MAIN.bak

POLYFILL="import { dirname as __getDirname__ } from 'path';\nimport { fileURLToPath as __fileURLToPath__ } from 'url';\nconst __dirname = __getDirname__(__fileURLToPath__(import.meta.url));\n"
for f in `find esm/bin/commands -name '*.js'`; do
  sed -i.bak "1s/^/${POLYFILL}/" $f
  rm $f.bak
done

for f in `find esm -name '*.js'`; do
  sed -i.bak "s#import \* as functions from 'firebase-functions'#import functions from 'firebase-functions'#" $f
  rm $f.bak
done
