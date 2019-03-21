const express=require("express");
const app=express();
const formidable=require("formidable");
const fs=require("fs");
const path=require("path");
const db=require("../module/db");
const common=require("../module/common");
const ejs=require("ejs");
const mongoose = require('mongoose');
app.set("views", __dirname + "../views")
app.set("view engine","ejs");



module.exports.upgds=function(req,res){
	var form=new formidable.IncomingForm();
	form.uploadDir="./upload";
	form.keepExtensions=true;
	form.encoding="utf-8";
	form.parse(req,function(err,params,file){
		var n=1;
		var newarr=[];
		var arrpic=[file["gdsPic"],file["gdsPic1"],file["gdsPic2"]]
		for(var i=0;i<arrpic.length;i++){
			if(arrpic[i].size>0){
			var keepArr=[".jpg",".png",".gif"];
			var index=arrpic[i].name.lastIndexOf(".");
			var keepName=arrpic[i].name.substr(index).toLowerCase();
				
			if(keepArr.includes(keepName)){
				var d=new Date;
				d=d.getTime();
				var newPicName=d+keepName;
				newarr.push(newPicName)
				fs.rename(arrpic[i].path,"./upload/"+newPicName,function(err){
					n++;
				})
				console.log(n);
			}else{
				fs.unlink(arrpic[i].path,function (err) {
                    res.json({
                        ok: 1,
                        msg: "请选择正确的图片格式（.gif,.png,.jpg）"
                    })
                })
			}
			}
		}
		db.insertOne("gdslist",{
						gdsName:params.gdsName,
						gdsDis:params.gdsDis,
						gdsType:params.gdsType/1,
						gdsPrice:params.gdsPrice/1,
						gdsPin:params.gdsPin,
						gdsAdd:params.gdsAdd,
						gdsFa:params.gdsFa,
						gdsKu:params.gdsKu/1,
						gdsNum:params.gdsNum/1,
						gdsPic:newarr,
						gdsHref:params.gdsHref,
						addTime:d
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"上传商品成功");
						}
					})

		
	})
	
}

module.exports.getgds=function(req,res){
	var gdsType = req.query.gdsType/1;
    var keyword = req.query.keyword;
    var find = {};
    if(gdsType > 0)
        find.gdsType = gdsType
    if(keyword.length>0){
        find.gdsName = new RegExp(keyword);
    }
    db.count("gdslist",find,function (count) {
        var pageNum =2;
        console.log(count)
        var pageSum =Math.ceil(count/pageNum);// 总页数
        if(pageSum<1)
            pageSum=1;
        var pageIndex = req.query.pageIndex/1;
        if(pageIndex<1)
            pageIndex =1;
        if(pageIndex>pageSum)
            pageIndex =pageSum;
        console.log(find)
		db.find("gdslist",{
            find,
            sort:{
                advNum:1,
            },
            skip:(pageIndex-1)*pageNum,
            limit:pageNum
        },function (err,gdsList) {
            res.json({
                ok:1,
                gdsList,
                pageIndex,
                pageSum
            })
        })
	})
}
module.exports.getGdsType=function(req,res){
	db.find("gdsTypeList",{},function(err,gdsTypeList){
		res.json({
			ok:1,
			gdsTypeList,
		})
	})
}
//跳转列表页
var gdsmsg={};
module.exports.gotogds=function(req,res){
	
	console.log(req.query.typeName)
	db.find("gdsTypeList",{
		find:{
			"typeName":req.query.typeName,
		}
	},function(err,results){
		db.find("gdslist",{
		find:{
			"gdsType":results[0].gdsType/1,
		}
	},function(err,gdslist){
		gdsmsg["gdslist"]=gdslist;
		res.json({results});
	})
	})
	db.find("gdsCar",{},function(err,results){
		gdsmsg["results"]=results;
	})
}
module.exports.gdslist=function(req,res){
	console.log(typeof gdsmsg);
	res.render("gdslist",gdsmsg);
}
//跳转详情页

