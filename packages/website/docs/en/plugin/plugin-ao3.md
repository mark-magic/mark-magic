# plugin-ao3

Download novels from [ao3](https://archiveofourown.org/), or publish novels to ao3.

## input

It can be used with other plugins to convert to other formats, such as epub.

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

Fortunately, based on this plugin, [epubhub](https://epubhub.rxliuli.com/) has been implemented, which can be used to download epub from fan fiction websites without using the lower-level mark-magic command line tool.

### url

The URL to download the novel, and the book ID will be automatically recognized. For example, the following links will be correctly recognized:

- <https://archiveofourown.org/works/777002/chapters/1461984>
- <https://archiveofourown.org/works/777002/>

This plugin also supports the following websites as input:

- <https://forums.sufficientvelocity.com>
- <https://forums.spacebattles.com/>
- <https://www.bilibili.com/read/home>

## output

Publish markdown novels to other places or combine them with input to synchronize novels from sv/sb forums to ao3.

For example, the configuration for publishing the Chinese translation of pmas to ao3 is as follows, reference: <https://github.com/liuli-moe/pmas/blob/main/mark-magic.config.yaml#L54-L66>

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

The book ID to synchronize. For example, the book ID for <https://archiveofourown.org/works/777002/> is 777002.

### cookie

Authentication information after logging into ao3 account, which can be copied from the browser's developer tools.

> **⚠️ Note: Please do not send cookies to others or publish them to the internet. With them, it is equivalent to having an account password!** If you want to synchronize the configuration file, you should use [environment variables](../config.md#environment-variables) to reference confidential information.

Specific steps:

1. Log in to the ao3 website.
2. Open the developer console from the menu **More Tools > Developer Tools**, or use `Command+Option+I(Mac)/Ctrl+Shift+I(Windows)`.
3. Switch to the **Network** tab.
4. Refresh the webpage.
5. Find the first request, right-click and select **Copy > Copy as cURL**.
6. Find the cookie from the cURL command. The cookie in the simplified curl command below is `view_adult=true; user_credentials=1; ********67f`.

   ```sh
   curl 'https://archiveofourown.org/works/777002/chapters/1461984' \
    -H 'cookie: view_adult=true; user_credentials=1; ********67f'
    --compressed
   ```
