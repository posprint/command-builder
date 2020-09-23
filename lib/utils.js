'use strict'

const wordWith = require('word-width')

exports.converter = function (...args) {
  const key = args.join('-')

  const valueMap = {
    'esc-align-left': 'LT',
    'esc-align-center': 'CT',
    'esc-align-right': 'RT',
    'esc-margin-position-left': 'marginLeft',
    'esc-margin-position-bottom': 'marginBottom',
    'esc-margin-position-right': 'marginRight',
    'esc-font-size-normal': [1, 1],
    'esc-font-size-wide': [2, 1],
    'esc-font-size-high': [1, 2],
    'esc-font-size-wide-high': [2, 2],
    'esc-text-spacing-default': null,
    'esc-color-normal': 0,
    'esc-color-red': 1,
    'esc-qrcode-margin-default': '0',
    'esc-size-normal': 'normal',
    'esc-size-wide': 'dw',
    'esc-size-high': 'dh',
    'esc-size-wide-high': 'dwdh'
  }

  return valueMap[key]
}

exports.calWords = function (text) {
  let words = 0
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 255) {
      words += wordWith(text[i])
    } else {
      words++
    }
  }

  return words
}

/**
 * 80: 48(Font A), 64(Font B), 24(Kanji font)
 * 58：Font A-32列 Font B-43列 简、繁体16列
 */
exports.escPaperWidthConvert = function (paperWidth) {
  let width
  switch (paperWidth) {
    case '58':
      width = 32
      break
    case '72':
      width = 42
      break
    case '76':
      width = 40
      break
    default:
      width = 48
  }
  return width
}
