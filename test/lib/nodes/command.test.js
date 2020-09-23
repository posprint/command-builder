'use strict'

const assert = require('assert')
const Command = require('../../../lib/nodes/command')
const Commander = require('../../../lib/commander')

describe('Command', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'esc' })
  })

  it('should create a command node', function () {
    const command = new Command({
      commander,
      elementName: 'command',
      attributes: { cmd: 'cut' },
      children: null,
      parent: null
    })

    assert(command instanceof Command)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Command({
        commander,
        elementName: 'command',
        attributes: {},
        children: null,
        parent: null
      })
    })
  })
})
