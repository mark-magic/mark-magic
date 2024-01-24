import { describe, it } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { writeFile } from 'fs-extra'
import path from 'pathe'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { getChromePath } from 'chrome-launcher'

const tempPath = initTempPath(__filename)

describe('fanfiction', () => {
  it('fetch chapter', async () => {
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
      executablePath: getChromePath(),
      headless: false,
      targetFilter: (target) => !!target.url(),
    })
    console.log('Running tests..')

    const page = (await browser.pages())[0]
    await page.goto('https://www.fanfiction.net/s/11551156/1/A-Wish-Within-Darkness', {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForNetworkIdle()
    console.log('page loaded')
    await page.waitForFunction(() => document.documentElement.innerText.includes('11551156'))
    console.log('page validated')
    await page.screenshot({ path: path.resolve(tempPath, 'testresult.png'), fullPage: true })
    const html = await page.content()
    await writeFile(path.resolve(tempPath, 'test.html'), html)
    await browser.close()
  })
  it('basic', async () => {
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
      executablePath: getChromePath(),
      headless: false,
      targetFilter: (target) => !!target.url(),
    })
    const page = (await browser.pages())[0]
    await page.goto('https://www.fanfiction.net/s/11551156/1')
    await page.waitForFunction((id) => document.documentElement.innerText.includes(id), {}, '11551156')
    const html = await page.content()
    await writeFile(path.resolve(tempPath, 'test.html'), html)
  })
}, 10_000)
