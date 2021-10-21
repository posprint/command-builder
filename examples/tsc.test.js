const TSC = require('../lib/adapter/tsc')
const { wordWrap } = require('../lib/utils')
const { MutableBuffer } = require('mutable-buffer')
const escpos = require('escpos')
escpos.Network = require('escpos-network')
escpos.USB = require('escpos-usb')
// escpos.Bluetooth = require('escpos-bluetooth')
// const device = new escpos.Network('192.168.1.133')
const device = new escpos.USB(0x1fc9, 0x2016)

const text = '1234567890abcdefghi'
let wraps = wordWrap(text)

const command = new TSC({ height: 30 })
wraps.map((text,i) => {
  command.text(text, undefined, undefined, undefined, i===0?2:1)
})
command.print()

device.open(async (err) => {
  if (err) {
    console.log(err)
    return
  }
  const printer = new escpos.Printer(device)
  const buffer = command.buffer.flush();
  // console.log(JSON.stringify(JSON.parse(JSON.stringify(buffer)).data))
  printer.raw(buffer)
  printer.close()
})

// const lines = wraps.length
// const num = Math.ceil(lines / 6)
// console.log('lines', lines)
// console.log('num', num)
// // const height =  num * 30 + ((num - 1) * 3)
// const height = 30;
// const buffer = new MutableBuffer();
// for (let i = 0; i < num; i++) {
//   const command = new TSC({ height })
//   wraps.splice(0, 7).map(text => {
//     command.text(text)
//   })
//   command.print()
//   // console.log(command.buffer)
//   buffer.write(command.buffer.flush());
// }
// console.log(JSON.stringify(JSON.parse(JSON.stringify(buffer.flush())).data))

// device.open(err => {
//   console.log(err)
//   printer
//     .print(command.buffer.flush().buffer)
//     .close()
// })