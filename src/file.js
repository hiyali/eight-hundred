import fs from 'fs'

const saveFileWithArray = (filePath, dataArray) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath, { encoding: 'utf8' })

    stream.on('open', () => {
      let block
      while (block = dataArray.shift()) {
        stream.write(block)
      }

      stream.end()
    })

    stream.on('error', (err) => { reject(err) })
    stream.on('finish', () => { resolve(true) })
  })
}

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export {
  saveFileWithArray,
  readFile
}
