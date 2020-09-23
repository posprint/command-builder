'use strict'

const qrcode = require('qrcode')

module.exports = (content, options) => {
  options = Object.assign({
    width: 180,
    margin: 1
  }, options)

  options.type = 'png'

  return new Promise((resolve, reject) => {
    qrcode
      .toDataURL(content, options)
      .then(dataUrl => {
        resolve(dataUrl.split(',')[1])
      })
      .catch(err => {
        reject(new Error(`Could not generate qrcode\n${err}`))
      })
  })
}
