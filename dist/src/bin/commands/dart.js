"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDart = void 0;
const path_1 = require("path");
const read_pkg_up_1 = require("read-pkg-up");
// eslint-disable-next-line import/extensions
const _createFile_1 = require("./../../core/utils/_createFile");
const dartsPath = './outputs/fireschema.dart';
const generateDart = async (path, filePath) => {
    const pkg = await (0, read_pkg_up_1.readPackageUp)({ cwd: (0, path_1.dirname)(path) });
    const isEsm = (pkg === null || pkg === void 0 ? void 0 : pkg.packageJson.type) === 'module';
    const dartsPath_ = filePath === undefined ? dartsPath : filePath;
    const schemaPath = (0, path_1.resolve)(path);
    const schemaModule = await Promise.resolve().then(() => require(schemaPath));
    const srcDir = isEsm
        ? '../..' // esm/src/bin/commands to esm/src
        : '../../../../dist/src'; // esm/src/bin/commands to dist/src
    const rendererPath = `${srcDir}/core/firestore/_renderer/root_dart.js`;
    const rendererModule = await Promise.resolve().then(() => require(rendererPath));
    const rendered = rendererModule.renderSchema(schemaModule.default.default || schemaModule.default);
    (0, _createFile_1.createFile)(rendered, dartsPath_);
    console.log('🎉 Generated dart!');
};
exports.generateDart = generateDart;
