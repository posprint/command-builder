const fs = require('fs')
const path = require('path')
const escpos = require('escpos')
escpos.Network = require('escpos-network')
escpos.USB = require('escpos-usb')

const {buildCommand} = require('../')
const testDir = './'
const data = []
const exceptions = ['kitchenTscPrint.json']
const only = ['KitchenTicketTSC.json']

fs.readdirSync(testDir).forEach(file => {
  if (path.extname(file) === '.json') {
    if (only.length) {
      only.includes(file) && data.push(require(path.resolve(file, testDir)))
    } else if (!exceptions.includes(file)) {
      data.push(require(path.resolve(file, testDir)))
    }
  }
})

exec = async () => {
    let current
    try {
      for (const o of data) {
        current = o
        const commands = await buildCommand(o, { type: 'TSC', paperSize: [40, 30], encoding: 'UTF-8' })
        const buffer = commands.getBuffer().flush()
        console.log(JSON.stringify(JSON.parse(JSON.stringify(buffer)).data))
      }
    } catch (e) {
      console.log(e)
      console.log(current)
    }
}

exec()
