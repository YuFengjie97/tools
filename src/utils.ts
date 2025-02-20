import fs from 'fs'
import { resolve } from 'path'

export function isDirectory(path: string) {
  return fs.statSync(path).isDirectory()
}

export function clearEmptyDir(input: string) {
  const fileNames = fs.readdirSync(input)
  fileNames.forEach((fileName) => {
    const path = resolve(input, fileName)
    if (isDirectory(path)) {
      
      clearEmptyDir(path)

      const isEmpty = fs.readdirSync(path).length === 0
      if (isEmpty) {
        fs.rmdirSync(path)
      }
    }
  })
}