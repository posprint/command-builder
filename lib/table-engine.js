const { wordWrap, sliceText, calWords, converter } = require('./utils')

const tableCombine = (width, data, printFun) => {
  var cellWidth = width / data.length
  var secondLine = []
  var secondLineEnabled = false
  for (var i = 0; i < data.length; i++) {
    let text = '', trueText = '', tooLong = false, obj = data[i]
    obj.text = obj.text.toString().trimRight()

    if (!obj.left) obj.left = 0

    const fontSize = obj['font-size'] || 'normal'
    const size = converter('esc', 'font-size', fontSize) || [1,1]
    let ratio = size[0]
    obj.left = Math.ceil(obj.left / ratio)

    if (obj.width) {
      cellWidth = width * obj.width - (obj.left * ratio)
    } else if (obj.cols) {
      cellWidth = obj.cols - (obj.left * ratio)
    }

    var textLenghth = calWords(obj.text) * ratio

    // If text is too wide go to next line
    if (cellWidth < textLenghth || (obj.chunks && obj.chunks.length)) {
      const overflow = obj.overflow
      switch (overflow) {
        case 'ELLIPSE':
          tooLong = false
          const ellipseWidth = cellWidth - 3
          obj.text = sliceText(obj.text,  ellipseWidth > 2 ? ellipseWidth : cellWidth)[0]
          if (ellipseWidth > 2) {
            obj.text += '...'
          }
          break
        case 'HIDDEN':
          tooLong = false
          obj.text = sliceText(obj.text, cellWidth / ratio)[0]
          break
        case 'WRAP':
        default:
          obj.chunks = obj.chunks || wordWrap(obj.text, cellWidth / ratio)
          obj.text = obj.chunks.shift() || ''
          tooLong = obj.text !== ''
      }
    }

    text += ' '.repeat(obj.left)
    if (/CENTER/i.test(obj.align)) {
      trueText = `${obj.text.trim()}`
      const len = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      const spaces = len / 2
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
      if (obj.text !== '') { text += trueText }

      for (let j = 0; j < len - Math.ceil(spaces); j++) {
        text += ' '
      }
    } else if (/RIGHT/i.test(obj.align)) {
      trueText = `${obj.text.trim()}`
      let spaces = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
      if (obj.text !== '') { text += trueText }
    } else {
      trueText = `${obj.text.trimRight()}`
      if (obj.text !== '') { text += trueText }

      const spaces = Math.floor((cellWidth - calWords(trueText) * ratio) / ratio)
      for (let j = 0; j < spaces; j++) {
        text += ' '
      }
    }
    if (tooLong && obj.chunks && obj.chunks.length) {
      obj.text = obj.chunks[0] || ''
      secondLine.push(obj)
      secondLineEnabled = obj.text !== ''
    } else {
      obj.text = ''
      secondLine.push(obj)
    }
    let notLast = i < data.length - 1
    // console.log(text, 'calWords ' + calWords(text), 'cellWidth ' + cellWidth, 'textLenghth ' + textLenghth)
    const color = obj['color']
    printFun({ text, trueText, notLast, size, color })
  }
  if (secondLineEnabled) {
    return tableCombine(width, secondLine, printFun)
  } else {
    return this
  }
}

module.exports = tableCombine