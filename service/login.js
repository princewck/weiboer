const nconf = require('nconf');
const delay = require('../utils/delay');
const path = require('path');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');
const options = require('../.weiboer.js') || {};

async function login(page) {
  const username = nconf.get('username');
  const password = nconf.get('password');
  await page.setUserAgent(options.default_ua);

  const loginStat = await checkSession(page);
  if (!loginStat) {
    page.goto('http://weibo.com');
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('#loginname', { timeout: 20000 });
    await delay(1000);
    await type(page, '#loginname', username);
    await delay(1000);
    await type(page, 'input[type=password].W_input', password);
    const submitBtn = await page.$('a[node-type="submitBtn"]');
    await submitBtn.click();
    await page.waitForSelector('#skin_cover_s', 20000);
    const cookies = await page.cookies();
    cacheCookies(cookies);
  } else {
    await restoreCookies(page);
  }
}


async function checkSession(_page) {
  const browser = await _page.browser();
  const page = await browser.newPage();
  await page.setViewport({      
    ...options.viewport_options,
  });  
  try {
    await restoreCookies(page);
    page.goto('http://weibo.com');
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    const url = new URL(await page.url());
    await page.close();
    const regexp = pathToRegexp('/u/:userid/home');
    return regexp.test(url.pathname);
  } catch (e) {
    console.error(e);
    await page.close();
    return false;
  }
}


async function type(page, selector, text) {
  await page.click('#loginname');
  await page.focus('#loginname');
  await page.type(selector, text);
}

async function restoreCookies(page) {
  const { cookies_cache_path = path.resolve(__dirname, '../.cookies') } = options;
  try {
    const serializedCookies = fs.readFileSync(cookies_cache_path);
    const cookies = JSON.parse(serializedCookies);
    await page.setCookie(...cookies);
  } catch (e) {
    console.log('没有可用的历史cookie');
    return;
  }
}

function cacheCookies(cookies) {
  const { cookies_cache_path = path.resolve(__dirname, '../.cookies') } = options;
  fs.writeFileSync(cookies_cache_path, JSON.stringify(cookies));
}

module.exports = login;

