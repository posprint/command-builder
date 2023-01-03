'use strict'

const BaseNode = require('../base-node')

class Section extends BaseNode {
  async open (isLast) {
    if (this.isTsc) {
      if (this.attributes['position']) {
        this.commander.send('saveBoxY')
      } else if (this.parent.attributes['position']) {
        const width = this.attributes['width']
        this.commander.send('setBoxWidth', width)
        this.commander.send('saveBoxX')
        if (isLast) {
          this.commander.send('setBox')
        }
      }
    }
  }

  async printContent () {
    
  }

  async close (isLast) {
    if (this.isTsc && this.parent.attributes['position']) {
      this.commander.send('pushBoxHeight')
      isLast && this.commander.send('clearBox')
    }
  }
}

module.exports = Section
