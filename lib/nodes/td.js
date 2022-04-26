'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')

class Td extends BaseNode {
  get schema () {
    return Joi.object({
      name: 'td',
      attributes: Joi.object({
        align: Joi.string().valid('inherit', 'left', 'center', 'right'),
        'left': Joi.number().integer().max(20).min(1)
      }),
      children: Joi.string().allow(null, '')
    })
  }

  get defaultAttributes () {
    return {
      align: 'inherit',
      left: 0
    }
  }

  async open () {}

  async printContent () {
    const attr = Object.assign(this.defaultAttributes, this.attributes, { text: this.children || '' })
    this.parent.columns.push(attr)
  }

  async close () {}
}

module.exports = Td
