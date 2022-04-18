'use strict'

const Joi = require('joi')
const Img = require('./img')
const { converter } = require('../utils')

class Qrcode extends Img {
  get schema () {
    return Joi.object({
      name: 'qrcode',
      attributes: Joi.object({
        align: Joi.string().valid('left', 'center', 'right'),
        margin: Joi.string(),
        size: Joi.string().valid('normal', 'wide', 'high', 'wide-high')
      }),
      children: Joi.string().required()
    })
  }

  get defaultAttributes () {
    return {
      margin: 'default',
      align: 'center',
      size: 'wide-high'
    }
  }

  async printContent () {
    const content = this.children
    const { size, align } = this.attributes

    return new Promise((resolve, reject) => {
      this.commander.send('qrImageFullSize', content, { size, align }, (err, adapter) => {
        if (err) {
          return reject(err)
        }
        resolve(adapter)
      })
    })
  }

  applyStyle (attributes) {
    Object.keys(attributes).forEach(attr => {
      let value = attributes[attr]
      if (this.isEsc) {
        switch (attr) {
          case 'align':
            this.commander.send('align', converter(this.type, attr, value))
            break
          case 'size':
            this.setAttribute('size', converter(this.type, attr, value))
            break
          case 'margin':
            value = converter(this.type, this.name, 'margin', value)
            this.commander.send(converter(this.type, 'margin-position', 'left'), parseInt(value))
            this.commander.send(converter(this.type, 'margin-position', 'right'), parseInt(value))
            this.commander.send(converter(this.type, 'margin-position', 'bottom'), parseInt(value))
            break
        }
      }
    })
  }
}

module.exports = Qrcode
