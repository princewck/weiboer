const puppeteer = require('puppeteer');
const co = require('co');
const login = require('./service/login');
const publisher = require('./service/publish');
const nconf = require('nconf');
const path = require('path');

function init(pathToConfig) {
  nconf.argv()
  .env();
  if (pathToConfig) {
    nconf.file(pathToConfig);
  }
  return {
    publish: (...args) => {return co(publish(...args))}
  }
}

/**
 * 
 * @param {String} text 
 * @param {Array<String>} pictures pictures to publish
 */
function* publish(text, pictures) {
  const browser = yield puppeteer.launch();
  const page = yield browser.newPage();
  yield page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1
  });
  try {
    console.log('开始登陆...');
    yield co(login(page));
  } catch (e) {
    console.log('登录失败！');
  }

  try {
    console.log('开始发送...');
    yield co(publisher(page, text, pictures));
  } catch (e) {
    console.log(e);
    throw new Error('发布失败！');
  }
  console.log('发送成功！');
  yield page.close();
}

module.exports = {
  init: init
}