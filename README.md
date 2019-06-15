## Description
一个用于自动发送微博的小插件

> headless: false时效果图：
![](./demo.gif)

## Install
```sh
npm i weiboer --save
```

## Config

```javascript
// config.json 微博账号设置
{
  "username": "185********",
  "password": "your.password",
}
```

```javascript
// .weiboer.js 全局puppeteer配置
const path = require('path');
const { PC_AGENTS } = require('./libs/userAgents');

module.exports = {
  // cookie缓存路径，默认会使用上次的cookie，如果有效则不使用账号密码登陆
  'cookies_cache_path': path.resolve(__dirname, '.cookies'), 
  // 浏览器UA
  'default_ua': PC_AGENTS.SAFRI_MAC,
  // puppeteer 登陆选项
  'launch_options': {
    'headless': false,
  },
  'viewport_options': {
    'width': 1366,
    'height': 768,
    'deviceScaleFactor': 1,
  }
}
```

- [launch_options](<https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.11.0&show=api-puppeteerlaunchoptions>)
- [viewport_options](<https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.11.0&show=api-pagesetviewportviewport>)

## Usage

```javascript
const weiboer = require('weiboer');
const path = require('path');
const configFile = path.resolve(__dirname, './config.json'); // 微博账号配置,
// configFile 可以缺省，但要至少确保环境变量中设置了username, password
const weiboHelper = weiboer.init(configFile);
weiboHelper.publish('微博内容', ['./images/01.jps', './images/02.jps']);
```

## Methods
### publish
  Parameters
  - text:string 微博内容
  - images:Array<string> 微博配图列表，本地图片路径



## Results detecting

1. 
```javascript
  weiboHelper.publish('xx', ['./some_img.jpg'])
    .then(() => {
      // success
    })
    .catch(() => {
      // error
    });
```

2. 
```javascript
  async function someFun() {
    try {
      await  weiboHelper.publish('xx', ['./some_img.jpg']);
    } catch (e) {
      // error handlers
    }
  }
```



## 注意⚠️

请勿段时间频繁触发使用账号密码登陆流程，实测发现登陆一定次数后会出现输入账号正确仍然提示账号密码错误的情况。
