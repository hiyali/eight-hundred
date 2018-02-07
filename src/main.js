import randomize from 'randomatic'
import fs from 'fs'
import { argv } from 'yargs'
import log from './log.js'

log('Keep working that for eight hundred RMB to do a compressor...', '', {
  titleColor: 'cyan'
})

/*
 * Char's source
 */
let CHARS_SOURCE = ''
for (let i = 32; i < 127; i++) {
  CHARS_SOURCE += String.fromCharCode(i)
}
log('Char\'s source:', CHARS_SOURCE)

/*
 * Random string example
 */
const EXAMPLE_COUNT = 20
const _randomString = randomize('?', EXAMPLE_COUNT, { chars: CHARS_SOURCE })
log(`Generated example (length: ${EXAMPLE_COUNT}):`, _randomString, {
  messageColor: 'red'
})

/*
 * Generate a 64k file from above random strings
 */
const WRITING_ONCE = 8 * 1024
const WRITED_COUNT = 8
const now = new Date()
const time = now.getTime()
const filePath = `dist/64k_random_string_${time}.txt`
const stream = fs.createWriteStream(filePath)
const writtingArray = []

for (let i = 0; i < WRITED_COUNT; i++) {
  const _randomStr = randomize('?', WRITING_ONCE, { chars: CHARS_SOURCE })
  writtingArray.push(_randomStr)
}

stream.once('open', function(fd) {
  let content = ''
  while (content = writtingArray.shift()) {
    stream.write(content)
  }
  stream.end()
})

/*
 * Test the compression from a file
 */
const testTarget = argv.testTarget
if (testTarget) {
  log('Test target name:', testTarget)
  const targetCode = require('./' + testTarget).default
  console.log('Target code:', targetCode)

  fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (!err) {
      log('Received data length:', data.length)
      const targetResult = targetCode(data)
      log(`Test target ${testTarget} result:`, targetResult)
    } else {
      log('Something wrong happend:', err, {
        titleColor: 'red'
      })
    }
  })
}
