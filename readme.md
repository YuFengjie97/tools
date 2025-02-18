## Tools
自己写的一些小工具

#### 安装
```
pnpm i
```

#### acg本子zip根据作者名字分类

参数
- 目录路径
```
pnpm run wnacgZipCategory E:\xx\xx
```

#### 文件名批量改写

参数
- [必传]目录路径
- 正则匹配目标文件名, 如: `wallhaven.*`. 默认`.*`(全部匹配)
- 欲改为的名字格式, 如: xxkkk[\*] ([\*]为数字通配符)
- 通配符起始数字, 默认0
```
pnpm run rename E:\xxx\xx wallhaven.* wh[*]
pnpm run rename E:\xxx\xx wallhaven.* wh[*] 19
```