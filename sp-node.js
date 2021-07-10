/**
 * This file will take all components and generate and index.tsx file with all component exports.
 *
 * When creating a component follow these steps to assure this works:
 * - Create a folder in the components directory with your component name (ex. /components/BasicCard)
 * - Create your components file (ex. /components/BasicCard/BasicCard.tsx)
 * - Create an index.ts file with all relevent exports (ex. export {BasicCard, BasicCardProps} || export {BasicCard, BasicCardVariant})
 */
const fs = require('fs')

const getExport = (filePath) => `export * from "${filePath}"\n`

let newIndex = ''

/**
 * Get all components
 */
const srcDir = './src/hooks'
fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error(err)
    throw new Error(err)
  }
  // filter out all dirs
  files = files.filter((fileName) => /^.*\.[^\\]+$/.test(fileName))
  // get all files from src/hooks
  // "import * from './src/hooks/${}';"

  console.log('\x1b[4m', '     generating exports     ', '\x1b[0m')
  const exports = files.map((file) => {
    // get the file name
    const fileName = file.split('.')[0]
    // get the file path
    const filePath = `./hooks/${fileName}`
    // get file export string
    const exportString = getExport(filePath)
    // show the file name in console
    console.log('\x1b[34m', file, '\x1b[0m')
    // return export string
    return exportString
  })
  console.log('\n')
  // concat all exports
  newIndex += exports.join('')
  // write to index.ts
  fs.writeFile('./src/index.ts', newIndex, (err) => {
    if (err) {
      console.log('\x1b[31m', 'ERROR', '\x1b[0m')
      throw new Error(err)
    }
    console.log('\x1b[32m', 'index.ts file generated', '\x1b[0m')
  })
})
