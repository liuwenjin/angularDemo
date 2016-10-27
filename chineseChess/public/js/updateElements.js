/****************************************/
//模板HTML字符串与JSON对象绑定
String.prototype.bindData = function(obj, type) {
    return this.replace(/\$\w+\$/gi, function(m) {
        var rString = obj[m.replace(/\$/g, "")];           
        return (rString + "") == "undefined"? "": rString;
    });
}
/*
用JSON的按模板HTML字符串初始化网页元素(可以重复更新，与jsonObj未建立绑定关系)
@template: Textarea类型的模板
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.updateViewByTextAreaTemplate=function(template, jsonObj) {
	if(typeof(jsonObj.length)!="number")
	{
		if(template.localName=="textarea") {
			this.innerHTML=template["value"].bindData(jsonObj);
		}
		else
		{
			this.innerHTML=template.innerHTML.bindData(jsonObj);
		}
	}
	else if(typeof(jsonObj)=='object'&&jsonObj.length>0) {
		if(template.localName=="textarea") {
			var html=template["value"].bindData(jsonObj[0]);
			for(var i=1; i<jsonObj.length; i++) {
				html=html+template["value"].bindData(jsonObj[i]);
			}
			this.innerHTML=html;
		}
		else
		{
			var html=template.innerHTML.bindData(jsonObj[0]);
			for(var i=1; i<jsonObj.length; i++) {
				html=html+template.innerHTML.bindData(jsonObj[i]);
			}
			this.innerHTML=html;
		}
	}	
}
/*
用JSON的按模板HTML字符串初始化Table元素(可以重复更新，与jsonObj未建立绑定关系)
@template: Table类型的模板
@index: 标识用template的第几行内容初始化网页元素
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.updateViewByRowTemplate=function(template, index, jsonObj) {
	if(this.localName=="table"&&template.localName=="table"&&template.rows.length>1+index)
	{
		this.innerHTML="";
		var head=this.insertRow(0);
		head.innerHTML=template.rows[index].innerHTML;
		if(typeof(jsonObj)=='object'&&typeof(jsonObj.length)!="number")
		{
			var dRow=this.insertRow(this.rows.length);
			dRow.innerHTML=template.rows[index].innerHTML.bindData(jsonObj);
		}
		else if(typeof(jsonObj)=='object'&&jsonObj.length>0)
		{
			for(var i=1; i<jsonObj.length; i++) {
				var dRow=this.insertRow(this.rows.length);
				dRow.innerHTML=template.rows[index+1].innerHTML.bindData(jsonObj[i]);
			}
		}
	}	
}

/*
用JSON的按模板HTML字符串给Table添加一行(可以重复更新，与jsonObj未建立绑定关系)
@location: 插入行的位置
@template: Table类型的模板
@index: 标识用template的第几行内容初始化网页元素
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.insertRowByRowTemplate=function(location, template, index, jsonObj) {
	if(this.localName=="table"&&template.localName=="table"&&template.rows.length>index)
	{
		if(typeof(jsonObj)=='object'&&typeof(jsonObj.length)!="number")
		{
			var dRow=this.insertRow(location);
			dRow.innerHTML=template.rows[index].innerHTML.bindData(jsonObj);
		}
		else if(jsonObj.length>0)
		{
			for(var i=0; i<jsonObj.length; i++) {
				var dRow=this.insertRow(location+i);
				dRow.innerHTML=template.rows[index].innerHTML.bindData(jsonObj[i]);
			}
		}
	}	
}

/*
用JSON的按模板HTML字符串更新Table中某一行(可以重复更新，与jsonObj未建立绑定关系)
@location: 更新的位置, 整型数值
@template: Table类型的模板
@index: 标识用template的第几行内容初始化网页元素
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.updateRowByRowTemplate=function(location, template, index, jsonObj) {
	if(this.localName=="table"&&template.localName=="table"&&template.rows.length>index)
	{
		if(typeof(jsonObj)=='object'&&typeof(jsonObj.length)!="number")
		{
			this.rows[location].innerHTML=template.rows[index].innerHTML.bindData(jsonObj);
		}
		else if(jsonObj.length>0)
		{
			for(var i=0; i<jsonObj.length&&location+i<this.rows.length; i++) {
				this.rows[location+i].innerHTML=template.rows[index].innerHTML.bindData(jsonObj[i]);
			}
		}
	}	
}

/*
用JSON的按Table单元格模板HTML字符串更新Table中某个或某些位置连续的单元格(可以重复更新，与jsonObj未建立绑定关系)
@pos: 更新连续单元格的开始位置
@type: 更新单元格列表的类型(横向:horizontal，纵向:vertical或斜向:diagonal)
@template: Table类型的模板
@tPos: 所用模板元素的位置
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.updateCellByCellTemplate=function(pos, type, template, tPos, jsonObj) {
	if(this.localName=="table"&&template.localName=="table")
	{
		if(typeof(jsonObj)=='object'&&typeof(jsonObj.length)!="number")
		{
			this.rows[pos[1]].cells[pos[0]].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj);
		}
		else if(jsonObj.length>0)
		{
			if(type=="horizontal")
			{
				for(var i=0; i<jsonObj.length&&pos[0]+i<this.rows[pos[1]].cells.length; i++) {
					this.rows[pos[1]].cells[pos[0]+i].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj[i]);
				}
			}
			else if(type=="vertical")
			{
				for(var i=0; i<jsonObj.length&&pos[1]+i<this.rows.length; i++) {
					this.rows[pos[1]+i].cells[pos[0]].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj[i]);
				}
			}
			else if(type=="diagonal")
			{
				for(var i=0; i<jsonObj.length&&pos[1]+i<this.rows.length&&this.rows[pos[1]+i].cells.length; i++) {
					this.rows[pos[1]+i].cells[pos[0]+i].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj[i]);
				}
			}
		}
	}	
}
/*
用JSON的按textarea模板HTML字符串更新Table中某个或某些位置连续的单元格(可以重复更新，与jsonObj未建立绑定关系)
@pos: 更新连续单元格的开始位置
@type: 更新单元格列表的类型(横向:horizontal，纵向:vertical或斜向:diagonal)
@template: Table类型的模板
@tPos: 所用模板元素的位置
@jsonObj: 需要绑定的jsonObject
*/
HTMLElement.prototype.updateCellByTextAreaTemplate=function(pos, type, template, jsonObj) {
	if(this.localName=="table"&&template.localName=="textarea")
	{
		if(typeof(jsonObj)=='object'&&typeof(jsonObj.length)!="number")
		{
			this.rows[pos[1]].cells[pos[0]].innerHTML=template.value.bindData(jsonObj);
		}
		else if(jsonObj.length>0)
		{
			if(type=="horizontal")
			{
				for(var i=0; i<jsonObj.length&&pos[0]+i<this.rows[pos[1]].cells.length; i++) {
					this.rows[pos[1]].cells[pos[0]+i].innerHTML=template.value.bindData(jsonObj[i]);
				}
			}
			else if(type=="vertical")
			{
				for(var i=0; i<jsonObj.length&&pos[1]+i<this.rows.length; i++) {
					this.rows[pos[1]+i].cells[pos[0]].innerHTML=template.value.bindData(jsonObj[i]);
				}
			}
			else if(type=="diagonal")
			{
				for(var i=0; i<jsonObj.length&&pos[1]+i<this.rows.length&&this.rows[pos[1]+i].cells.length; i++) {
					this.rows[pos[1]+i].cells[pos[0]+i].innerHTML=template.value.bindData(jsonObj[i]);
				}
			}
		}
	}	
}

