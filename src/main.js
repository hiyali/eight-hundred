import randomize from 'randomatic'
import { argv } from 'yargs'

import Log from './log.js'
import { FROM_CHAR_CODE, FILE_LENGTH, BUFFER_LENGTH, KB, EXAMPLE_COUNT } from './constants.js'
import { saveFileByStream, readFile, readFileByBuffer } from './file.js'

(async () => {
  Log('Keep working that for eight hundred RMB to do a compressor...', '', {
    titleColor: 'cyan'
  })

  /*
   * Char's source
   */
  let CHARS_SOURCE = ''
  for (let i = FROM_CHAR_CODE; i < 127; i++) {
    CHARS_SOURCE += String.fromCharCode(i)
  }
  Log('Char\'s source:', CHARS_SOURCE)

  /*
   * Random string example
   */
  const _randomString = randomize('?', EXAMPLE_COUNT, { chars: CHARS_SOURCE })
  Log(`Generated example (length: ${EXAMPLE_COUNT}):`, _randomString, {
    messageColor: 'cyan'
  })

  /*
   * Generate a 64k file from above random strings
   */
  const time = 'const-time' || (new Date()).getTime()
  const filePath = `dist/64k_random_string_${time}.txt`
  const randomStr = randomize('?', FILE_LENGTH, { chars: CHARS_SOURCE })

  try {
    await saveFileByStream(filePath, randomStr, BUFFER_LENGTH, { encoding: 'utf8' })
  } catch (err) {
    Log('Something went wrong (saveFileByStream):', err, {
      titleColor: 'red'
    })
  }

  /*
   * Test the compression from a file
   */
  const testTarget = argv.testTarget
  if (testTarget) {
    Log('Test target name:', testTarget)
    const targetCode = require('./' + testTarget).run
    // console.log('Target code:', targetCode)

    try {
      const data = await readFile(filePath, { encoding: 'utf8' })
      Log('Received data length:', data.length)
      const targetResult = await targetCode(data)
      // console.log('---------- targetResult\n', targetResult)
      Log(`Test target ${testTarget} result:`, targetResult)
    } catch (err) {
      Log('Something went wrong (readFile):', err, {
        titleColor: 'red'
      })
    }
  }
})()
