#!/bin/sh

sed -i -e \
 's#^"use strict";$#"use strict";require ("../../../../emulator-proxyer");#' \
 node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js
