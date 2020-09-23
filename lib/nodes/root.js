'use strict'

const BaseNode = require('../base-node')

class Root extends BaseNode {
  async open () {}

  async printContent () {}

  async close () {
    if (this.isTsc) {
      this.commander.send('print')
    }
  }
}

module.exports = Root