/*
用JSON的按Table单元格模板HTML字符串更新Table中某个或某些位置不连续连续的单元格(可以重复更新，与jsonObj未建立绑定关系)
@jsonObj: data以及相应的单元格位置信息, 可以是单个对象也可是数组 {object:{name: 'king', value: '2222'}, to:[]}
@template: Table类型的模板
@tPos: 所用模板元素的位置
*/
HTMLElement.prototype._updateCellByCellTemplate=function(jsonObj, template, tPos) {
	if(this.localName=="table"&&template.localName=='table'&&typeof(jsonObj)=='object')
	{
		if(typeof(jsonObj.length)=="number")
		{
			for(var i=0; i<jsonObj.length; i++)
			{
				if(this.rows.length>jsonObj[i].to[1]&&this.rows[jsonObj[i].to[1]].cells.length>jsonObj[i].to[0]&&template.rows.length>tPos[1]&&template.rows[tPos[1]].cells.length>tPos[0])
				{
					this.rows[jsonObj[i].to[1]].cells[jsonObj[i].to[0]].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj[i].object);
				}
				else
				{
					console.log("更新单元格失败，当前Table中没有该单元格"+jsonObj[i].to+"或者所用模板单元格("+tPos+")不存在");
				}
			}
		}
		else
		{
			if(this.rows.length>jsonObj.to[1]&&this.rows[jsonObj.to[1]].cells.length>jsonObj.to[0])
			{
				this.rows[jsonObj.to[1]].cells[jsonObj.to[0]].innerHTML=template.rows[tPos[1]].cells[tPos[0]].innerHTML.bindData(jsonObj.object);
			}	
			else
			{
				console.log("更新单元格失败，当前Table中没有该单元格"+jsonObj.to);
			}
		}
	}
}

/*
用JSON的按textarea模板HTML字符串更新Table中某个或某些位置不连续连续的单元格(可以重复更新，与jsonObj未建立绑定关系)
@jsonObj: data以及相应的单元格位置信息, 可以是单个对象也可是数组 {object:{name: 'king', value: '2222'}, to:[]}
@template: Textarea或其他类型的模板
@tPos: 所用模板元素的位置
*/
HTMLElement.prototype._updateCellByTextAreaTemplate=function(jsonObj, template) {
	if(this.localName=="table"&&typeof(jsonObj)=='object')
	{
		if(typeof(jsonObj.length)=="number")
		{
			for(var i=0; i<jsonObj.length; i++)
			{
				if(this.rows.length>jsonObj[i].to[1]&&this.rows[jsonObj[i].to[1]].cells.length>jsonObj[i].to[0])
				{
					if(template.localName=='textarea')
					{
						this.rows[jsonObj[i].to[1]].cells[jsonObj[i].to[0]].innerHTML=template.value.bindData(jsonObj[i].object);
					}
					else
					{
						this.rows[jsonObj[i].to[1]].cells[jsonObj[i].to[0]].innerHTML=template.innerHTML.bindData(jsonObj[i].object);
					}
					
				}
				else
				{
					console.log("更新单元格失败，当前Table中没有该单元格"+jsonObj[i].to);
				}
			}
		}
		else
		{
			if(this.rows.length>jsonObj.to[1]&&this.rows[jsonObj.to[1]].cells.length>jsonObj.to[0])
			{
				if(template.localName=='textarea')
				{
					this.rows[jsonObj.to[1]].cells[jsonObj.to[0]].innerHTML=template.value.bindData(jsonObj.object);
				}
				else
				{
					this.rows[jsonObj.to[1]].cells[jsonObj.to[0]].innerHTML=template.innerHTML.bindData(jsonObj.object);
				}				
			}	
			else
			{
				console.log("更新单元格失败，当前Table中没有该单元格"+jsonObj.to);
			}
		}
	}
}
