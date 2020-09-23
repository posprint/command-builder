'use strict'

const assert = require('assert')
const BaseNode = require('../../lib/base-node')
const Commander = require('../../lib/commander')

describe('BaseNode', function () {
  it('should not be initialized as an abstract class', function () {
    const commander = new Commander({ type: 'ESC', pageSize: '80' })
    assert.throws(() => {
      return new BaseNode({
        commander,
        elementName: 'root',
        attributes: { isa: 'esc', charset: 'GB18030' },
        children: [],
        parent: null
      })
    })
  })

  it('should initialize a subclass', async function () {
    class TestSubClass extends BaseNode {}

    const commander = new Commander({ type: 'ESC', pageSize: '80' })
    const subclass = new TestSubClass({
      commander,
      elementName: 'subclass',
      attributes: { foo: 'bar' },
      children: [],
      parent: null
    })

    assert(subclass.commander, 'should get a command')
    assert.strictEqual(subclass.type, 'esc')
    assert.strictEqual(subclass.name, 'subclass')
    assert.strictEqual(subclass.attributes.foo, 'bar')
    assert.deepStrictEqual(subclass.defaultAttributes, {})
    assert(!subclass.parent, 'parent should be null')
    assert(subclass.isEsc, 'node type should be esc')
    assert(!subclass.isTsc, 'node type should not be esc')
    assert.deepStrictEqual(subclass.children, [])

    assert.rejects(async () => await subclass.printContent())
    assert.rejects(async () => await subclass.open())
    assert.rejects(async () => await subclass.close())
    assert.rejects(async () => await subclass.build())
  })
})
