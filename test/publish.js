const weiboer = require('..');
const path = require('path');
const weiboHelper = weiboer.init(path.resolve(__dirname, '../config.json'));

weiboHelper.publish('测试发送微博', [path.resolve(__dirname, './lujing.png')]);