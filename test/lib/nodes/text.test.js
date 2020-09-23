'use strict'

const assert = require('assert')
const Text = require('../../../lib/nodes/text')
const Commander = require('../../../lib/commander')

describe('Text', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a td node', function () {
    const text = new Text({
      commander,
      elementName: 'text',
      attributes: {},
      children: 'talbe text'
    })

    assert(text instanceof Text)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Text({
        commander,
        elementName: 'text',
        attributes: { 'font-family': 'ss' },
        children: null
      })
    })
  })
})
