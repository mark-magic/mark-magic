# plugin-ao3

Download novels from [ao3](https://archiveofourown.org/), or publish novels to ao3.

## input

It can work with other plugins to convert it into other formats, such as epub.

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

Fortunately, [epubhub](https://epubhub.rxliuli.com/) has been implemented based on this plugin to download epubs from fan fiction websites. It eliminates the need for using the more fundamental mark-magic command line tool.

### url

The address of the novel to be downloaded, which can automatically recognize the book id in it. For example, the following links will be correctly recognized

- <https://archiveofourown.org/works/777002/chapters/1461984>
- <https://archiveofourown.org/works/777002/>

This plugin also supports the following websites as inputs.

- <https://forums.sufficientvelocity.com>
- <https://forums.spacebattles.com/>
- <https://www.bilibili.com/read/home>

## output

Publish markdown novels to other places or combine input to synchronize novels on sv/sb forums to ao3.

For example, the configuration of the Chinese translation of pmas published to ao3 is as follows, reference: <https://github.com/liuli-moe/pmas/blob/main/mark-magic.config.yaml#L54-L66>

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

The id of the book to be synchronized. For example, the book id of <https://archiveofourown.org/works/777002/> is 777002.

### cookie

Authentication information after logging into the ao3 account, you can copy the cookie from the browser's developer tool.

> **⚠️ Note: Do not send the cookie to others or post it on the network, having it is like having a password for the account!** If you need to synchronize the configuration file, you should use [environment variable](../config.md) to reference sensitive information.

Specific steps

1. Log in to the ao3 website
2. Open the developer console from the menu **More Tool > Developer Tools**, or use `Command+Option+I(Mac)/Ctrl+Shift+I(Windows)`
3. Switch to the **Network** tab
4. Refresh the webpage
5. Find the first request, right-click to choose **Copy > Copy as cURL**
6. Find the cookie from cURL. The cookie below the simplified curl command is `view_adult=true; user_credentials=1; ********67f`

   ```sh
   curl 'https://archiveofourown.org/works/777002/chapters/1461984' \
    -H 'cookie: view_adult=true; user_credentials=1; ********67f'
    --compressed
   ```
