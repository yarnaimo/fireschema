/* eslint-disable import/extensions */
import getopts from 'getopts';
import { generateDart } from './commands/dart';
import { exportFunctions } from './commands/export.js';
import { generateRules } from './commands/rules.js';
const help = `Usage:
fireschema rules <schema-path>          generate firestore.rules
fireschema export <functions-dir-path>  create functions entrypoint file`;
export const cli = async () => {
    const { _: [command, ...args], esm, output, } = getopts(process.argv.slice(2), {
        alias: { output: 'o' },
        boolean: ['esm'],
    });
    switch (command) {
        case 'rules':
            if (!args[0]) {
                console.error('Schema path must be specified');
                process.exit(1);
            }
            void generateRules(args[0], args[1]);
            break;
        case 'export':
            if (!args[0]) {
                console.error('A target directory must be specified');
                process.exit(1);
            }
            void exportFunctions(args[0], esm, output);
            break;
        case 'dart':
            if (!args[0]) {
                console.error('A target directory must be specified');
                process.exit(1);
            }
            void generateDart(args[0], args[1]);
            break;
        case '--help':
            console.log(help);
            break;
        default:
            console.log(help);
            process.exit(1);
    }
};
