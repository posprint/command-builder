'use strict'

const assert = require('assert')
const { converter, calWords, escPaperWidthConvert } = require('../../lib/utils')

describe('utis', function () {
  it('should get value by convert command', function () {
    assert.strictEqual(converter('esc-align-left'), 'LT')
    assert.strictEqual(converter('esc-align-center'), 'CT')
    assert.strictEqual(converter('esc-align-right'), 'RT')
    assert.strictEqual(converter('esc-margin-position-left'), 'marginLeft')
    assert.strictEqual(converter('esc-margin-position-bottom'), 'marginBottom')
    assert.strictEqual(converter('esc-margin-position-right'), 'marginRight')
    assert.deepStrictEqual(converter('esc-font-size-normal'), [1, 1])
    assert.deepStrictEqual(converter('esc-font-size-wide'), [2, 1])
    assert.deepStrictEqual(converter('esc-font-size-high'), [1, 2])
    assert.deepStrictEqual(converter('esc-font-size-wide-high'), [2, 2])
    assert.strictEqual(converter('esc-text-spacing-default'), null)
    assert.strictEqual(converter('esc-color-normal'), 0)
    assert.strictEqual(converter('esc-color-red'), 1)
    assert.strictEqual(converter('esc-qrcode-margin-default'), '0')
    assert.strictEqual(converter('esc-size-normal'), 'normal')
    assert.strictEqual(converter('esc-size-wide'), 'dw')
    assert.strictEqual(converter('esc-size-high'), 'dh')
    assert.strictEqual(converter('esc-size-wide-high'), 'dwdh')
  })

  it('should calculate word size correctly', function () {
    assert.strictEqual(calWords('测试字符长度test word size'), 26)
  })

  it('should covert page width from mm to word length', function () {
    assert.strictEqual(escPaperWidthConvert('58'), 32)
    assert.strictEqual(escPaperWidthConvert('72'), 42)
    assert.strictEqual(escPaperWidthConvert('76'), 40)
    assert.strictEqual(escPaperWidthConvert('80'), 48)
  })
})
