#!/bin/sh

FILE=node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js

sed -i.bak -e \
 's#^"use strict";$#"use strict";require ("../../../../emulator-proxyer");#' \
 $FILE

rm $FILE.bak
