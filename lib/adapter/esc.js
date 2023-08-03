'use strict'

const iconv = require('iconv-lite')
const escpos = require('escpos')
const util = require('escpos/utils');
const qrcodeGenerator = require('../qrcode')
const tableCombine = require('../table-engine');
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
    tableCombine(this.width, data, ({ text, trueText, notLast, size, color }) => {
      size && this.size(...size)
      if (trueText.trim().length > 0) {
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
    }, 'esc')
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
  content = content.replace(/[\u200B-\u200D\uFEFF]/g, '')
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
