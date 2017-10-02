const puppeteer = require('puppeteer');
const delay = require('../utils/delay');

function* publish(page, text, pictures) {
  if (!(pictures instanceof Array)) {
    pictures = [];
  }
  if (!text && !pictures.length) {
    return Promise.reject('发送内容不能为空！');
  }
  yield page.goto('http://weibo.com');
  yield delay(500);
  yield page.waitForSelector('#skin_cover_s', 20000);
  yield page.click('a[title="图片"]');
  yield delay(400);
  if (pictures.length) {
    const fileInput = yield page.$('input[multiple]');
    yield fileInput.uploadFile(...pictures);    
  } else {
    console.log('没有图片， 跳过图片上传');
  }
  yield delay(pictures.length * 1000);
  yield page.click('textarea[title="微博输入框"]');
  yield page.focus('textarea[title="微博输入框"]');
  const input  = yield page.$('textarea[title="微博输入框"]');
  yield input.click();
  for (let i=0; i < 4; i++) {
    yield page.press('Backspace');
  }
  yield page.type(text || '');
  yield delay(1500);
  const btn = yield page.$('a[title="发布微博按钮"]');
  yield btn.click();
  return page.waitForSelector('.send_succpic', {visible: true});
}

module.exports = publish;