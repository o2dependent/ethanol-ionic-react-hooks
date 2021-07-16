/**
 * This file will take all components and generate and index.tsx file with all component exports.
 *
 * When creating a component follow these steps to assure this works:
 * - Create a folder in the components directory with your component name (ex. /components/BasicCard)
 * - Create your components file (ex. /components/BasicCard/BasicCard.tsx)
 * - Create an index.ts file with all relevent exports (ex. export {BasicCard, BasicCardProps} || export {BasicCard, BasicCardVariant})
 */
const fs = require('fs')

const getImport = (filePath, importName) =>
  `import ${importName} from "${filePath}"\n`

const getExport = () => `export {${newExportsArr.join(',')}}`

let newIndex = ''

let newExportsArr = []
const { resolve } = require('path')
const { readdir } = require('fs').promises

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    console.log({
      isFile: dirent.isFile(),
      isDirectory: dirent.isDirectory(),
      name: dirent.name,
      res
    })
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield { res, dirent }
    }
  }
}

async function* getDirsFromPath(path) {
  const dirents = await readdir(path, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(path, dirent.name)
    if (dirent.isDirectory()) {
      yield { res, dirent }
    }
  }
}

;(async () => {
  const arr = []
  let newIndex = ''
  for await (const dir of getDirsFromPath('./src')) {
    const dirName = dir.dirent.name
    console.log({ dirName, dir })
    const dirPath = `./src/${dirName}`
    for await (const file of getFiles(dirPath)) {
      arr.push(file)
      /**
       * get all the base data for importing and exporting files in index.ts
       */
      // get the file name / exported function name
      const fileName = file.res.split('\\').pop()
      // get file name without extension
      const fileNameNoExt = fileName.split('.').shift()
      // get the file path
      const filePath = `${dirPath}/${fileName}`
      // get file export string
      const importString = getImport(filePath, fileNameNoExt)

      // add importString to newIndex
      newIndex += importString
      // add fileName to newExportsArr
      newExportsArr.push(fileName)

      console.log('\x1b[34m', file, '\x1b[0m') // show the file name in console
    }
    console.log({ arr, newIndex, newExportsArr })
    console.log(newIndex)
  }
})()

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

  console.log('\x1b[4m', '     generating exports     ', '\x1b[0m')

  // get all files from src/hooks
  files.forEach((file) => {
    /**
     * get all the base data for importing and exporting files in index.ts
     */
    // get the file name / exported function name
    const fileName = file.split('.')[0]
    // get the file path
    const filePath = `./hooks/${fileName}`
    // get file export string
    const importString = getImport(filePath, fileName)

    // add importString to newIndex
    newIndex += importString
    // add fileName to newExportsArr
    newExportsArr.push(fileName)

    console.log('\x1b[34m', file, '\x1b[0m') // show the file name in console
  })
  // get export and add to newIndex
  const exportString = getExport()
  newIndex += exportString

  console.log('\n')

  // write to index.ts
  fs.writeFile('./src/index.ts', newIndex, (err) => {
    if (err) {
      console.log('\x1b[31m', 'ERROR', '\x1b[0m')
      throw new Error(err)
    }
    console.log('\x1b[32m', 'index.ts file generated', '\x1b[0m')
  })
})
