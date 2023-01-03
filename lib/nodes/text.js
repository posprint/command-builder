'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')
const { converter, wordWrap, wordWrapCenter } = require('../utils')

const attrs = Symbol('attrs')

class Text extends BaseNode {

  constructor (options) {
    super(options)
    this[attrs] = {}
  }


  get schema () {
    if (this.isEsc) {
      return Joi.object({
        name: 'text',
        attributes: Joi.object({
          'font-family': Joi.string().valid('a', 'c'),
          'font-style': Joi.string().valid('normal', 'b', 'i', 'u', 'u2', 'bi', 'biu', 'biu2', 'bu', 'bu2', 'iu', 'iu2').default('normal'),
          'font-size': Joi.string(),
          color: Joi.string().valid('normal', 'red', 'reverse', 'reverse-block'),
          'text-spacing': Joi.string().alphanum(),
          align: Joi.string().valid('left', 'center', 'right'),
          'margin-position': Joi.string().valid('none', 'bottom', 'left', 'right'),
          'margin-size': Joi.string().regex(/\d+/),
          'left': Joi.number().integer().max(20).min(1)
        }),
        children: Joi.string().allow(null, '')
      })
    } else if (this.isTsc) {
      return Joi.object({
        align: Joi.string().valid('left', 'center', 'right'),
        'max-lines': Joi.number(),
        'font-size': Joi.string(),
        'left': Joi.number().integer().max(10).min(1)
      })
    }
  }

  get defaultAttributes () {
    if (this.isEsc) {
      return {
        'margin-position': 'left',
        'margin-size': 0,
        'left': 0,
        align: 'left',
        'font-family': 'a',
        'font-style': 'normal',
        'font-size': 'normal',
        'text-spacing': 'default',
        color: 'normal'
      }
    } else if (this.isTsc) {
      return {
        align: 'left',
        'max-lines': 1,
        left: 0
      }
    }
  }

  get width() {
    const wordWidth = this.commander.boxWordWidth || this.commander.wordWidth
    // if (this.isEsc) {
      let fontSize = this.attributes['font-size']
      if (fontSize === 'wide' || fontSize === 'wide-high') {
        return  wordWidth / 2
      }
    // }
    return wordWidth
  }

  async open () {
    this.attributes = Object.assign(this.defaultAttributes, this.attributes)
    this.applyStyle(this.attributes)
  }

  async printContent () {
    const text = this.children || ''
    let wraps, left = this.attributes['left'] || 0
    if (text && this.isEsc) {
      if (this.attributes.color === 'reverse') {
        wraps = wordWrapCenter(text, this.width - left)
      } else {
        wraps = wordWrap(text, this.width - left)
      }
      wraps = wraps.map(t => ' '.repeat(left) + t)
      this.commander.send('text', wraps.join('\n'))
    } else if (text && this.isTsc) {
      wraps = wordWrap(text, this.width - left)
      const lines = this.attributes['max-lines'] || wraps.length
      wraps.slice(0, lines).forEach(text => {
        this.commander.send('text', { text: ' '.repeat(left) + text, align: this.attributes.align, ...this[attrs] })
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
            const size = converter(adapterType, attr, value) || [1,1];
            this.commander.send('size', ...size)
            break
          case 'text-spacing':
            this.commander.send('spacing', converter(attr, value) || parseInt(value))
            break
          case 'color':
            if (value === 'reverse' || value === 'reverse-block') {
              this.commander.send('style', 'b')
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
      } else {
        const style = converter(adapterType, attr, value);
        if (style) {
          switch (attr) {
            case 'font-size':
              const [wide, high] = style
              this[attrs] = Object.assign(this[attrs], { wide, high })
              break
          }
        }
      }
    })
  }
}

module.exports = Text
