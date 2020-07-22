module.exports = {
    ...require('@yarnaimo/tss/jest.config.js'),
    setupFilesAfterEnv: ['<rootDir>/node_modules/@yarnaimo/tss/jest.setup.js'],
}
