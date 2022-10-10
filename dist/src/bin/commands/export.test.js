"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_js_1 = require("./export.js");
const baseDir = './src/__tests__/_functions';
const outputPath = `${baseDir}/main.ts`;
test('cjs', async () => {
    const result = await (0, export_js_1.buildFunctionExportContent)(baseDir, false, outputPath);
    expect(result).toMatchSnapshot();
});
test('esm', async () => {
    const result = await (0, export_js_1.buildFunctionExportContent)(baseDir, true, outputPath);
    expect(result).toMatchSnapshot();
});
