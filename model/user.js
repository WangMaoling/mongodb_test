var mongoose = require('./connect.js');
mongoose.Promise = global.Promise;
// 创建用户表数据的模型
var userSchema =new mongoose.Schema({
    name:String,
    password:String,
    date: { type: Date, default: Date.now },
})
// 把schema转换为一个model,使用mongoose.model(modelName, schema) 函数
// users 是用户表
var Users = mongoose.model('users',userSchema);
// // 查询出来表中第一个数据
// Users.findOne((err,data) => {
//     console.log(data)
// });
// var xiaoming = new Users({
//     name:'小明23',
//     password:6664466
// })
// xiaoming.save(function(err, res) {
//     if (err) return err;
//     console.log(res);
// });
module.exports = Users;

