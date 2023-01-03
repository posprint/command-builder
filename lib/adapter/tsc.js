'use strict'

const { calWords } = require('../utils')
const iconv = require('iconv-lite')
const { MutableBuffer } = require('mutable-buffer')
const Image = require('escpos/image')
const qrcodeGenerator = require('../qrcode')
const tableCombine = require('../table-engine');

const attrWidth = Symbol('attrWidth')
const attrWordWidth = Symbol('attrWordWidth')
const attrHeight = Symbol('attrHeight')
const attrEncoding = Symbol('attrEncoding')
const attrXPixels = Symbol('attrXPixels')

class Tsc {
  constructor (options = {}) {
    this[attrEncoding] = options.encoding || 'GB18030'
    this[attrWidth] = options.width || 40
    this[attrWordWidth] = options.wordWidth || 25
    this[attrHeight] = options.height || 30
    this.widhtUnit = 'mm'
    this.direction = options.direction
    this.margin = options.margin
    this.space = options.space
    this.partHeight = 0
    this.maxHeight = (this.height - 1) * 8
    this[attrXPixels] = this.width * 7.6
    this.yPixels = this.height * 6.7
    this.maxImgPixels = 30 * 7.6
    this.rasterArray = []
    this.buffer = new MutableBuffer()

    this.tempPosition = null
    this.previousPosition = null
    this.tempHeight = 0
    this.tempX = null
    this.tempHeightArray = []

    this.init()
  }

  get width () {
    if (this.tempRatio) {
      return Math.floor(this[attrWidth] * (this.tempRatio))
    }
    return this[attrWidth]
  }

  set width (width) {
    this[attrWidth] = width
  }

  get wordWidth () {
    if (this.tempRatio) {
      return Math.floor(this[attrWordWidth] * (this.tempRatio))
    }
    return this[attrWordWidth]
  }

  set wordWidth (width) {
    this[attrWordWidth] = width
  }

  get height () {
    return this[attrHeight]
  }

  set height (height) {
    this[attrHeight] = height
  }

  get xPixels () {
    return this[attrXPixels] * (this.tempRatio || 1)
  }

  get encoding () {
    return this[attrEncoding]
  }

  encode (encoding) {
    this[attrEncoding] = encoding
  }

  peel (flag = true) {
    this.buffer.write(`SET PEEL ${flag ? 'ON' : 'OFF'}\r\n`)
  }

  tear (flag = true) {
    this.buffer.write(`SET TEAR ${flag ? 'ON' : 'OFF'}\r\n`)
  }

  gap (m = 3, n = 0) {
    this.buffer.write(`GAP ${m} ${this.widhtUnit},${n} ${this.widhtUnit}\r\n`)
  }

  size (width, height) {
    this.buffer.write(`SIZE ${width} ${this.widhtUnit},${height} ${this.widhtUnit}\r\n`)
  }

  reference (flag = 1, marginLeft = 0) {
    this.buffer.write(`DIRECTION ${flag}\r\n`)
    const x = marginLeft * 8;
    const y = flag === 0 ? 8 : 8;
    this.buffer.write(`REFERENCE ${x},${y}\r\n`)
  }

  clear () {
    this.buffer.write('CLS\r\n')
  }

  print (m = 1, n = 1) {
    this.buffer.write(`PRINT ${m},${n}\r\n`)
  }

  text ({ text, x = 3, align = 'left', wide = 1, high = 1, noWrap, hasHigh }) {
    if (this.tempX) {
      x = this.tempX
    }
    let y = this.partHeight
    const lineHeight = hasHigh ? 2 : high
    if (!noWrap) {
      const partHeight = this.partHeight + 30 + (lineHeight -1) * 20
      if (partHeight > this.maxHeight) {
        this.next()
        y = 0
      }
      this.partHeight += 30 + (lineHeight -1) * 20
      this.tempHeight = this.partHeight
    }
    // console.log(text, hasHigh, lineHeight, this.partHeight, noWrap)
    // console.log(text, x, y, noWrap)
    let lineStr = ''
    const avgWidth = this.width / this.wordWidth / wide
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
    this.buffer.write(encodeCommand)
    this.buffer.write('QRCODE 20,20,L,3,A,0,"www.baidu.com"\r\n')
  }

