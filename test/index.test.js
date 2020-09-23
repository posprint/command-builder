'use strict'

const assert = require('assert')
const { buildCommand, validateNode } = require('../index')

describe('buildCommand', function () {
  it('should get builder with command buffer', async function () {
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
    const builder = await buildCommand(node, options)
    assert.strictEqual(builder.constructor.name, 'Template')
    assert(builder.getBuffer().size > 0)
  })
})

describe('validateNode', function () {
  it('should create node successfully', function () {
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
    const tpl = validateNode(node, options)

    assert.strictEqual(tpl.constructor.name, 'Root')
  })

  it('should throw validation error', function () {

    const node = {
      elementName: 'root',
      attributes: {},
      children: [{
        elementName: 'text',
        attributes: { 'font-family': 'ss' },
        children: null
      }]
    }
    const options = { type: 'ESC' }

    assert.throws(() => validateNode(node, options))
  })
})
