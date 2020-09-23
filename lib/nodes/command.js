'use strict'

const Joi = require('joi')
const BaseNode = require('../base-node')

class Command extends BaseNode {
  get schema () {
    return Joi.object({
      name: 'command',
      attributes: Joi.object({
        cmd: Joi.string().valid('cut', 'open-cash-box').required()
      }),
      children: Joi.string().allow(null)
    })
  }

  async open () {}

  async printContent () {
    const cmd = this.attributes.cmd
    switch (cmd) {
      case 'cut':
        this.commander.send('cut', true, 5)
        break
      case 'open-cash-box':
        this.commander.send('cashdraw')
        break
    }
  }

  async close () {}
}

module.exports = Command
