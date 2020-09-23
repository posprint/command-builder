'use strict'

const Joi = require('joi')
const Text = require('./text')

class Separator extends Text {
  get schema () {
    if (this.isEsc) {
      return Joi.object({
        name: 'separator',
        attributes: Joi.object({
          char: Joi.string().length(1)
        }),
        children: Joi.string().allow(null)
      })
    } else if (this.isTsc) {
      return Joi.object({})
    }
  }

  async printContent () {
    const width = this.commander.width
    const separator = this.attributes.char || '-'
    const content = []
    for (let i = 0; i < width; i++) {
      content.push(separator)
    }
    if (this.isEsc) {
      this.commander.send('println', content.join(''))
    } else if (this.isTsc) {
      this.commander.send('text', content.join(''))
    }
  }
}

module.exports = Separator
