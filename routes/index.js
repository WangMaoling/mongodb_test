var express = require('express');
var router = express.Router();

// 匹配 / 首页登录页面路径的请求
router.get('/', function(req, res, next) {
  res.render('index');
});
// 匹配 /index 首页登录页面路径的请求
router.get('/index', function(req, res, next) {
  res.render('index');
});
// 匹配 /list  所有用户页面路径的请求
router.get('/list', function (req, res) {
  res.render('list', { title: '列表' });
});
module.exports = router;
