// const puppeteer = require('puppeteer');
const puppeteerResolver = require("puppeteer-chromium-resolver");
const login = require('./service/login');
const publisher = require('./service/publish');
const nconf = require('nconf');
const path = require('path');
const options = require('./.weiboer.js') || {};

function init(pathToConfig) {
  nconf.argv()
  .env();
  if (pathToConfig) {
    nconf.file(pathToConfig);
  }
  return {
    publish: (...args) => {return publish(...args)}
  }
}

/**
 * 
 * @param {String} text 
 * @param {Array<String>} pictures pictures to publish
 */
async function publish(text, pictures) {
  const revisionInfo = await puppeteerResolver({
    revision: "",
    detectionPath: "",
    // folderName: '.chromium-browser-snapshots',
    hosts: ["https://npm.taobao.org/mirrors", "https://storage.googleapis.com"],
    retry: 3
  });
  const { puppeteer, executablePath } = revisionInfo;
  const browser = await puppeteer.launch({
    headless: false,
    executablePath,
    ...options.launch_options,
  });
  const page = await browser.newPage();
  await page.setViewport({      
    ...options.viewport_options,
  });
  try {
    console.log('开始登陆...');
    await login(page);
  } catch (e) {
    console.error('登录失败！');
    await browser.close();
    throw e;
  }

  try {
    console.log('开始发送...');
    await publisher(page, text, pictures);
  } catch (e) {
    console.log(e);
    await page.close();
    await browser.close();
    throw new Error('发布失败！');
  }
  console.log('发送成功！');
  await page.close();
  await browser.close();
}

module.exports = {
  init: init
}