// temporary workaround while we wait for https://github.com/facebook/jest/issues/9771
const resolver = require('enhanced-resolve').create.sync({
  conditionNames: ['require', 'node', 'default'],
  extensions: ['.js', '.json', '.node', '.ts', '.tsx'],
})

module.exports = function (request, options) {
  // list global module that must be resolved by defaultResolver here
  if (['fs', 'http', 'path'].includes(request)) {
    return options.defaultResolver(request, options)
  }

  if (request.endsWith('.js') && !request.includes('/node_modules/')) {
    for (const extension of ['.ts', '.tsx']) {
      try {
        return resolver(options.basedir, request.replace(/\.js$/, extension))
      } catch {
        continue
      }
    }
  }

  return resolver(options.basedir, request)
}
