'use strict'

const eaw = require('eaw')

const calWords = function (text) {
  return eaw.getWidth(text)
}

exports.calWords = calWords

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
    'esc-size-wide-high': 'dwdh',

    'tsc-font-size-normal': [1, 1],
    'tsc-font-size-wide': [2, 1],
    'tsc-font-size-high': [1, 2],
    'tsc-font-size-wide-high': [2, 2],

    'pax-font-size-normal': ['\\1'],
    'pax-font-size-wide': ['\\3'],
    'pax-font-size-high': ['\\1'],
    'pax-font-size-wide-high': ['\\3'],
    'pax-align-left': '\\L',
    'pax-align-center': '\\C',
    'pax-align-right': '\\R',
  }
  return valueMap[key]
}

const wordWrap = function (text, width = 1) {
  let chunk = []
  let lineStr = ''
  // let tokenRe = /.+?(\s|$)/g
  // let tokenRe = /.+?([\u4e00-\u9fa5]|\s|$)/g
  let tokenRe = /(\s?[^\x00-\xff])|(\s?[0-9]+)|(\s?\[(.+?)\])|(\s?\{(.+?)\})|(\s?\((.+?)\))|(.+?[^\\u4e00-\\u9fa5a-zA-Z])|(.+?(\s|$))/g
  let words = text.match(tokenRe)

  if (width <= 0) {
    width = 1
  }

  if (!words) {
    return []
  }

  for (let index = 0; index < words.length; index++) {
    let word = words[index]
    let preAppendStr = lineStr + word
    let chunkSize = calWords(preAppendStr)
    let wordSize = calWords(word)

    if (chunkSize < width) {
      lineStr += word
    } else if (chunkSize === width) {
      preAppendStr.length && chunk.push(preAppendStr)
      lineStr = ''
    } else {
      lineStr.length && chunk.push(lineStr)
      lineStr = ''

      if (wordSize < width) {
        lineStr += word
      } else if (wordSize === width) {
        chunk.push(word)
      } else {
        let slices = sliceText(word, width)
        if (slices.length === 1) {
          calWords(slices[0]) < width ? lineStr += slices[0] : chunk.push(slices[0])
        } else if (slices.length > 1) {
          chunk = chunk.concat(slices.slice(0, slices.length - 1))
          let last = slices[slices.length - 1]
          calWords(last) < width ? lineStr += last : chunk.push(last)
        }
      }
    }
  }

  lineStr.length && chunk.push(lineStr)
  return chunk
}

const sliceText = function (text, width = 1) {
  let lineStr = ''
  let chunk = []

  for (let index = 0; index < text.length; index++) {
    let char = text[index]
    let preAppendStr = lineStr + char
    if (width === 1) {
      char.length && chunk.push(char)
    } else if (calWords(preAppendStr) < width) {
      lineStr += char
    } else if (calWords(preAppendStr) === width) {
      preAppendStr.length && chunk.push(preAppendStr)
      lineStr = ''
    } else {
      lineStr.length && chunk.push(lineStr)
      lineStr = ''
      lineStr += char
    }
  }

  lineStr.length && chunk.push(lineStr)
  return chunk
}

exports.wordWrap = wordWrap
exports.sliceText = sliceText

const wordWrapCenter = function (text, width) {
  let chunks = wordWrap(text, width)
  chunks = chunks.map(text => {
    let lineStr = ''
    const spaces = (width - calWords(text)) / 2
    for (let i = 0; i < Math.floor(spaces); i++) {
      lineStr += ' '
    }
    lineStr += text
    for (let i = 0; i < spaces-1; i++) {
      lineStr += ' '
    }
    if (calWords(text) < width) {
      lineStr += ' '
    }
    return lineStr
  })

  return chunks
}

exports.wordWrapCenter = wordWrapCenter

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

exports.tscPaperWidthConvert = function (paperWidth) {
  return Math.floor(paperWidth * 0.6)
}
