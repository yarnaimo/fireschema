// eslint-disable-next-line
const Module = require('module')
// eslint-disable-next-line
const path = require('path')

Module.prototype.require = new Proxy(Module.prototype.require, {
  apply(target, thisArg, argumentsList) {
    if (argumentsList[0] === process.cwd()) {
      argumentsList[0] = path.resolve(
        './dist/__tests__/_infrastructure/functions-server',
      )
    }
    return Reflect.apply(target, thisArg, argumentsList)
  },
})
