import { isDirectory } from "./utils";
import fs from 'fs'
import { resolve } from 'path'

const dir = "E:/game/H/RJ365188/RJ365188\Save\CustomImgData"
const matchReg = /.*/gim
const renameRule = ""
const start = 11



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

