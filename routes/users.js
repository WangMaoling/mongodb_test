var express = require('express');
var router = express.Router();
var userDb = require('../model/user');
//登录
router.post('/register', function (req, res, next) {
	res.send({
		code: 0,
		data: req.body.parms
	})
	// var dt = new userDb({
	//     name:req.body.name,
	//     password:req.body.password
	// })
	// // 直接添加
	// dt.save(function(err, data) {
	//   if (err) return err;
	//   console.log(data);
	//   res.send("注册成功");
	// });
})
// 获取数据
router.post('/getUserList', function (req, res, next) {
	var parms = JSON.parse(req.body.parms)
	// 不排序 得吧数据到需返回，因为数据库插入是向后插入的即：后添加的在后面，这个不符合规律
	var sortTj = parms.userSort ? 'name' : '_id';
	userDb.find({
		$or: [{
			name: {
				'$regex': parms.search,
				$options: '$i'
			}
		}]
	}).sort({
		[sortTj]: parms.userSort
	}).exec(function (err, docs) {
		if (err) return res.send({
			code: 4,
			data: '请求失败'
		});
		var all = docs.length;
		userDb.find({
			// .sort([[sortTj,parms.userSort]])
			/* 可多条件搜索例如：$or: [
			    {'description': {'$regex': key, $options: '$i'}},
			    {'city': {'$regex': key, $options: '$i'}},
			    {'name': {'$regex': key, $options: '$i'}}]
			}) */
			$or: [{
				name: {
					'$regex': parms.search,
					$options: '$i'
				}
			}]
		})
		.sort({
			[sortTj]: parms.userSort
		})
		.skip((Number(parms.page) - 1)*Number(parms.pageSize))
		.limit(Number(parms.pageSize))
		.exec(function (errList, docsList) {
			if (errList) {
				res.send({
					code: 4,
					data: '异常'
				})
			} else {
				res.send({
					code: 0,
					data: docsList,
					total: all,
					test:'测试-1111'
				})
			}
		})
	})
})
// 添加
router.post('/addUser', function (req, res, next) {
	var parms = JSON.parse(req.body.parms)
	// 获取数据库数据条数超过100就不让添加
	// var ct = userDb.count();
	userDb.find().count(function(err,count){
		if(count>=100){
			res.send({
				code: 4,
				data: '用户数已超过100个请删除后再添加'
			});
		}else{
			userDb.find({
				name: parms.name
			}).exec(function (err, docs) {
				if (docs.length >= 1) {
					res.send({
						code: 4,
						data: '失败，已存在用户名'
					});
				} else {
					userDb.create({ name: parms.name, password: parms.password}, function(errList, docsList) {
						if (errList) {
							res.send({
								code: 4,
								data: '异常'
							})
						} else {
							res.send({
								code: 0,
								data: '添加成功'
							})
						}
					})
				}
			})
		}
	}); 

	
	
	
})
// 编辑
router.post('/editUser', function (req, res, next) {
	var parms = JSON.parse(req.body.parms)
	userDb.find({
		name: parms.name
	}).exec(function (err, docs) {
		if (docs.length >= 2) {
			res.send({
				code: 4,
				data: '失败，已存在用户名'
			});
		} else {
			userDb.update({
				_id: parms._id
			}, {
				$set: {
					name: parms.name,
					password: parms.password
				}
			}, function (errList, docsList) {
				if (errList) {
					res.send({
						code: 4,
						data: '异常'
					})
				} else {
					res.send({
						code: 0,
						data: parms
					})
				}
			})
		}
	})
})
// 删除
router.post('/delUser', function (req, res, next) {
	var parms = JSON.parse(req.body.parms)
	userDb.remove({
		_id: parms._id
	}, function (err, docs) {
		// 有删除的数据：result: { ok: 1, n: 1 }   没有删除的数据：result: { ok: 1, n: 0 }
		if (err) {
			res.send({
				code: 4,
				data: '异常'
			})
		} else {
			if (docs.n == 1) {
				res.send({
					code: 0,
					data: docs
				})
			} else {
				res.send({
					code: 4,
					data: '删除失败'
				})
			}
		}
	});
})
module.exports = router;