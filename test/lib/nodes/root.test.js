'use strict'

const assert = require('assert')
const Root = require('../../../lib/nodes/root')
const Commander = require('../../../lib/commander')

describe('Root', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a root node', function () {
    const root = new Root({
      commander,
      elementName: 'root',
      attributes: { isa: 'esc', charset: 'GB18030' },
      children: '',
      parent: null
    })

    assert(root instanceof Root)
  })
})
