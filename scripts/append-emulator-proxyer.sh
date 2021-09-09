#!/bin/sh

FILE=node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js
MOD=../../../../esm/__tests__/_infrastructure/functions-server.js

sed -i.bak -e "s#require(frb.cwd);#require(\"${MOD}\");#" $FILE
sed -i.bak -e "s#require.resolve(frb.cwd);#require.resolve(\"${MOD}\");#" $FILE

rm $FILE.bak
