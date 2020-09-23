'use strict'

const assert = require('assert')
const Template = require('../../lib')

describe('Template', function () {
  it('should initialize a new template', function () {
    const options = { type: 'ESC' }
    const tpl = new Template(options)
    assert(tpl instanceof Template)
  })

  it('should initialize a new template widthout options', function () {
    const tpl = new Template()
    assert(tpl instanceof Template)
  })

  it('should build command buffer with node tree', async function () {
    const node = {
      elementName: 'root',
      attributes: {},
      children: [{
        elementName: 'blank',
        attributes: {},
        children: null
      }]
    }
    const options = { type: 'ESC' }
    const tpl = new Template(options)
    await tpl.buildCommand(node)

    assert(tpl.commander.getBuffer().size > 0)
  })

  it('should get buffer data after build', function () {
    const options = { type: 'ESC' }
    const tpl = new Template(options)

    assert.strictEqual(tpl.getBuffer().constructor.name, 'MutableBuffer')
  })

  it('should append node from a json object', function () {
    const node = {
      elementName: 'root',
      attributes: {},
      children: [{
        elementName: 'blank',
        attributes: {},
        children: null
      }]
    }
    const options = { type: 'ESC' }
    const tpl = new Template(options)
    const root = tpl.adaptNode(node)

    assert.strictEqual(root.name, 'root')
  })
})
