const delay = require('../utils/delay');

async function publish(page, text, pictures) {
  if (!(pictures instanceof Array)) {
    pictures = [];
  }
  if (!text && !pictures.length) {
    return Promise.reject('发送内容不能为空！');
  }
  await page.goto('http://weibo.com');
  await delay(500);
  await page.waitForSelector('#skin_cover_s', 20000);
  await delay(400);
  if (pictures.length) {
    const fileInput = await page.$('input[multiple]');
    await fileInput.uploadFile(...pictures);    
  } else {
    console.log('没有图片， 跳过图片上传');
  }
  await delay(pictures.length * 1000);
  const textareaSelector = 'textarea[title="微博输入框"]';
  await page.click(textareaSelector);
  await page.focus(textareaSelector);
  const input  = await page.$(textareaSelector);
  await input.click({
    delay: 50,
  });
  for (let i=0; i < 4; i++) {
    await page.keyboard.press('Backspace');
  }
  await input.click({ delay: 50 });
  await input.type(text || '', { delay: 200 });
  await delay(500);
  const btn = await page.$('a[title="发布微博按钮"]');
  await btn.click({delay: 50});
  return page.waitForSelector('.send_succpic', {visible: true});
}

module.exports = publish;