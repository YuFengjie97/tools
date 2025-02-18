import fs from 'fs'

export function isDirectory(path: string) {
  return fs.statSync(path).isDirectory()
}