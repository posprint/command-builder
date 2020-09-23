'use strict'

const assert = require('assert')
const Commander = require('../../lib/commander')

describe('Commander', function () {
  it('should init a ESC commander', function () {
    const commander = new Commander({ type: 'ESC' })
    assert.strictEqual(commander.type, 'esc')
    assert.deepStrictEqual(commander.paperSize, [80])
    assert.strictEqual(commander.width, 48)
    assert(!commander.height, 'height should be null')
    assert.strictEqual(commander.adapter.constructor.name, 'Printer')
    assert.strictEqual(commander.getBuffer().constructor.name, 'MutableBuffer')
  })

  it('should init a TSC commander', function () {
    const commander = new Commander({ type: 'tsc', paperSize: [40, 30] })
    assert.strictEqual(commander.type, 'tsc')
    assert.deepStrictEqual(commander.paperSize, [40, 30])
    assert.strictEqual(commander.width, 40)
    assert.strictEqual(commander.height, 30)
    assert.strictEqual(commander.adapter.constructor.name, 'Tsc')
    assert.strictEqual(commander.getBuffer().constructor.name, 'MutableBuffer')
  })
})
