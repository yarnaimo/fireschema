#!/bin/sh
":" //# ; TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true exec /usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node "$0" "$@"
import 'ts-node/esm';
import { cli } from './cli.js';
void cli();
