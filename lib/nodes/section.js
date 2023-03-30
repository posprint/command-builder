'use strict'

const BaseNode = require('../base-node')

class Section extends BaseNode {
  async open (isLast) {
    if (this.isTsc) {
      if (this.attributes['flex']) {
        this.commander.send('saveBoxY')
      } else if (this.parent.attributes['flex']) {
        const width = this.attributes['width']
        this.commander.send('setBoxWidth', width)
        this.commander.send('saveBoxX')
        if (isLast) {
          this.commander.send('setBox')
        }
      }
      if (this.attributes['position'] === 'bottom' && this.attributes['height']) {
        this.commander.send('setBoxOffsetY', this.attributes['height'])
      }
    }
  }

  async printContent () {
    
  }

  async close (isLast) {
    if (this.isTsc && this.parent.attributes['flex']) {
      this.commander.send('pushBoxHeight')
      isLast && this.commander.send('clearBox')
    }
  }
}

module.exports = Section
