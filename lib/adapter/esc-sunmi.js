'use strict'
const { Printer } = require('./esc')

class EscposSunmi extends Printer {
  color(color) {
    return this
  }

  marginBottom(size) {
    return this
  }

  marginLeft(size) {
    return this
  }

  marginRight(size) {
    return this
  }

  style(type) {
    return this
  }
}

module.exports.Printer = EscposSunmi