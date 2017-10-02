## Description
一个用于自动发送微博的小插件

## Install
```sh
npm i weiboer --save
```

## Usage
```javascript
const weiboer = require('weiboer);
const path = require('path');

const weiboHelper = weiboer.init(path.resolve(__dirname, './config.json'));
weiboHelper.publish('微博内容', ['./images/01.jps', './images/02.jps']);
```

```javascript
// config.json
{
  "username": "185********",
  "password": "your.password",
}
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
  function* someFun() {
    try {
      yield  weiboHelper.publish('xx', ['./some_img.jpg']);
    } catch (e) {
      // error handlers
    }
  }
```