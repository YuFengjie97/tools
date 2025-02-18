import { isDirectory } from "./utils";
import fs from 'fs'
import { resolve } from 'path'

const args = process.argv.slice(2)
const [dir, matchRule, renameRule, start] = args

console.log([dir, matchRule, renameRule, start]);

const matchReg = matchRule ? new RegExp(matchRule, 'gim') : /.*/
console.log(matchReg);


try {
  if (dir) {
    const isDir = isDirectory(dir)
    if (!isDir) {
      console.log('路径不为目录');
    }
    let files = fs.readdirSync(dir)
    files = files.filter((file) => {
      return matchReg.test(file) && !isDirectory(resolve(dir, file))
    })

    const s = start ? Number(start) : 0
    
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].split('.').pop()
      const newName = renameRule.replace('[*]', `${i + s}`) + `.${ext}`
      const curPath = resolve(dir, files[i])
      const newPath = resolve(dir, newName)
      console.log(curPath, newPath);
      
      fs.renameSync(curPath, newPath)
    }
  }
} catch (e) {
  console.log('目录路径错误', e);
}