var gds={};
module.exports.gds=function(req,res){
		db.find("gdslist",{
		find:{
			"_id":mongoose.Types.ObjectId(req.query["gdsId"]),
		}
	},function(err,gdsInfo){
		db.find("gdsCar",{},function(err,results){
		
		res.render("gdsInfo",{gdsInfo,results});
		})
	})
	
}
//获取购物车
module.exports.licar=function(req,res){
	db.find("gdsCar",{},function(err,results){
		res.render("car",{results});
	})
}
module.exports.getCar=function(req,res){
	db.find("gdsCar",{},function(err,results){
		res.json({
			OK:1,
			results
		})
	})
}
//添加购物车
module.exports.addCar=function(req,res){
	var d=new Date();
	db.find("gdsCar",{
		"find":{gdsId:req.query.gdsId}
	},function(err,results){
		if(results.length>0){
			var whereObj ={
                "gdsUser":"",
			 	"gdsId" :req.query.gdsId,
			 	"gdsName": req.query.gdsName,
			 	"gdsPrice" :req.query.gdsPrice,
			 	"gdsPic" : req.query.gdsPic,
			 	"status":"false",
			 	"gdsCount":results[0]["gdsCount"]+1,
			 	"addTime":d.toLocaleString(),
            }
            console.log(req.query.gdsId);
			db.updateOneBySet("gdsCar",results[0],whereObj,function(err,results){
				console.log(err);
				res.json({
					ok:1,
					msg:"更新成功"
				})
			})
		}else{

			 db.insertOne("gdsCar",{
			 	"gdsUser":"",
			 	"gdsId" :req.query.gdsId,
			 	"gdsName": req.query.gdsName,
			 	"gdsPrice" :req.query.gdsPrice,
			 	"gdsPic" : req.query.gdsPic,
			 	"status":true,
			 	"gdsCount":1,
			 	"addTime":d.toLocaleString()
            },function (err,results) {
                res.json({
				ok:1,
				msg:"添加成功"
				})
            })
		}
	})
}
//购物车改变数据（参数：id fuhao count）
module.exports.biandata=function(req,res){
	db.find("gdsCar",{
		"find":{gdsId:req.query.gdsId}
	},function(err,results){
		if(req.query.fuhao=="删除"){
			db.deleteOneById("gdsCar",results[0]._id,function(err,results){
				res.json({
					ok:1,
					msg:"删除成功"
				})
			})

		}else{
			if(req.query.fuhao=="加"){
				results[0]["gdsCount"]+=1;
				results[0].status=req.query.status;
			}else if(req.query.fuhao="减" && req.query.gdsCount/1>1){
				results[0]["gdsCount"]-=1;
				results[0].status=req.query.status;
			}else if(req.query.fuhao="单选"){
				results[0].status=req.query.status;
			}
			console.log(results[0]);
			db.updateOneById("gdsCar",results[0]._id,results[0],function(err,results){
				res.json({
					ok:1,
					msg:"加减成功"
				})
			})
		}
		
	})
}
//删除选种商品
module.exports.delxuanzhong=function(req,res){
	db.deleteOne("gdsCar",{status:"true"},function(err,results){
		res.json({
			ok:1,
			msg:"删除成功"
		})
	})
}
module.exports.qingkong=function(req,res){
	db.deleteOne("gdsCar",{},function(err,results){
		res.json({
			ok:1,
			msg:"删除成功"
		})
	})
}
module.exports.quanxuan=function(req,res){
	var checked1=req.query.checked;
	var checked2;
	if(checked1=="true"){
		checked2="false";
	}else{
		checked2="true";
	}
	db.find("gdsCar",{
		find:{}
	},function(req,results){
		console.log(results[0]);
		for(var i=0;i<results.length;i++){
			results[i].status=checked1;
			db.updateOneById("gdsCar",results[i]._id,results[i],function(err,results){
				
			})
		}
		res.json({
					ok:1,
					msg:"加减成功"
		})
	})
}