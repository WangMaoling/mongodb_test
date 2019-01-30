var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bl')

var db = mongoose.connection;
db.on('error', function callback(err) { //监听是否有异常
    console.log("链接错误");
    console.log(err);
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('链接正确!');
});
 
module.exports = mongoose;

