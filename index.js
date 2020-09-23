'use strict'

const Template = require('./lib')

exports.buildCommand = async function (json, options) {
  const tpl = new Template(options)
  await tpl.buildCommand(json)
  return tpl
}

exports.validateNode = function (json, options) {
  const tpl = new Template(options)
  return tpl.adaptNode(json)
}
