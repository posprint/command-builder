'use strict'

const { calWords } = require('../utils')
const iconv = require('iconv-lite')
const { MutableBuffer } = require('mutable-buffer')

const attrBuffer = Symbol('attrBuffer')
const attrWidth = Symbol('attrWidth')
const attrHeight = Symbol('attrHeight')
const attrEncoding = Symbol('attrEncoding')
const attrCommand = Symbol('attrCommand')
const widhtUnit = Symbol('widhtUnit')
const attrLines = Symbol('attrLines')
const attrLineSpace = Symbol('attrLineSpace')

class Tsc {
  constructor (options = {}) {
    this[attrCommand] = ''
    this[attrBuffer] = new MutableBuffer()
    this[attrEncoding] = options.encoding || 'GB18030'
    this[attrWidth] = options.width || 40
    this[attrHeight] = options.height || 30
    this[widhtUnit] = 'mm'
    this[attrLines] = 0
    this[attrLineSpace] = 10
    this.init()
  }

  get width () {
    return this[attrWidth]
  }

  set width (width) {
    this[attrWidth] = width
  }

  get height () {
    return this[attrHeight]
  }

  set height (height) {
    this[attrHeight] = height
  }

  get encoding () {
    return this[attrEncoding]
  }

  encode (encoding) {
    this[attrEncoding] = encoding
  }

  get buffer () {
    if (this[attrCommand]) {
      const encodeCommand = iconv.encode(this[attrCommand], this.encoding)
      this[attrBuffer].write(encodeCommand)
    }

    return this[attrBuffer]
  }

  peel (flag = true) {
    this[attrCommand] += `SET PEEL ${flag ? 'OFF' : 'ON'}\r\n`
  }

  tear (flag = true) {
    this[attrCommand] += `SET PEEL ${flag ? 'ON' : 'OFF'}\r\n`
  }

  gap (m = 3, n = 0) {
    this[attrCommand] += `GAP ${m} ${this[widhtUnit]},${n} ${this[widhtUnit]}\r\n`
  }

  size (width, height) {
    this[attrCommand] += `SIZE ${width} ${this[widhtUnit]},${height} ${this[widhtUnit]}\r\n`
  }

  direction (flag = 1) {
    this[attrCommand] += `DIRECTION ${flag}\r\n`
  }

  clear () {
    this[attrCommand] += 'CLS\r\n'
  }

  print (m = 1, n = 1) {
    this[attrCommand] += `PRINT ${m},${n}\r\n`
  }

  text (str, align = 'left', x = 0, y = 0) {
    y = (y || this[attrLines]) * 24 + (y || this[attrLines]) * this[attrLineSpace]

    let lineStr = ''
    const avgWidth = this.width / 26

    if (align === 'center') {
      const spaces = (this.width - calWords(str) * avgWidth) / 2

      for (let j = 0; j < spaces / avgWidth; j++) {
        lineStr += ' '
      }
      if (str !== '') { lineStr += str }

      for (let j = 0; j < spaces - 1; j++) {
        lineStr += ' '
      }
    } else if (align === 'right') {
      const spaces = this.width - calWords(str) * avgWidth
      for (let j = 0; j < spaces / avgWidth; j++) {
        lineStr += ' '
      }
      if (str !== '') { lineStr += str }
    } else {
      lineStr = str
    }

    this[attrCommand] += `TEXT ${x},${y},"TSS24.BF2",0,1,1,"${lineStr}"\r\n`
    this[attrLines]++
  }

  init () {
    this.peel()
    this.tear()
    this.size(this.width, this.height)
    this.gap()
    this.direction()
    this.clear()
  }
}

module.exports = Tsc
