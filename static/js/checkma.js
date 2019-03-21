	//$符号函数
function $(str){
	if(str.charAt(0)=="#"){
		return document.getElementById(str.substring(1));
	}else if(str.charAt(0)=="."){
		return document.getElementsByClassName(str.substring(1));
	}else{
		return document.getElementsByTagName(str);
	}
}
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return window.getComputedStyle(obj,false)[attr];
	}
}
function getColor(){
	var str="#";
	for(var i=0;i<6;i++){
		str+=(parseInt(Math.random()*16)).toString(16);
	}
	return str;
}

				//(目标父元素，随机位数，背景图，旋转范围，颜色渐变范围（red，blue)，描边色，数组，最小字体）
	function Checkma(domObj,bit,background,rotatez,colorlinear,strok,arr,minfont){
		this.domObj=domObj;
		this.bit=bit;
		this.background=background;
		this.rotatez=rotatez;
		this.colorlinear=colorlinear;
		this.strok=strok;
		this.arr=arr;
		this.minfont=minfont;
		this.dom=null
		let height=parseInt(getStyle(this.domObj,"height"));
		let width=parseInt(getStyle(this.domObj,"width"));
		this.creatUI=function(){
				this.dom=document.createElement("div");
				this.dom.style.backgroundPosition=`${-1*Math.floor(Math.random()*width/2)}px 0`
				this.dom.style.cssText=`width:${width}px;height:${height}px; border:1px solid blue;display: flex;align-items:center;justify-content: center;background:url(${this.background});background-size:${2*width}px;${height}px;background-position:0 0;`
				this.domObj.appendChild(this.dom);
		}
		var str1="";
		var dir;
		var chidDom;
		this.change=function(){
			this.dom.innerHTML = ""
			for(var m=0;m<this.bit;m++){
			str1=this.arr[Math.floor(Math.random()*this.arr.length)]
			chidDom=document.createElement("p");
			chidDom.innerHTML=str1;
			chidDom.style.cssText=`display: inline-block;margin-right: 5px;font-weight: 600;background:linear-gradient(to right,${this.colorlinear});-webkit-background-clip: text;color: transparent;-webkit-text-stroke: 1px ${this.strok};`;
			chidDom.style.fontSize=this.minfont+Math.floor(Math.random()*(width/4-this.minfont))+"px";
			dir=Math.floor(Math.random()*2)<1?-1:1
			chidDom.style.transform=`rotateZ(${dir*Math.floor(Math.random()*this.rotatez)}deg)`;
			this.dom.appendChild(chidDom);
			}
		}

	}




	// var box1=new Checkma($("#box"),4,"3.png",45,"red , blue","red",[1,2,3],24)
 // box1.creatUI();
 // box1.change();