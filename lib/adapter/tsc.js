'use strict'

const { calWords } = require('../utils')
const iconv = require('iconv-lite')
const { MutableBuffer } = require('mutable-buffer')
const Image = require('escpos/image')

const attrBuffer = Symbol('attrBuffer')
const attrWidth = Symbol('attrWidth')
const attrHeight = Symbol('attrHeight')
const attrEncoding = Symbol('attrEncoding')
const attrDirection = Symbol('attrDirection')
const attrMargin = Symbol('attrMargin')
const attrSpace = Symbol('attrSpace')
const widhtUnit = Symbol('widhtUnit')
const attrLines = Symbol('attrLines')
const highLines = Symbol('highLines')
const maxLines = Symbol('maxLines')
const attrLineSpace = Symbol('attrLineSpace')
const xPixels = Symbol('xPixels')
const yPixels = Symbol('yPixels')
const rasterArray = Symbol('rasterArray')

class Tsc {
  constructor (options = {}) {
    this[attrBuffer] = new MutableBuffer()
    this[attrEncoding] = options.encoding || 'GB18030'
    this[attrWidth] = options.width || 40
    this[attrHeight] = options.height || 30
    this[attrDirection] = options.direction
    this[attrMargin] = options.margin
    this[attrSpace] = options.space
    this[widhtUnit] = 'mm'
    this[attrLines] = 0
    this[highLines] = 0
    this[maxLines] = Math.ceil(this[attrHeight] / 4)
    this[attrLineSpace] = 10
    this[yPixels] = this.height * 6.7
    this[rasterArray] = []
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
    return this[attrBuffer]
  }

  get direction () {
    return this[attrDirection]
  }

  get margin () {
    return this[attrMargin]
  }

  get space () {
    return this[attrSpace]
  }

  peel (flag = true) {
    this[attrBuffer].write(`SET PEEL ${flag ? 'OFF' : 'ON'}\r\n`)
  }

  tear (flag = true) {
    this[attrBuffer].write(`SET PEEL ${flag ? 'ON' : 'OFF'}\r\n`)
  }

  gap (m = 3, n = 0) {
    this[attrBuffer].write(`GAP ${m} ${this[widhtUnit]},${n} ${this[widhtUnit]}\r\n`)
  }

  size (width, height) {
    this[attrBuffer].write(`SIZE ${width} ${this[widhtUnit]},${height} ${this[widhtUnit]}\r\n`)
  }

  reference (flag = 1, marginLeft = 0) {
    this[attrBuffer].write(`DIRECTION ${flag}\r\n`)
    let x, y
    if (flag === 0) {
      x = (marginLeft + 3) * 8
      y = 32
    } else {
      x = marginLeft * 8
      y = 8
    }
    this[attrBuffer].write(`REFERENCE ${x},${y}\r\n`)
  }

  clear () {
    this[attrBuffer].write('CLS\r\n')
  }

  print (m = 1, n = 1) {
    this[attrBuffer].write(`PRINT ${m},${n}\r\n`)
  }

  text ({ text, align = 'left', x = 0, y = 0, wide = 1, high = 1 }) {
    if (this[attrLines] + this[highLines] + high >= this[maxLines]) this.next()
    y = (y || (this[attrLines] + this[highLines])) * 24 + (y || this[attrLines]) * this[attrLines]

    let lineStr = ''
    const avgWidth = this.width / 26 / wide

    if (align === 'center') {
      const spaces = (this.width - calWords(text) * avgWidth) / 2

      for (let j = 0; j < spaces / avgWidth; j++) {
        lineStr += ' '
      }
      if (text !== '') { lineStr += text }

      for (let j = 0; j < spaces - 1; j++) {
        lineStr += ' '
      }
    } else if (align === 'right') {
      const spaces = this.width - calWords(text) * avgWidth
      for (let j = 0; j < spaces / avgWidth; j++) {
        lineStr += ' '
      }
      if (text !== '') { lineStr += text }
    } else {
      lineStr = text
    }
    const encodeCommand = iconv.encode(`TEXT ${x},${y},"TSS24.BF2",0,${wide},${high},"${lineStr}"\r\n`, this.encoding)
    this[attrBuffer].write(encodeCommand)
    this[attrLines]++
    if (high > 1) this[highLines] += 0.99
  }

  rasterBase64 (url) {
    return new Promise((resolve, reject) => {
      Image.load(url, 'image/png', image => {
        if (image instanceof Image) {
          const raster = image.toRaster()
          const { data, width } = raster
          this[xPixels] = width
          this.pixelComputed(data)
          this[rasterArray].map((raster, i) => {
            if (i > 0) this.next()
            const { data, height } = raster
            this[attrBuffer].write(`BITMAP 0,0,${width},${height},0,`)
            this[attrBuffer].write(data)
            this[attrBuffer].write('\r\n')
          })
          resolve()
        } else {
          reject('image invalid')
        }
      })
    })
  }

  pixelComputed (data) {
    if (data.length === 0) {
      return
    }
    const height = this.heightComputed(data)
    const raster = {
      data: data.splice(0, this.xPixels * height),
      height
    }
    this[rasterArray].push(raster)
    return this.pixelComputed(data)
  }

  heightComputed (data, count = this.yPixels) {
    const end = count * this.xPixels
    const start = end - this.xPixels
    if (end >= data.length) {
      return data.length / this.xPixels
    }
    if (count < (this.yPixels / 1.5)) {
      return this.yPixels
    }
    const index = data.slice(start, end).findIndex(item => item !== 255)
    if (index === -1) {
      return count
    }
    return this.heightComputed(data, count - 1)
  }

  init () {
    this.peel()
    this.tear()
    this.size(this.width, this.height)
    this.gap(this.space)
    this.reference(this.direction, this.margin)
    this.clear()
  }

  next () {
    this.print()
    this.init()
    this[highLines] = 0
    this[attrLines] = 0
  }
}

module.exports = Tsc
