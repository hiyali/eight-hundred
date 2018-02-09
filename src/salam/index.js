import Log from '../log.js'
import { COMPRESS_BIN_WEIGHT, FROM_CHAR_CODE, FILE_LENGTH, BUFFER_LENGTH, KB, EXAMPLE_COUNT,  } from '../constants.js'
import { saveFileByStream, readFileByBuffer } from '../file.js'

const filePath = 'dist/salam-written.s'

const compressString = (targetString) => {
  const compressedBinaryString = targetString.split('').map((char) => {
    const charCode = char.charCodeAt() // - FROM_CHAR_CODE
    if (charCode > 127) {
      throw Error('Function sevenBinarify just receive 0~127 char code')
    }
    const binStr = charCode.toString(2)
    return '0'.repeat(COMPRESS_BIN_WEIGHT - binStr.length) + binStr
  }).join('')
  console.log('------- for save compressedBinaryString\n', compressedBinaryString.length, compressedBinaryString)

  const bufferLength = Math.ceil(compressedBinaryString.length / 8)
  const binaryBuffer = Buffer.alloc(bufferLength)

  let _blockPos = 0
  let _index = 0
  while (_blockPos < compressedBinaryString.length) {
    const _binaryStr = compressedBinaryString.slice(_blockPos, _blockPos + 8)
    const _binaryInt = parseInt(_binaryStr, 2)
    const _binaryHex = _binaryInt.toString(16)
    // console.log('-------', _binaryStr, _binaryInt, _binaryHex)
    binaryBuffer[_index] = _binaryHex
    _blockPos += 8
    _index++
  }
  // console.log('--------binaryBuffer', binaryBuffer.length, binaryBuffer)
  const compressedString = binaryBuffer.toString('binary', 0, binaryBuffer.length)
  return compressedString
}

const extractString = (compressedString) => {
  const compressedBinaryString = compressedString.split('').map((char) => {
    const charCode = char.charCodeAt()
    const binStr = charCode.toString(2)
    return '0'.repeat(8 - binStr.length) + binStr
  }).join('')
  console.log('------- for extracted compressedBinaryString\n', compressedBinaryString.length, compressedBinaryString)

  const bufferLength = Math.ceil(compressedBinaryString.length / COMPRESS_BIN_WEIGHT)
  const binaryBuffer = Buffer.alloc(bufferLength)

  let _blockPos = 0
  let _index = 0
  while (_blockPos < compressedBinaryString.length) {
    const _binaryStr = compressedBinaryString.slice(_blockPos, _blockPos + COMPRESS_BIN_WEIGHT)
    const _binaryInt = parseInt(_binaryStr, 2)
    const _binaryHex = _binaryInt.toString(16)
    // console.log('-------', _binaryStr, _binaryInt, _binaryHex)
    binaryBuffer[_index] = _binaryHex
    _blockPos += COMPRESS_BIN_WEIGHT
    _index++
  }
  // console.log('--------binaryBuffer', binaryBuffer.length, binaryBuffer)
  const extractedString = binaryBuffer.toString('utf8', 0, binaryBuffer.length)
  return extractedString
}

const run = (targetString) => {
  return new Promise((resolve, reject) => {
    /*
     * Write logic.
     */
    Log(':::Salam::: Given targetString', targetString)
    const compressedString = compressString(targetString)
    Log(':::Salam::: compressedString', compressedString)

    saveFileByStream(filePath, compressedString, BUFFER_LENGTH, { encoding: 'binary' }).then((writeRes) => {
      /*
       * Read logic.
       */
      // console.log('------- file saved!', writeRes)
      readFileByBuffer(filePath, FILE_LENGTH).then((data) => {
        const compressedString = data.buffer.toString('binary', 0, data.num)
        Log(':::Salam::: compressedString after open', compressedString)
        const extractedString = extractString(compressedString)
        Log(':::Salam::: extractedString', extractedString.length)
        resolve(extractedString)
      })
    })
  })
}

export {
  run
}
