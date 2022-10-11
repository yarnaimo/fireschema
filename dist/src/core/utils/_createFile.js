"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFile = void 0;
const fs_1 = require("fs");
const createFile = (data, filePath) => {
    try {
        (0, fs_1.writeFileSync)(filePath, data);
    }
    catch (err) {
        // ディレクトリ作成できなかったとき
        if (err && err.code === 'ENOENT') {
            // ディレクトリ部分だけ切り取り
            const dir = filePath.substring(0, filePath.lastIndexOf('/'));
            // 親ディレクトリ作成
            (0, fs_1.mkdir)(dir, { recursive: true }, (error) => {
                if (error)
                    throw error;
                (0, exports.createFile)(data, filePath);
            });
            return;
        }
        console.log('created');
    }
};
exports.createFile = createFile;
