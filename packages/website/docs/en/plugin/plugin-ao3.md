# plugin-ao3

Download novels from [ao3](https://archiveofourown.org/), or publish novels to ao3.

## input

It can be used with other plugins to convert it into other formats, such as epub.

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

Fortunately, [epubhub](https://epubhub.rxliuli.com/) has been implemented based on this plugin for downloading epub from fan fiction websites, there is no need to use the more underlying mark-magic command line tool.

### url

The address to download the novel. It will automatically recognize the book's id. For instance, the following links will be correctly recognized:

- <https://archiveofourown.org/works/777002/chapters/1461984>
- <https://archiveofourown.org/works/777002/>

This plugin also supports the following websites as input:

- <https://forums.sufficientvelocity.com>
- <https://forums.spacebattles.com/>
- <https://www.bilibili.com/read/home>

## output

Publish markdown novels to other places, or combine input to sync novels on sv/sb forums with ao3.

For instance, the configuration of publishing the pmas Chinese translation to ao3 is as follows, see: <https://github.com/liuli-moe/pmas/blob/main/mark-magic.config.yaml#L54-L66>

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

The id of the book that needs to be synced. For instance, the book's id for <https://archiveofourown.org/works/777002/> is 777002.

### cookie

The authentication information after logging in to the ao3 account can be copied from the cookies in the browser's developer tool.

> **⚠️ Warning: Do not send cookies to others or post them on the internet, having them is equivalent to having your account password!** If you need to sync configuration files, you should use [environment variables](../config.md) to quote confidential information.

Specific Steps

1. Log in to the ao3 website.
2. Open the developer console from **More Tool > Developer Tools** menu, or use `Command+Option+I(Mac)/Ctrl+Shift+I(Windows)`.
3. Switch to the **Network** tab.
4. Refresh the webpage.
5. Find the first request, right-click to choose **Copy > Copy as cURL**.
6. Find the cookie from cURL, the cookie in the simplified curl command below is `view_adult=true; user_credentials=1; ********67f`

   ```sh
   curl 'https://archiveofourown.org/works/777002/chapters/1461984' \
    -H 'cookie: view_adult=true; user_credentials=1; ********67f'
    --compressed
   ```
