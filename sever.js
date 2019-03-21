const express =require('express')
const app = express()
const bodyParser=require('body-parser')
const db=require("./module/db");
const formidable=require("formidable");
const fs=require('fs')
const common=require("./module/common")
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.post('/addpro',function(req,res){
    var form=new formidable.IncomingForm();
	form.uploadDir="./upload";
	form.keepExtensions=true;
	form.encoding="utf-8";
	form.parse(req,function(err,params,file){
		console.log(params)
		var pic=file["pic"];
		console.log(pic.size)
		if(pic.size>0){
			var keepArr=[".jpg",".png",".gif"];
			var index=pic.name.lastIndexOf(".");
			var keepName=pic.name.substr(index).toLowerCase();
			if(keepArr.includes(keepName)){
				var d=new Date;
				d=d.getTime();
				var newPicName=d+keepName;
				fs.rename(pic.path,"./upload/"+newPicName,function(err){
					db.insertOne("pro",{
						name:params.name,
						type:params.type/1,
						pic:newPicName,
						ku:params.ku,
						keyword:params.keyword,
						oprice:params.oprice/1,
						nprice:params.nprice/1,
						status:params.status,
						msg:params.msg,
						addTime:d
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"上传商品成功");
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
})
app.post('/addbrand',function(req,res){
    var form=new formidable.IncomingForm();
	form.uploadDir="./upload";
	form.keepExtensions=true;
	form.encoding="utf-8";
	form.parse(req,function(err,params,file){
		var brandPic=file["brandPic"];
		console.log(params)
		if(brandPic.size>0){
			var keepArr=[".jpg",".png",".gif"];
			var index=brandPic.name.lastIndexOf(".");
			var keepName=brandPic.name.substr(index).toLowerCase();

			if(keepArr.includes(keepName)){
				var d=new Date;
				d=d.getTime();
				var newPicName=d+keepName;
				fs.rename(brandPic.path,"./upload/"+newPicName,function(err){
					db.insertOne("brand",{
						brandName: params.brandName,
        				brandPic:newPicName,
        				id:params.id,
						brandAreas:params.brandAreas,
						msg:params.msg
					},function(err,results){
						if(err){
							common.json(res);
						}else{
							 common.json(res,1,"上传品牌成功");
						}
					})
				})
			}else{
				fs.unlink(brandPic.path,function (err) {
                    res.json({
                        ok: 1,
                        msg: "请选择正确的图片格式（.gif,.png,.jpg）"
                    })
                })
			}
		}
	})
})
app.get('/userInfo',(req,res)=>{

})
app.listen(800,function(err,results){
    console.log('启动成功')
})