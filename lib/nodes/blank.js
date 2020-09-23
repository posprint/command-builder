'use strict'

const Joi = require('joi')
const Text = require('./text')

class Blank extends Text {
  get schema () {
    return Joi.object({
      name: 'blank',
      attributes: Joi.object({
        lines: Joi.alternatives().try([Joi.string().regex(/\d+/), Joi.number()])
      }),
      children: Joi.string().allow(null)
    })
  }

  async printContent () {
    const lines = this.attributes.lines || '1'
    this.commander.send('feed', parseInt(lines))
  }
}

module.exports = Blank
