'use strict'

const Joi = require('joi')

module.exports = function (nodeName, options) {
  const schema = Joi.string().valid('blank', 'command', 'img', 'qrcode', 'root', 'separator', 'table', 'td', 'text', 'tr', 'section').required()
  const { error } = schema.validate(nodeName)
  if (error) {
    throw error
  }

  const Node = require(`./${nodeName}`)
  return new Node(options)
}
