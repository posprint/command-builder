const assert = require('assert')
const Factory = require('../../../lib/nodes/')

describe('Factory', function () {
  it('should generate node successfully', function () {
    jest.mock('../../../lib/nodes/blank', function () {
      return function () {}
    })

    const nodeObject = Factory('blank', {})
    assert(nodeObject)
  })

  it('should throw validation errors', function () {
    jest.mock('../../../lib/nodes/blank', function () {
      return function () {}
    })

    assert.throws(() => Factory('blank-incoorect', {}))
  })
})
