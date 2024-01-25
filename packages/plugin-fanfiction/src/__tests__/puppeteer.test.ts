import { describe, it, beforeEach, afterEach } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { writeFile } from 'fs-extra'
import path from 'pathe'
import puppeteer, { PuppeteerExtra } from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { getChromePath } from 'chrome-launcher'
// @ts-expect-error
import antibotbrowser from 'antibotbrowser'

const tempPath = initTempPath(__filename)

describe.skip('puppeteer-extras', () => {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>>
  beforeEach(async () => {
    puppeteer.use(StealthPlugin())
    browser = await puppeteer.launch({
      executablePath: getChromePath(),
      headless: false,
      targetFilter: (target) => !!target.url(),
    })
  })
  afterEach(async () => {
    await browser.close()
  })
  it('puppeteer-extra basic', async () => {
    const page = (await browser.pages())[0]
    await page.setViewport({ width: 800, height: 600 })

    await page.goto('https://www.fanfiction.net/s/11551156/1')
    await page.waitForFunction((id) => document.documentElement.innerText.includes(id), {}, '11551156')
    const html = await page.content()
    await writeFile(path.resolve(tempPath, 'test.html'), html)
  })
})

describe.skip('antibotbrowser', () => {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>>
  beforeEach(async () => {
    const antibrowser = await antibotbrowser.startbrowser()
    browser = await puppeteer.connect({ browserWSEndpoint: antibrowser.websokcet })
  })
  afterEach(async () => {
    await browser.close()
  })
  it('antibotbrowser basic', async () => {
    const page = await browser.newPage()
    await page.setViewport({ width: 0, height: 0 })
    await page.goto('https://google.com')
    const html = await page.content()
    await writeFile(path.resolve(tempPath, 'antibotbrowser.html'), html)
  })
})
