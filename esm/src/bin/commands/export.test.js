import { dirname as __getDirname__ } from 'path';
import { fileURLToPath as __fileURLToPath__ } from 'url';
const __dirname = __getDirname__(__fileURLToPath__(import.meta.url));
import { buildFunctionExportContent } from './export.js';
const baseDir = './src/__tests__/_functions';
const outputPath = `${baseDir}/main.ts`;
test('cjs', async () => {
    const result = await buildFunctionExportContent(baseDir, false, outputPath);
    expect(result).toMatchSnapshot();
});
test('esm', async () => {
    const result = await buildFunctionExportContent(baseDir, true, outputPath);
    expect(result).toMatchSnapshot();
});
