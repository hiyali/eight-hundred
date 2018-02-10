import Log from '../log.js'
import { COMPRESS_BIN_WEIGHT, FROM_CHAR_CODE, FILE_LENGTH, BUFFER_LENGTH, KB, EXAMPLE_COUNT,  } from '../constants.js'
import { saveFileByStream, readFile } from '../file.js'

const filePath = 'dist/s-ascii-compressed.sac'

const compressString = (targetString) => {
  const compressedBinaryString = targetString.split('').map((char) => {
    const charCode = char.charCodeAt() // - FROM_CHAR_CODE
    if (charCode > 127) {
      throw Error('Function sevenBinarify just receive 0~127 char code')
    }
    const binStr = charCode.toString(2)
    return '0'.repeat(COMPRESS_BIN_WEIGHT - binStr.length) + binStr
  }).join('')
  // console.log('------- for save compressedBinaryString\n', compressedBinaryString.length, compressedBinaryString)

  let compressedString = ''
  let _blockPos = 0
  while (_blockPos < compressedBinaryString.length) {
    const _binaryStr = compressedBinaryString.slice(_blockPos, _blockPos + 8)
    const _binaryInt = parseInt(_binaryStr, 2)
    const _realAscii = String.fromCharCode(_binaryInt)
    compressedString += _realAscii
    _blockPos += 8
  }
  return compressedString
}

const extractString = (compressedString) => {
  const compressedBinaryString = compressedString.split('').map((char, index) => {
    const charCode = char.charCodeAt()
    const binStr = charCode.toString(2)
    return '0'.repeat(8 - binStr.length) + binStr
  }).join('')
  // console.log('------- for extracted compressedBinaryString\n', compressedBinaryString.length, compressedBinaryString)

  let extractedString = ''
  let _blockPos = 0
  while (_blockPos < compressedBinaryString.length) {
    const _binaryStr = compressedBinaryString.slice(_blockPos, _blockPos + COMPRESS_BIN_WEIGHT)
    const _binaryInt = parseInt(_binaryStr, 2)
    const _realAscii = String.fromCharCode(_binaryInt)
    extractedString += _realAscii
    _blockPos += COMPRESS_BIN_WEIGHT
  }
  return extractedString
}

const run = (targetString) => {
  return new Promise((resolve, reject) => {
    /*
     * Write logic.
     */
    const compressedString = compressString(targetString)
    Log(':::Salam::: compressedString length', compressedString.length)
    Log(':::Salam::: compressedString', compressedString)

    saveFileByStream(filePath, compressedString, BUFFER_LENGTH, { encoding: 'binary' }).then((writeRes) => {
      /*
       * Read logic.
       */
      readFile(filePath).then((data) => {
        const compressedString = data.toString('binary')
        const extractedString = extractString(compressedString)
        Log(':::Salam::: extractedString length', extractedString.length)
        resolve(extractedString)
      })
    })
  })
}

export {
  run
}
