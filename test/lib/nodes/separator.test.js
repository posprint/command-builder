'use strict'

const assert = require('assert')
const Separator = require('../../../lib/nodes/separator')
const Commander = require('../../../lib/commander')

describe('Separator', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a separator node', function () {
    const separator = new Separator({
      commander,
      elementName: 'separator',
      attributes: {},
      children: null,
      parent: null
    })

    assert(separator instanceof Separator)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Separator({
        commander,
        elementName: 'separator',
        attributes: { char: '===' },
        children: null,
        parent: null
      })
    })
  })
})
