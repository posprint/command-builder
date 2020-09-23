'use strict'

const Joi = require('joi')
const Text = require('./text')
const originalCols = Symbol('originalCols')

class Tr extends Text {
  constructor (options) {
    super(options)
    this[originalCols] = []
  }

  get columns () {
    return this[originalCols]
  }

  get schema () {
    return Joi.object({
      name: 'tr',
      attributes: Joi.object({
        'font-family': Joi.string().valid('a', 'b', 'c'),
        'font-style': Joi.string().valid('normal', 'b', 'i', 'u', 'u2', 'bi', 'biu', 'biu2', 'bu', 'bu2', 'iu', 'iu2').default('normal'),
        'font-size': Joi.string().valid('normal', 'wide', 'high', 'wide-high'),
        color: Joi.string().valid('normal', 'red', 'reverse'),
        'text-spacing': Joi.string().alphanum()
      }),
      children: Joi.array().required()
    })
  }

  async printContent () {
    const columnsWidth = this.parent.attributes['columns-width']
    const columnsAlign = this.parent.attributes['columns-align']
    const columnsOverflow = this.parent.attributes['columns-overflow']
    const columnsWidthTotal = columnsWidth.reduce((t, c) => {
      t += c
      return t
    }, 0)

    const columns = this.columns.map((v, i) => {
      if (columnsWidth) {
        v.width = columnsWidth[i] / columnsWidthTotal
      }

      if (columnsAlign) {
        const align = columnsAlign[i] || ''
        v.align = v.align === 'inherit' ? align.toUpperCase() : v.align.toUpperCase()
      }

      if (columnsOverflow) {
        const overflow = columnsOverflow[i] || ''
        v.overflow = overflow.toUpperCase()
      }

      return v
    })

    this.commander.send('tableCustomExt', columns)
  }
}

module.exports = Tr
