const TSC = require('../lib/adapter/tsc')
const { wordWrap } = require('../lib/utils')
const { MutableBuffer } = require('mutable-buffer')

const text = '123456789abc'
let wraps = wordWrap(text)

const command = new TSC({ height: 30 })
wraps.map(text => {
  command.text(text)
})
command.print()
console.log(JSON.stringify(JSON.parse(JSON.stringify(command.buffer.flush())).data))

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