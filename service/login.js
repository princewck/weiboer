const nconf = require('nconf');
const puppeteer = require('puppeteer');
const delay = require('../utils/delay');
function* login (page) {
  yield page.setUserAgent('Mozilla/5.0(Macintosh;U;IntelMacOSX10_6_8;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50');
  yield page.goto('http://weibo.com');
  yield page.waitForSelector('#loginname', {timeout: 20000});
  yield page.click('#loginname');
  yield page.focus('#loginname');
  const username = nconf.get('username');
  yield page.type(username);
  yield delay(1500);
  yield page.click('input[type=password].W_input');
  yield page.focus('input[type=password].W_input');
  const password = nconf.get('password');
  yield page.type(password);
  const submitBtn = yield page.$('a[node-type="submitBtn"]');
  yield submitBtn.click();
  return page.waitForSelector('#skin_cover_s', 20000);
}

module.exports = login;

