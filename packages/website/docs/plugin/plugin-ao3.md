# plugin-ao3

从 [ao3](https://archiveofourown.org/) 下载小说，或者将小说发布到 ao3。

## input

可以配合其他插件将之转换为其他格式，例如 epub。

```yaml
tasks:
  - name: fetch
    input:
      name: '@mark-magic/plugin-ao3'
      config:
        url: https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/
        site: sufficientvelocity
        cached: true
    output:
      name: '@mark-magic/plugin-epub'
      config:
        path: ./dist/epub/puella-magi-adfligo-systema.epub
        id: pmas
        title: Puella Magi Adfligo Systema
        creator: Firnagzen
```

幸运的是，已经基于这个插件实现了 [epubhub](https://epubhub.rxliuli.com/)，用以从同人小说网站下载 epub，不需要使用更底层的 mark-magic 命令行工具。

### url

下载小说的地址，会自动识别其中的书籍 id。例如以下链接都会被正确识别

- <https://archiveofourown.org/works/777002/chapters/1461984>
- <https://archiveofourown.org/works/777002/>

这个插件还支持以下网站作为输入。

- <https://forums.sufficientvelocity.com>
- <https://forums.spacebattles.com/>
- <https://www.bilibili.com/read/home>

## output

将 markdown 小说发布到其他地方，或者结合输入同步 sv/sb 论坛上的小说到 ao3 上。

例如 pmas 中文翻译发布到 ao3 的配置如下，参考: <https://github.com/liuli-moe/pmas/blob/main/mark-magic.config.yaml#L54-L66>

```yaml
tasks:
  - name: publishToAo3
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./books/zh-CN
        ignore:
          - '999.md'
          - '12*.md'
    output:
      name: '@mark-magic/plugin-ao3'
      config:
        id: '53445904'
        cookie: ${AO3_COOKIE}
```

### id

需要同步的书籍 id。例如 <https://archiveofourown.org/works/777002/> 的书籍 id 是 777002。

### cookie

登录 ao3 账户之后的认证信息，可以在浏览器的开发者工具中复制 cookie。

> **⚠️ 注意：请不要将 cookie 发送给其他人或发布到网络上，有了它就相当于有了账户密码！** 如果要同步配置文件，应该使用 [环境变量](../config.md#环境变量) 引用机密信息。

具体步骤

1. 登录 ao3 网站
2. 从菜单 **More Tool > Developer Tools** 打开开发者控制台，或者使用 `Command+Option+I(Mac)/Ctrl+Shift+I(Windows)`
3. 切换到 **Network** 选项卡
4. 刷新网页
5. 找到第一个请求，右键选择 **Copy > Copy as cURL**
6. 从 cURL 中找到 cookie，下面这个简化的 curl 命令中的 cookie 就是 `view_adult=true; user_credentials=1; ********67f`

   ```sh
   curl 'https://archiveofourown.org/works/777002/chapters/1461984' \
    -H 'cookie: view_adult=true; user_credentials=1; ********67f'
    --compressed
   ```
