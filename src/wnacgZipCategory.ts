import fs from 'fs'
import { resolve } from 'path'
import { isDirectory } from './utils'

function isExcludeStr(str: string): boolean {
  return ['汉化', '翻译', '工房', '漢化', '掃圖', '翻訳', '翻譯', '中国語', '中文', '整合'].some(item => str.includes(item))
}

// 根据文件名匹配正则来确定分类目录文件名
function getCategoryDirName(fileName: string): string {
  const res = fileName.match(/\[.*?\]|\(.*?\)/g)

  if (res && res.length > 0) {
    const arr = res.filter(item => !isExcludeStr(item))
    if (arr.length > 0) {
      return arr.sort((sec, fir) => {
        const s = sec.includes('[')
        const f = fir.includes('[')
        if (s && !f) {
          return -1
        }
        return 1
      })[0]
    }
    return 'A未分类'
  }

  return 'A未分类'
}

let num = 1
function categoryFiles(input: string, output: string) {
  const fileNames = fs.readdirSync(input)

  fileNames.forEach((fileName) => {
    if (fileName === '.yacreaderlibrary') return
    console.log(num++);

    const path = resolve(input, fileName)
    if (isDirectory(path)) {
      categoryFiles(path, output)
      return
    }

    const categoryDirName = getCategoryDirName(fileName)
    const categoryDirPath = resolve(output, categoryDirName)
    if (!(fs.existsSync(categoryDirPath) && isDirectory(categoryDirPath))) {
      fs.mkdirSync(categoryDirPath)
    }

    fs.renameSync(path, resolve(categoryDirPath, fileName))
  })
}

function clearEmptyDir(input: string) {
  const fileNames = fs.readdirSync(input)
  fileNames.forEach((fileName) => {
    const path = resolve(input, fileName)
    if (isDirectory(path)) {
      const isEmpty = fs.readdirSync(path).length === 0
      if (isEmpty) {
        fs.rmdirSync(path)
      }
    }
  })
}
const baseDir = process.argv.slice(2)[0]
if (!baseDir) {
  console.log('需要提供目录路径')
} else {
  try {
    const isDir = isDirectory(baseDir)
    if (isDir) {
      categoryFiles(baseDir, baseDir)
      clearEmptyDir(baseDir)
    } else {
      console.log('目录路径错误');
    }
  } catch (e) {
    console.log('目录路径错误');
  }
}

