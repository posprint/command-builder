'use strict'

const commander = Symbol('commander')
const children = Symbol('children')
const name = Symbol('name')
const attributes = Symbol('attributes')
const parent = Symbol('parent')

class BaseNode {
  constructor (options = {}) {
    if (this.constructor.name === 'BaseNode') {
      throw new Error('BaseNode must be implemented a node')
    }

    this[commander] = options.commander
    this[name] = options.elementName
    this[attributes] = options.attributes || {}
    this[children] = options.children
    this[parent] = options.parent
    this.validate()
  }

  get commander () {
    return this[commander]
  }

  get type () {
    return this.commander.type
  }

  get isEsc () {
    return this.commander.isEsc
  }

  get isTsc () {
    return this.commander.isTsc
  }

  get isSunmi () {
    return this.commander.isSunmi
  }

  get name () {
    return this[name]
  }

  get attributes () {
    return this[attributes]
  }

  set attributes (attr = {}) {
    this[attributes] = attr
  }

  get defaultAttributes () {
    return {}
  }

  get parent () {
    return this[parent]
  }

  set parent (parent) {
    this[parent] = parent
  }

  get children () {
    return this[children]
  }

  addChild (node) {
    this[children].push(node)
  }

  setAttribute (k, v) {
    this[attributes][k] = v
  }

  validate (schema, obj) {
    schema = schema || this.schema
    if (!schema) {
      return
    }
    const { attributes, children, name } = this
    const valid = schema.validate(obj || { attributes, children, name }, { allowUnknown: true })
    const { error } = valid

    if (error) {
      throw new Error(error.message + ',node:' + valid?.error?._object?.name)
      // throw error
    }
  }

  async build () {
    await this.open()

    if (this.children && this.children instanceof Array) {
      for (const e of this.children) {
        await e.build()
      }
    }

    await this.printContent()
    await this.close()
  }

  async printContent () {
    throw new Error('printContent is not implemented')
  }

  async open () {
    throw new Error('open is not implemented')
  }

  async close () {
    throw new Error('close is not implemented')
  }
}

module.exports = BaseNode
