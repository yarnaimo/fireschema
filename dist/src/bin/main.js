#!/bin/sh
"use strict";
/*
":" //# ; TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true exec /usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node "$0" "$@"
*/
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node/esm");
const cli_js_1 = require("./cli.js");
void (0, cli_js_1.cli)();
