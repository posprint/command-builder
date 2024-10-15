
const tableCombine = require('../table-engine');
const { converter } = require('../utils')

class Pax {

  constructor() {
    this.commands = []
    this.previousSize = null
    this.previousAlign = null
  }

  text (content, encoding, noWrap) {
    content = content.replace('\n', `\\n${this.previousAlign||''}${this.previousSize || '\\1'}`)
    content = content.replace(/[\u200B-\u200D\uFEFF]/g, '')
    if (!noWrap) {
      content += '\\n';
    }
    this.commands.push(content)
  }

  align (value) {
    this.previousAlign = value
    value && this.commands.push(value)
  }

  size (value) {
    this.previousSize = value
    value && this.commands.push(value)
  }

  feed (lines) {
    lines && this.commands.push('\\n'.repeat(lines))
  }

  qrcode (content) {
    content && this.commands.push(`\\$BARD,7,8,8,${content}`)
  }

  barcode (content) {
    content && this.commands.push(`\\$BARD,1,1,8,${content}`)
  }

  rasterBase64 (url, type = 'png', mode, cb) {
    cb && cb()
  }

  tableCustomExt (data, encoding) {
    let newLine;
    tableCombine(this.width, data, ({ text, notLast, align }) => {
      if (!notLast) {
        newLine = true
        this.align(converter('pax', 'align', align?.toLowerCase()))
        this.size('\\1')
      } else if (newLine) {
        newLine = false
        this.size('\\1')
      }
      this.text(text, null, notLast)
    }, 'null')
  }

  qrImageFullSize (content, options = {}, cb) {
    if (options?.type === 'sign') {
      this.commands.push(`$Logo${content}$Logo`)
    }
    cb && cb()
  }

  encode (encoding) {
    this.encoding = encoding
  }

  lineSpace (size) {
    return this
  }

  get buffer () {
    return {flush : () => this.commands.join('')}
  }

}

module.exports = Pax