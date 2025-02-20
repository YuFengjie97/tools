import fs from 'fs'
import { resolve } from 'path'
import { clearEmptyDir, isDirectory } from './utils'

const keywordMap = new Map()
const categoryMap = new Map([
  ['step', ['step', 'borther', 'sister', '继']],
  ['milf', ['milf', 'mum', 'mother']],
  ['teacher', ['teacher', 'class', 'teach', 'student']],
  ['foot', ['foot', 'footjob']],
  ['stocking', ['stocking', '丝', 'fetish']],
  ['pantyhose', ['pantyhose', '裤袜']],
  ['breast', ['breast', 'boob', 'boobs','titty']],
  ['slut', ['slut', 'bitch']],
  ['cosplay', ['cos', 'cosplay', 'anime']],
  ['babe', ['babe', '18', 'teen', '18', 'tiny']],
  ['korea', ['korea', '韩国']],
  ['outdoor', ['outdoor', 'public', 'forest', 'toilet', 'trafic']],
  ['女上', ['sit','cow']],
  ['后入', ['后入','dog']],
  ['asian', ['asian', 'jav', 'japan']],
  ['thigh', ['thigh']]
])

function isExcludeWord(word: string) {
  return word.length <= 1 || [/pornhub|xvideos|www|com|ts|\d+/i,].some(reg => {
    return reg.test(word)
  })
}

function getKeywordByName(fileName: string) {
  return fileName.split(/[^\p{L}\p{N}]+/u).filter(item => !isExcludeWord(item))
}

let num = 0
function statisticKeyword(dir: string) {
  const contents = fs.readdirSync(dir)
  contents.forEach(name => {
    const fullPath = resolve(dir, name)
    const isDir = isDirectory(fullPath)
    if (isDir) {
      statisticKeyword(fullPath)
    } else {

      num += 1
      const keywords = getKeywordByName(name)

      keywords.forEach(keyword => {
        if (keywordMap.has(keyword)) {
          keywordMap.set(keyword, keywordMap.get(keyword) + 1)
        } else {
          keywordMap.set(keyword, 1)
        }
      })
    }
  })
}

function getDirName(fileName: string) {
  const keywords = getKeywordByName(fileName)

  for (let keyword of keywords) {
    for (let [dirname, categoryKeywords] of categoryMap.entries()) {
      for (let categoryKeyword of categoryKeywords) {
        if (new RegExp(categoryKeyword, 'i').test(keyword)) {
          return dirname
        }
      }
    }
  }

  if (keywords.length === 0) {
    return '未分类'
  }

  let dirName = keywords[0]
  let max = 1
  keywords.forEach(item => {
    const count = keywordMap.get(item)
    if (count > max) {
      dirName = item
    }
  })

  if (max <= 1) {
    return '未分类'
  }

  return dirName
}

function categoryAllFileInDir(dir: string, outDir: string) {
  const contents = fs.readdirSync(dir)
  contents.forEach(name => {

    const fullPath = resolve(dir, name)
    const isDir = isDirectory(fullPath)
    if (isDir) {
      categoryAllFileInDir(fullPath, outDir)
    } else {
      const shouldDir = resolve(outDir, getDirName(name))

      if (!fs.existsSync(shouldDir)) {
        fs.mkdirSync(shouldDir)
      }

      fs.renameSync(resolve(dir, name), resolve(shouldDir, name))

    }
  })
}


function main() {

  const dir = 'E:/download_idm/sum/pornhub'
  statisticKeyword(dir)
  fs.writeFileSync('./videoKeyword.json', JSON.stringify(Array.from(keywordMap), null, 2))

  categoryAllFileInDir(dir, dir)
  clearEmptyDir(dir)
}

main()


