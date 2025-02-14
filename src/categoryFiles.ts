import fs from 'fs'
import { resolve } from 'path'

// 根据文件名匹配正则来确定分类目录文件名
function getCategoryDirName(fileName: string): string {
  const res = fileName.match(/\[.*?\]/g)
  const res2 = fileName.match(/\(.*?\)/g)

  if (res && res.length > 0) {
    return res[0]
  }
  if (res2 && res2.length > 0) {
    return res2[0]
  }
  return '未分类'
}

function isDirectory(path: string) {
  return fs.statSync(path).isDirectory()
}

let num = 1
function categoryFiles(input: string, output: string ) {
  const fileNames = fs.readdirSync(input)

  fileNames.forEach((fileName) => {
    const path = resolve(input, fileName)
    if(isDirectory(path)) {
      categoryFiles(path, output)
      return
    }
    
    const categoryDirName = getCategoryDirName(fileName)
    const categoryDirPath = resolve(output, categoryDirName)
    if (!(fs.existsSync(categoryDirPath) && isDirectory(categoryDirPath))) {
      fs.mkdirSync(categoryDirPath)
    }
    
    fs.renameSync(path, resolve(categoryDirPath, fileName))
    console.log(num++);
  })
}

function clearEmptyDir(input: string) {
  const fileNames = fs.readdirSync(input)
  fileNames.forEach((fileName) => {
    const path = resolve(input, fileName)
    if(isDirectory(path)){
      const isEmpty = fs.readdirSync(path).length === 0
      if(isEmpty){
        fs.rmdirSync(path)
      }
    }
  })
}

const baseDir = 'E:/download_idm/sum/comic'

categoryFiles(baseDir, baseDir)
clearEmptyDir(baseDir)