  tableCustomExt (data) {
    let x = 3, hasHigh
    tableCombine(this.width, data, ({ text, size, notLast }) => {
      // console.log('text', text, '-')
      const [wide, high] = size
      !hasHigh && (hasHigh = high === 2)
      this.text({ text, x, wide, high, noWrap: notLast, hasHigh })
      if (notLast) {
        x += calWords(text) * wide * 10
      } else {
        x = 3
      }
    })
  }

  qrImageFullSize (content, options = {}, cb) {
    const self = this
    
    if (options.size === 'normal') {
      options.width = this.maxImgPixels * 0.4
    } else if (options.size === 'wide-high') {
      options.width = this.maxImgPixels * 0.8
    }

    qrcodeGenerator(content, options).then(str => {
      self.rasterBase64(str, options).then(cb)
    }).catch(err => {
      cb(err, null)
    })
  }

  rasterBase64 (url, options = {}, size, cb) {
    return new Promise((resolve, reject) => {
      if (url.indexOf('data:image') === -1) {
        url = `data:image/png;base64,` + url
      }
      Image.load(url, 'image/png', image => {
        if (image instanceof Image) {
          const raster = image.toRaster()
          const { data, width, height } = raster
          let x = 0, y = 0
          if (this.tempX) {
            x = this.tempX
          }
          if (options) {
            if (!options.align || options.align === 'center') {
              x += (this.xPixels - width * 8) / 2
            } else if (options.align === 'right') {
              x += this.xPixels - width * 8
            }
            y = this.partHeight
            const partHeight = this.partHeight + width * 8
            if (partHeight > this.maxHeight) {
              this.next()
              y = 0
            }
            this.partHeight = this.partHeight + width * 8
            this.tempHeight = this.partHeight
            this.rasterArray = [ { data, width, height } ]
          } else {
            // this.xPixels = width
            this.pixelComputed(data)
          }
          this.rasterArray.map((raster, i) => {
            if (i > 0) this.next()
            const { data, height } = raster
            this.buffer.write(`BITMAP ${x},${y},${width},${height},0,`)
            this.buffer.write(data)
            this.buffer.write('\r\n')
          })
          cb && cb(null, this)
          resolve()
        } else {
          cb && cb('image invalid', this)
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
    this.rasterArray.push(raster)
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

  // 使用记录的坐标
  setBox () {
    // console.log('setPosition', this.tempPosition)
    this.partHeight = this.tempPosition.y
    this.tempX = this.tempPosition.x
  }

  // 保存x轴位置
  saveBoxX () {
    const x = this.width * 8
    // console.log('savePositionX', x)
    this.tempPosition = {
      x,
      ...this.tempPosition
    }
  }

  // 保存y轴位置
  saveBoxY () {
    // console.log('savePositionY', this.partHeight)
    this.tempPosition = {
      y: this.partHeight,
      ...this.tempPosition
    }
  }

  // 设置临时容器的宽度
  setBoxWidth (width) {
    // console.log('setBoxWidth', width)
    this.tempRatio = width
  }

  // 记录每个容器内的高度
  pushBoxHeight () {
    // console.log('pushBoxHeight', this.tempHeight)
    this.tempHeightArray.push(this.tempHeight)
    this.tempHeight = 0
  }


  // 清除
  clearBox () {
    // console.log('clearPositionAndWidth')
    this.partHeight = this.tempHeightArray.sort((x, y) => y - x)[0] || this.partHeight
    // console.log(this.tempHeightArray, this.partHeight)
    this.tempHeightArray = []
    this.tempPosition = null
    this.tempRatio = null
    this.tempHeight = 0
    this.tempX = null
  }

  init () {
    this.peel(false)
    this.tear()
    this.size(this.width, this.height)
    this.gap(this.space)
    this.reference(this.direction, this.margin)
    this.clear()
  }

  next () {
    this.print()
    this.init()
    this.partHeight = 0
  }
}

module.exports = Tsc
