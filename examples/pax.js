const fs = require('fs')
const path = require('path')
const eaw = require('eaw')
const iconv = require('iconv-lite')

const {buildCommand, validateNodes} = require('..')
const testDir = './'
const data = []
const exceptions = ['kitchenTscPrint.json']
const only = ['Section.json']

console.log(iconv.encode('    ', 'utf-8').byteLength)
console.log(eaw.getWidth('1111新建商品1有配料1映射  111.00'))

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
    try {
      for (const o of data) {
        const commands = await buildCommand(o, { type: 'PAX', printerModel: 'a920' })
        const buffer = JSON.stringify(commands.getBuffer().flush())
        console.log(buffer)
      }
    } catch (e) {
      console.log(e)
    }
}

exec()