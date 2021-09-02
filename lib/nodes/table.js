'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')

class Table extends BaseNode {
  get schema () {
    return Joi.object({
      name: 'table',
      attributes: Joi.object({
        'font-family': Joi.string().valid('a', 'b', 'c'),
        'font-style': Joi.string().valid('normal', 'b', 'i', 'u', 'u2', 'bi', 'biu', 'biu2', 'bu', 'bu2', 'iu', 'iu2').default('normal'),
        'font-size': Joi.string(),
        color: Joi.string().valid('normal', 'red', 'reverse'),
        'text-spacing': Joi.string().alphanum(),
        'columns-align': Joi.string(),
        'columns-width': Joi.string(),
        'columns-overflow': Joi.string() // .valid('wrap', 'ellipse', 'hidden')
      }),
      children: Joi.array().required()
    })
  }

  async open () {
    ['columns-width', 'columns-align', 'columns-overflow'].forEach(o => {
      const attrOriginal = this.attributes[o]
      if (attrOriginal) {
        const attr = o === 'columns-width' ? attrOriginal.split(',').map(e => parseInt(e)) : attrOriginal.split(',')
        this.setAttribute(o, attr)
      }
    })
  }

  async printContent () {}

  async close () {}
}

module.exports = Table
