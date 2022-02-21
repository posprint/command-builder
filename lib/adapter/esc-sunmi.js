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

  /**
   * [function Print encoded alpha-numeric text with End Of Line]
   * @param  {[String]}  content  [mandatory]
   * @param  {[String]}  encoding [optional]
   * @return {[Printer]} printer  [the escpos printer instance]
   */
  text = function (content, encoding) {
    content = content.replace(/€/g, '?')
    return this.print(iconv.encode(content + _.EOL, encoding || this.encoding));
  };

  cashdraw () {
    this.buffer.write([0x10, 0x14, 0x00, 0x00, 0x00])
  }
}

module.exports.Printer = EscposSunmi