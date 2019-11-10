'use strict'

module.exports = config => {
  config.module.rules.push({
    test: /\.(gif|jpeg|jpg|png|svg)$/,
    use: [require.resolve('file-loader')],
  })

  return config
}