'use strict'

const assert = require('assert')
const Blank = require('../../../lib/nodes/blank')
const Commander = require('../../../lib/commander')

describe('blank', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a blank node', function () {
    const blank = new Blank({
      commander,
      elementName: 'blank',
      attributes: {},
      children: null,
      parent: null
    })

    assert(blank instanceof Blank)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Blank({
        commander,
        elementName: 'blank',
        attributes: { lines: 'ss' },
        children: null,
        parent: null
      })
    })
  })
})
