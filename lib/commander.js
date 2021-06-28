'use static'

const Escpos = require('./adapter/esc')
const EscSunmi = require('./adapter/esc-sunmi')
const Tsc = require('./adapter/tsc')
const { escPaperWidthConvert, tscPaperWidthConvert } = require('./utils')

const type = Symbol('type')
const paperSize = Symbol('paperSize')
const encoding = Symbol('encoding')
const adapter = Symbol('adapter')
const printerModel = Symbol('printerModel')
const direction = Symbol('direction')
const margin = Symbol('margin')
const space = Symbol('space')

class Commander {
  constructor (options = {}) {
    const defaultOption = {
      printerModel: null,
      type: 'esc',
      encoding: 'UTF-8',
      paperSize: [80],
      direction: 1,
      margin: 0,
      space: 3
    }

    options = Object.assign(defaultOption, options)

    this[printerModel] = options.printerModel
    this[type] = options.type
    this[encoding] = options.encoding
    this[paperSize] = options.paperSize
    this[direction] = options.direction
    this[margin] = options.margin
    this[space] = options.space
    this[adapter] = this.initAdapter()
  }

  get printerModel() {
    return this[printerModel]
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

  get direction () {
    return this[direction]
  }

  get margin () {
    return this[margin]
  }

  get space () {
    return this[space]
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

  get wordWidth () {
    return this.isEsc ? this.width : tscPaperWidthConvert(this.paperSize[0].toString())
  }

  get height () {
    return this.paperSize[1]
  }

  initAdapter () {
    const type = this.type
    const width = this.width
    const height = this.height
    const direction = this.direction
    const margin = this.margin
    const space = this.space
    
    let adapter
    switch (type) {
      case 'esc':
        adapter = (this.printerModel === 'sunmi' ?  new EscSunmi.Printer(null, { width }) : new Escpos.Printer(null, { width }))
        break
      case 'tsc':
        adapter = new Tsc({ width, height, direction, margin, space })
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
