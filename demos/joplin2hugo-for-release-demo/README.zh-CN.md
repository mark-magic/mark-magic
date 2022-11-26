# mami-cli.exe demo

发布一个 mami-cli 二进制程序，我尝试制作了 exe 程序，不需要安装 nodejs 或 npm 依赖，看是否有人感兴趣。

使用方法

1. 下载 mami-cli.exe
2. 将它放在需要操作的目录中
3. 添加配置文件，基本上是 `[name, config]` 的形式，一个从 joplin 转换为 hexo 的示例

   ```json
   {
     "input": [
       [
         "joplin",
         {
           "baseUrl": "http://127.0.0.1:27583",
           "token": "5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31",
           "tag": "blog"
         }
       ]
     ],
     "output": [["hugo", { "baseUrl": "/demo/joplin2hugo-for-release/" }]]
   }
   ```

4. 运行命令 `./mami-cli`

一个示例项目是 <https://github.com/rxliuli/mami/tree/master/demos/joplin2hugo-for-release-demo>
