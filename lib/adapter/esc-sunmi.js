'use strict'
const iconv = require('iconv-lite')
const { Printer, command: _ } = require('escpos')

class EscposSunmi extends Printer {
  color(color) {
    return this
  }

  marginBottom(size) {
    return this
  }

  marginLeft(size) {
    return this
  }

  marginRight(size) {
    return this
  }

  style(type) {
    return this
  }

  cashdraw () {
    this.buffer.write([0x10, 0x14, 0x00, 0x00, 0x00])
  }
}

module.exports.Printer = EscposSunmi