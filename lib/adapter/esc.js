'use strict'

const iconv = require('iconv-lite')
const escpos = require('escpos')
const util = require('escpos/utils');
const qrcodeGenerator = require('../qrcode')
const { wordWrap, sliceText, calWords, converter } = require('../utils')
const _ = escpos.command
const _l = require('lodash')


/**
 * [function Print  custom table  with extends attributes.
 * Fix Chinese character lenght in unicode
 * @param  {[List]}  data  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
escpos.Printer.prototype.tableCustomExt = function (data, encoding) {
  var cellWidth = this.width / data.length
  var secondLine = []
  var secondLineEnabled = false
  for (var i = 0; i < data.length; i++) {
    let text = '', trueText = '', tooLong = false, obj = data[i]
    obj.text = obj.text.toString().trimRight()

    if (!obj.left) obj.left = 0

    const fontSize = obj['font-size'] || 'normal'
    const size = converter('esc', 'font-size', fontSize) || [1,1]
    let ratio = size[0]
    obj.left = Math.ceil(obj.left / ratio)

    if (obj.width) {
      cellWidth = this.width * obj.width - (obj.left * ratio)
    } else if (obj.cols) {
      cellWidth = obj.cols - (obj.left * ratio)
    }

    var textLenghth = calWords(obj.text) * ratio

    // If text is too wide go to next line
    if (cellWidth < textLenghth || (obj.chunks && obj.chunks.length)) {
      const overflow = obj.overflow
      switch (overflow) {
        case 'ELLIPSE':
          tooLong = false
          const ellipseWidth = cellWidth - 3
          obj.text = sliceText(obj.text,  ellipseWidth > 2 ? ellipseWidth : cellWidth)[0]
          if (ellipseWidth > 2) {
            obj.text += '...'
          }
          break
        case 'HIDDEN':
          tooLong = false
          obj.text = sliceText(obj.text, cellWidth / ratio)[0]
          break
        case 'WRAP':
        default:
          obj.chunks = obj.chunks || wordWrap(obj.text, cellWidth / ratio)
          obj.text = obj.chunks.shift() || ''
          tooLong = obj.text !== ''
      }
    }

    text += ' '.repeat(obj.left)
    if (/CENTER/i.test(obj.align)) {
      trueText = `${obj.text.trim()}`
      const len = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      const spaces = len / 2
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
      if (obj.text !== '') { text += trueText }

      for (let j = 0; j < len - Math.ceil(spaces); j++) {
        text += ' '
      }
    } else if (/RIGHT/i.test(obj.align)) {
      trueText = `${obj.text.trim()}`
      let spaces = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
      if (obj.text !== '') { text += trueText }
    } else {
      trueText = `${obj.text.trimRight()}`
      if (obj.text !== '') { text += trueText }

      const spaces = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
    }
    if (tooLong && obj.chunks && obj.chunks.length) {
      obj.text = obj.chunks[0] || ''
      secondLine.push(obj)
      secondLineEnabled = obj.text !== ''
    } else {
      obj.text = ''
      secondLine.push(obj)
    }
    let notLast = i < data.length - 1
    if (trueText.trim().length > 0) {
      const color = obj['color']
      this.size(...size)
      let reg;
      try {
        reg = new RegExp(`(${_l.escapeRegExp(trueText)})`, 'g')
      } catch (error) {}
      if (color === 'reverse-block' && reg?.test(text)) {
        const strs = text.split(reg).filter(str => str !== '')
        strs.map((str, j) => {
          const _notLast = notLast || j < strs.length - 1
          if (str === trueText) {
            this.style('b')
            this.setReverseColors(true)
            this.text(trueText, null, _notLast)
          } else if (str !== '') {
            this.setReverseColors(false)
            this.text(str, null, _notLast)
          }
        })
      } else if (color === 'reverse' || color === 'reverse-block'){
        this.style('b')
        this.setReverseColors(true)
        this.text(text, null, notLast)
      } else {
        this.style('Normal')
        this.setReverseColors(false)
        this.text(text, null, notLast)
      }
    } else {
      this.setReverseColors(false)
      this.text(text, null, notLast)
    }
    // console.log(text, 'calWords ' + calWords(text), 'cellWidth ' + cellWidth, 'textLenghth ' + textLenghth)
  }
  // this.text(lineStr, encoding)
  // this.buffer.write(iconv.encode(lineStr + _.EOL, encoding || this.encoding))
  
  // Print the second line
  if (secondLineEnabled) {
    return this.tableCustomExt(secondLine)
  } else {
    return this
  }
}

/**
 * [font size] Fix Chinese character cant set 1-2 size
 * @param  {[String]}  width   [description]
 * @param  {[String]}  height  [description]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
escpos.Printer.prototype.size = function (width, height) {
  this.buffer.write(_.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height))
  return this
}

/**
 * { raster }
 */
escpos.Printer.prototype.rasterBase64 = function (url, type = 'png', mode, cb) {
  const self = this
  return new Promise((resolve, reject) => {
    if (url.indexOf('data:image') === -1) {
      url = `data:image/${type};base64,` + url
    }
    escpos.Image.load(url, image => {
      if (image instanceof escpos.Image) {
        try {
          self.raster(image, mode)
          cb && cb(null, self)
          resolve()
        } catch (e) {
          cb && cb(e)
          reject(e)
        }
      } else {
        cb && cb('image invalid')
        reject('image invalid')
      }
    })
  });
}

escpos.Printer.prototype.qrImageFullSize = function (content, options = {}, cb) {
  const self = this

  if (this.width === 32) {
    options.width = 150
  }

  if (options.width > 180) {
    options.width = 180
  }

  qrcodeGenerator(content, options).then(str => {
    self.rasterBase64(str, 'png', options.size, cb)
  }).catch(err => {
    cb(err, null)
  })
}

escpos.Printer.prototype.cashdraw = function () {
  this.buffer.write([0x1b, 0x70, 0x00, 0x19, 0xfa])
}

/**
 * [function Print encoded alpha-numeric text with End Of Line]
 * @param  {[String]}  content  [mandatory]
 * @param  {[String]}  encoding [optional]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
escpos.Printer.prototype.text = function (content, encoding, noWrap) {
  if (!/CP580/i.test(encoding || this.encoding)) {
    content = content.replace(/€|₣|¥|￡/g, '?')
  }
  if (!noWrap) {
    content += _.EOL;
  }
  return this.print(iconv.encode(content, encoding || this.encoding));
};

escpos.Printer.prototype.barcode128 = function (code, type, options) {
  code = '{B' + code
  this.barcode(code, type, options)
}

util.codeLength = (str) => {
  const a = str.length < 16 ? '0' : '';
  let buff = Buffer.from(a+(str.length).toString(16), 'hex');
  return buff.toString();
}

module.exports = escpos
