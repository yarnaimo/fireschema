import { dirname as __getDirname__ } from 'path';
import { fileURLToPath as __fileURLToPath__ } from 'url';
const __dirname = __getDirname__(__fileURLToPath__(import.meta.url));
import { dirname, resolve } from 'path';
import { readPackageUp } from 'read-pkg-up';
// eslint-disable-next-line import/extensions
import { createFile } from './../../core/utils/_createFile';
const rulesPath = './outputs/firestore.rules';
export const generateRules = async (path) => {
    const pkg = await readPackageUp({ cwd: dirname(path) });
    const isEsm = (pkg === null || pkg === void 0 ? void 0 : pkg.packageJson.type) === 'module';
    const schemaPath = resolve(path);
    const schemaModule = await import(schemaPath);
    const srcDir = isEsm
        ? '../..' // esm/src/bin/commands to esm/src
        : '../../../../dist/src'; // esm/src/bin/commands to dist/src
    const rendererPath = `${srcDir}/core/firestore/_renderer/root.js`;
    const rendererModule = await import(rendererPath);
    const rendered = rendererModule.renderSchema(schemaModule.default.default || schemaModule.default);
    createFile(rendered, rulesPath);
    console.log('🎉 Generated firestore.rules');
};
