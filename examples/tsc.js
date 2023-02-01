const fs = require('fs')
const path = require('path')
const escpos = require('escpos')
escpos.Network = require('escpos-network')
escpos.USB = require('escpos-usb')
// escpos.Bluetooth = require('escpos-bluetooth')
const device = new escpos.Network('192.168.9.152')
// const device = new escpos.USB(0x1fc9,0x2016)
// const device = new escpos.USB(0x0471, 0x0055)

const {buildCommand, validateNodes} = require('../')
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
  device.open(async function (err) {
    if (err) {
      console.log(err)
      return
    }
    const printer = new escpos.Printer(device)
    let current
    try {
      for (const o of data) {
        current = o
        const commands = await buildCommand(o, { type: 'TSC', paperSize: [40, 60], encoding: 'GBK', direction: 1, margin:0, space: 3 })
        const buffer = commands.getBuffer().flush()
        printer.raw(buffer)
      }
    } catch (e) {
      console.log(e)
      console.log(current)
    }
    const array = []
    // printer.raw(Buffer.from(array))

    printer.close()
  })
}

exec()
// exec()
// exec()
// exec()
// exec()
// exec()