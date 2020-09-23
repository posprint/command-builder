'use strict'

const assert = require('assert')
const Td = require('../../../lib/nodes/td')
const Commander = require('../../../lib/commander')

describe('Td', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a td node', function () {
    const td = new Td({
      commander,
      elementName: 'td',
      attributes: {},
      children: 'talbe td'
    })

    assert(td instanceof Td)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Td({
        commander,
        elementName: 'td',
        attributes: { align: 'bottom' },
        children: []
      })
    })
  })
})
