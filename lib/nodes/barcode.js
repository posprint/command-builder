'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')
const { converter } = require('../utils')

class BarCode extends BaseNode {
  get schema () {
    return Joi.object({
      name: 'barcode',
      attributes: Joi.object({
        type: Joi.string().valid('ean8', 'ean13', 'code128', 'code93'),
        align: Joi.string().valid('left', 'center', 'right'),
        width: Joi.number(),
        height: Joi.number()
      }),
      children: Joi.string().required()
    })
  }

  get defaultAttributes () {
    return {
      type: 'code128',
      align: 'center',
      height: 10,
      width: 1,
      color: null
    }
  }

  open () {
    this.attributes = Object.assign(this.defaultAttributes, this.attributes)
    this.applyStyle(this.attributes)
  }

  async printContent () {
    const content = this.children
    if (this.isPax) {
      this.commander.send('barcode', content)
      return
    }
    let { type, width, height } = this.attributes
    type = type.toUpperCase()
    height = height * 10

    const func = type === 'CODE128' ? 'barcode128' : 'barcode'
    this.commander.send(func, content, type, { width, height })
  }

  applyStyle (attributes) {
    Object.keys(attributes).forEach(attr => {
      let value = attributes[attr]

      switch (attr) {
        case 'align':
          this.commander.send('align', converter(this.type, attr, value))
        case 'color':
          value = attributes[attr]?.indexOf?.('red') > -1 ? 1 : 0
          this.commander.send('color', value)
          break
      }
    })
  }

  async close () {}

}

module.exports = BarCode
