const express=require("express");
const app=express();
const db=require("../module/db");


module.exports.useryz=function(req,res){
	var find={};
	var userName=req.query.userName/1;
	console.log(userName);
	//查询用户名是否存在
	db.find("userlist",{
		"find":{userName},
	},function(err,results){
		console.log(results);
		if(results.length==0){
			res.json({
				ok:1,
				msg:"可以注册"
			})
		}else{
			res.json({
				ok:0,
				msg:"用户名已存在"
			})
		}
	})
}

module.exports.userreg=function(req,res){
	var find={};
	var userName=req.query.userName/1;
	console.log(userName);
	var userPass=req.query.userPass;
	//查询用户名是否存在
	db.find("userlist",{
		"find":{userName},
	},function(err,results){
		if(results.length==0){
			var d=new Date();
			 db.insertOne("userlist",{
			 	userName:req.query.userName/1,
			 	userPass:userPass,
			 	regTime:d.toLocaleString()
            },function (err,results) {
                res.json({
				ok:1,
				msg:"注册成功"
			})
            })
		}else{
			res.json({
				ok:0,
				msg:"用户名已存在"
			})
		}
	})
}


module.exports.userlogin=function(req,res){
	var find={};
	var userName=req.query.userName/1;
	var userPass=req.query.userPass;
	//查询用户名是否存在
	db.find("userlist",{
		"find":{userName},
	},function(err,results){
		if(results.length==0){
			res.json({
				ok:0,
				msg:"用户名不存在"
			})
		}else{
			db.find("userlist",{
			"find":{userPass},
			},function(err,results){
		if(results.length==0){
			res.json({
				ok:0,
				msg:"密码错误"
			})
		}else{
			res.json({
				ok:1,
				msg:"登陆成功"
			})
		}
	})
		}
	})
	
}
module.exports.login=function(req,res){
res.render("login.ejs",{});
	
}
module.exports.reg=function(req,res){
res.render("reg.ejs",{});
	
}