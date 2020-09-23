'use strict'

const assert = require('assert')
const Tr = require('../../../lib/nodes/tr')
const Commander = require('../../../lib/commander')

describe('tr', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a td node', function () {
    const tr = new Tr({
      commander,
      elementName: 'tr',
      attributes: {},
      children: [{
        elementName: 'td',
        attributes: {},
        children: 'talbe td'
      }, {
        elementName: 'td',
        attributes: {},
        children: 'talbe td'
      }]
    })

    assert(tr instanceof Tr)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Tr({
        elementName: 'tr',
        attributes: { 'font-family': 'ss' },
        children: null
      })
    })
  })
})
