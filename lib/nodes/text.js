'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')
const { converter, wordWrap } = require('../utils')

class Text extends BaseNode {
  get schema () {
    if (this.isEsc) {
      return Joi.object({
        name: 'text',
        attributes: Joi.object({
          'font-family': Joi.string().valid('a', 'c'),
          'font-style': Joi.string().valid('normal', 'b', 'i', 'u', 'u2', 'bi', 'biu', 'biu2', 'bu', 'bu2', 'iu', 'iu2').default('normal'),
          'font-size': Joi.string().valid('normal', 'wide', 'high', 'wide-high'),
          color: Joi.string().valid('normal', 'red', 'reverse'),
          'text-spacing': Joi.string().alphanum(),
          align: Joi.string().valid('left', 'center', 'right'),
          'margin-position': Joi.string().valid('none', 'bottom', 'left', 'right'),
          'margin-size': Joi.string().regex(/\d+/)
        }),
        children: Joi.string().allow(null, '')
      })
    } else if (this.isTsc) {
      return Joi.object({ align: Joi.string().valid('left', 'center', 'right') })
    }
  }

  get defaultAttributes () {
    if (this.isEsc) {
      return {
        'margin-position': 'left',
        'margin-size': 0,
        align: 'left',
        'font-family': 'a',
        'font-style': 'normal',
        'font-size': 'normal',
        'text-spacing': 'default',
        color: 'normal'
      }
    } else if (this.isTsc) {
      return {
        align: 'left'
      }
    }
  }

  get width() {
    if (this.isEsc) {
      let fontSize = this.attributes['font-size']
      if (fontSize === 'wide' || fontSize === 'wide-high') {
        return this.commander.width / 2
      }
    }

    return this.commander.width
  }

  async open () {
    this.attributes = Object.assign(this.defaultAttributes, this.attributes)
    this.applyStyle(this.attributes)
  }

  async printContent () {
    const text = this.children || ''
    if (text && this.isEsc) {
      let wraps = wordWrap(text, this.width)
      this.commander.send('text', wraps.join('\n'))
    } else if (text && this.isTsc) {
      let wraps = wordWrap(text, this.width - 3 * 2)
      wraps.forEach(line => {
        this.commander.send('text', line, this.attributes.align, 3)
      })
    }
  }

  async close () {}

  applyStyle (attributes) {
    const adapterType = this.type

    Object.keys(attributes).forEach(attr => {
      const value = attributes[attr]
      if (this.isEsc) {
        switch (attr) {
          case 'align':
            this.commander.send('align', converter(adapterType, attr, value))
            break
          case 'font-family':
            this.commander.send('font', value)
            break
          case 'font-style':
            this.commander.send('style', value)
            break
          case 'font-size':
            this.commander.send('size', ...converter(adapterType, attr, value))
            break
          case 'text-spacing':
            this.commander.send('spacing', converter(attr, value) || parseInt(value))
            break
          case 'color':
            if (value === 'reverse') {
              this.commander.send('setReverseColors', true)
            } else {
              this.commander.send('setReverseColors', false)
              this.commander.send('color', converter(adapterType, attr, value))
            }
            break
          case 'margin-position':
          case 'margin-size':
            this.commander.send(converter(adapterType, 'margin-position', attributes['margin-position']), parseInt(value))
            break
        }
      }
    })
  }
}

module.exports = Text
