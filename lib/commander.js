'use static'

const Escpos = require('./adapter/esc')
const Tsc = require('./adapter/tsc')
const { escPaperWidthConvert } = require('./utils')

const type = Symbol('type')
const paperSize = Symbol('paperSize')
const encoding = Symbol('encoding')
const adapter = Symbol('adapter')

class Commander {
  constructor (options = {}) {
    const defaultOption = {
      type: 'esc',
      encoding: 'UTF-8',
      paperSize: [80]
    }

    options = Object.assign(defaultOption, options)

    this[type] = options.type
    this[encoding] = options.encoding
    this[paperSize] = options.paperSize
    this[adapter] = this.initAdapter()
  }

  get type () {
    return this[type].toLowerCase()
  }

  get isEsc () {
    return this.type === 'esc'
  }

  get isTsc () {
    return this.type === 'tsc'
  }

  get paperSize () {
    return this[paperSize]
  }

  get adapter () {
    return this[adapter]
  }

  get encoding () {
    return this[encoding]
  }

  get width () {
    return this.isEsc ? escPaperWidthConvert(this.paperSize[0].toString()) : this.paperSize[0]
  }

  get height () {
    return this.paperSize[1]
  }

  initAdapter () {
    const type = this.type
    const width = this.width
    const height = this.height
    
    let adapter
    switch (type) {
      case 'esc':
        adapter = new Escpos.Printer(null, { width })
        break
      case 'tsc':
        adapter = new Tsc({ width, height })
        break
      default:
        throw new Error(`Commander type ${type} is not supported`)
    }

    adapter.encode(this.encoding)

    return adapter
  }

  send (cmd, ...args) {
    this.adapter[cmd](...args)
  }

  getBuffer () {
    return this.adapter.buffer
  }
}

module.exports = Commander
