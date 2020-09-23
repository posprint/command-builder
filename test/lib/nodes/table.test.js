'use strict'

const assert = require('assert')
const Table = require('../../../lib/nodes/table')
const Commander = require('../../../lib/commander')

describe('Table', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a table node', function () {
    const table = new Table({
      commander,
      elementName: 'table',
      attributes: {
        'columns-width': '5,1',
        'columns-align': 'left,right',
        'columns-overflow': 'wrap,wrap',
        'font-size': 'normal'
      },
      children: [{
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
      }]
    })

    assert(table instanceof Table)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Table({
        commander,
        elementName: 'table',
        attributes: {},
        children: null
      })
    })
  })
})
