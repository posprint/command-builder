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
        'font-size': Joi.string(),
        color: Joi.string().valid('normal', 'red', 'reverse'),
        'text-spacing': Joi.string().alphanum()
      }),
      children: Joi.array().required()
    })
  }

  async open() {
    this.attributes = Object.assign({}, this.parent.attributes, this.attributes)
    super.open()
  }

  async printContent () {
    const columnsWidth = this.attributes['columns-width']
    const columnsAlign = this.attributes['columns-align']
    const columnsOverflow = this.attributes['columns-overflow']
    const columnsWidthTotal = columnsWidth ? columnsWidth.reduce((t, c) => {
      t += c
      return t
    }, 0) : 1

    let widhtLeft = this.width

    const columns = this.columns.map((v, i) => {
     let cols = columnsWidth ? (this.width * (columnsWidth[i] / columnsWidthTotal)) : (this.width / (this.columns.length || 1))
     cols = Math.ceil(cols)
     cols = cols < 2 ? 2 : cols

     if (i === this.columns.length -1) {
      v.cols = widhtLeft
     } else {
      v.cols = cols
      widhtLeft -= cols
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
