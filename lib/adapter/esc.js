'use strict'

const wordWith = require('word-width')
const iconv = require('iconv-lite')
const escpos = require('escpos')
const qrcodeGenerator = require('../qrcode')
const _ = escpos.command

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
  var lineStr = ''
  for (var i = 0; i < data.length; i++) {
    var tooLong = false
    var obj = data[i]
    obj.text = obj.text.toString()

    if (obj.width) {
      cellWidth = this.width * obj.width
    } else if (obj.cols) {
      cellWidth = obj.cols
    }

    var calWidth = Math.trunc(obj.text.length * cellWidth / wordWith(obj.text))
    var calLenghth = Math.trunc(wordWith(obj.text))
    cellWidth = Math.trunc(cellWidth)

    // If text is too wide go to next line
    if (cellWidth < calLenghth) {
      const overflow = obj.overflow
      switch (overflow) {
        case 'ELLIPSE':
          tooLong = false
          obj.originalText = obj.text
          obj.text = obj.text.substring(0, calWidth - 4)
          obj.text += '...'
          break
        case 'HIDDEN':
          tooLong = false
          obj.text = obj.text.substring(0, calWidth - 1)
          break
        case 'WRAP':
        default:
          tooLong = true
          obj.originalText = obj.text
          obj.text = obj.text.substring(0, calWidth - 1)
      }
    }

    if (obj.align === 'CENTER') {
      const spaces = (cellWidth - calLenghth) / 2
      for (let j = 0; j < spaces; j++) {
        lineStr += ' '
      }
      if (obj.text !== '') { lineStr += obj.text }

      for (let j = 0; j < spaces - 1; j++) {
        lineStr += ' '
      }
    } else if (obj.align === 'RIGHT') {
      const spaces = cellWidth - calLenghth
      for (let j = 0; j < spaces; j++) {
        lineStr += ' '
      }
      if (obj.text !== '') { lineStr += obj.text }
    } else {
      if (obj.text !== '') { lineStr += obj.text }

      const spaces = cellWidth - calLenghth
      for (let j = 0; j < spaces; j++) {
        lineStr += ' '
      }
    }

    if (tooLong) {
      secondLineEnabled = true
      obj.text = obj.originalText.substring(calWidth - 1)
      secondLine.push(obj)
    } else {
      obj.text = ''
      secondLine.push(obj)
    }
  }
  this.buffer.write(iconv.encode(lineStr + _.EOL, encoding || this.encoding))

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
 *
 * @param      {<type>}    content  The content
 * @param      {<type>}    type     The type
 * @param      {Function}  cb       { parameter_description }
 */
escpos.Printer.prototype.rasterBase64 = function (base64Img, type, mode, cb) {
  const self = this
  escpos.Image.load(Buffer.from(base64Img, 'base64'), `image/${type}`, function (rs) {
    if (rs instanceof escpos.Image) {
      try {
        cb(null, self.raster(rs, mode))
      } catch (e) {
        cb(e)
      }
    } else {
      cb(rs)
    }
  })
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

module.exports = escpos
