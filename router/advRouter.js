const formidable=require("formidable");
const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
const db=require("../module/db");
const common=require("../module/common")
module.exports.upadv=function(req,res){
	var form=new formidable.IncomingForm();
	form.uploadDir="./upload";
	form.keepExtensions=true;
	form.encoding="utf-8";
	form.parse(req,function(err,params,file){
		var advPic=file["advPic"];
		if(advPic.size>0){
			var keepArr=[".jpg",".png",".gif"];
			var index=advPic.name.lastIndexOf(".");
			var keepName=advPic.name.substr(index).toLowerCase();
			if(keepArr.includes(keepName)){
				var d=new Date;
				d=d.getTime();
				var newPicName=d+keepName;
				fs.rename(advPic.path,"./upload/"+newPicName,function(err){
					db.insertOne("guanggao",{
						advTiltle:params.advTiltle,
						advType:params.advType/1,
						advNum:params.advNum/1,
						 advPic:newPicName,
						advHref:params.advHref,
						msg:params.msg,
						addTime:d
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"上传广告成功");
						}
					})
				})
			}else{
				fs.unlink(advPic.path,function (err) {
                    res.json({
                        ok: 1,
                        msg: "请选择正确的图片格式（.gif,.png,.jpg）"
                    })
                })
			}
		}
	})
}

module.exports.getadv=function(req,res){
	var advType = req.query.advType/1;
    var keyword = req.query.keyword;
    var find = {};
    if(advType > 0)
        find.advType = advType
    if(keyword.length>0){
        find.advTiltle = new RegExp(keyword);
    }
    db.count("guanggao",find,function (count) {
        var pageNum =10;
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
		db.find("guanggao",{
            find,
            sort:{
                advNum:1,
            },
            skip:(pageIndex-1)*pageNum,
            limit:pageNum
        },function (err,advList) {
            res.json({
                ok:1,
                advList,
                pageIndex,
                pageSum
            })
        })
	})
}
module.exports.getType=function(req,res){
	db.find("advTypeList",{},function(err,advTypeList){
		res.json({
			ok:1,
			advTypeList,
		})
	})
}
module.exports.xiugai=function(req,res){
	db.findOneById("guanggao",req.query.id,function (err,advInfo) {
        res.json({
            ok:1,
            advInfo
        })
    })
}

module.exports.shanchu=function(req,res){
	db.findOneById("guanggao",req.query.id,function (err,advInfo) {
        fs.unlink("./upload/"+advInfo.advPic,function (err) {
            db.deleteOneById("guanggao",req.query.id,function (err) {
                res.json({
                    ok:1,
                    msg:"成功"
                })
            })
        })

    })
}


module.exports.genggai=function(req,res){
	var form=new formidable.IncomingForm();
	form.uploadDir="./upload";
	form.keepExtensions=true;
	form.encoding="utf-8";
	form.parse(req,function(err,params,file){
		var advPic=file["advPic"];
		if(advPic.size>0){
			var keepArr=[".jpg",".png",".gif"];
			var index=advPic.name.lastIndexOf(".");
			var keepName=advPic.name.substr(index).toLowerCase();
			if(keepArr.includes(keepName)){
				var d=new Date;
				d=d.getTime();
				var newPicName=d+keepName;
				fs.rename(advPic.path,"./upload/"+newPicName,function(err){
					db.findOneById("guanggao",req.query.id,function (err,advInfo) {
       			fs.unlink("./upload/"+advInfo.advPic,function (err) {
            	
			        })
			    })
					db.updateOneById("guanggao",req.query.id,{
						advTiltle:params.advTiltle,
						advType:params.advType/1,
						advNum:params.advNum/1,
						advPic:newPicName,
						advHref:params.advHref,
						msg:params.msg,
						addTime:d
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"修改成功");
						}
					})
				})
				
			}else{

				
			}
		}else{
			db.updateOneById("guanggao",req.query.id,{
						advTiltle:params.advTiltle,
						advType:params.advType/1,
						advNum:params.advNum/1,
						advHref:params.advHref,
						msg:params.msg,
						addTime:d
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"修改成功");
						}
					})
		}
	})
}