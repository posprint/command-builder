'use strict'

const Commander = require('./commander')
const NodeFactory = require('./nodes')

class Template {
  constructor (options) {
    this.commander = new Commander(options)
  }

  async buildCommand (root) {
    await this.adaptNode(root).build()
  }

  getBuffer () {
    return this.commander.getBuffer()
  }

  adaptNode (root, parent) {
    const { elementName, attributes, children } = root
    const hasChildren = root.children && root.children instanceof Array
    const commander = this.commander
    const node = NodeFactory(elementName, { elementName, attributes, children: hasChildren ? [] : children, commander, parent })

    if (hasChildren) {
      root.children.forEach(child => {
        this.adaptNode(child, node)
      })
    }

    if (parent) {
      parent.addChild(node)
    }

    return node
  }
}

module.exports = Template
