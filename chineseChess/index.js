var express = require("express");
var app = express();
var vHost = require('express-vhost');
var http = require("http").Server(app);
var io = require("socket.io")(http);
var cookieParser = require('cookie-parser')();
var session = require('cookie-session')({
		secret : 'secret'
	});

app.use(cookieParser);
app.use(session);
/***********************************************************************/

var server = app.listen(3000, function () {
		var host = this.address().address;
		var port = this.address().port;
		console.log(this.address());
	});

vHost.register('www.pointsgame.com', app);

/***********************************************************************/

//设置静态目录
var options = {
	setHeaders : function (res, path, stat) {}
}
app.use(express.static("public", options));

app.use(function (req, res, next) {
	res.locals.user = "test";
	// res.locals.authenticated = ! req.user.anonymous;
	next();
});


/*************************************************/

//登录接口
app.post("/loginRequest", function (req, res) {
	req.on("data", function (data) {
		console.log(JSON.parse(data).user);
		res.send({
			result : 0,
			msg : "登录成功"
		});
	});

	// req.on("end", function() {
	// console.log("end!");
	// })
});

//注册接口
app.post("/registerRequest", function (req, res) {
	req.on("data", function (data) {
		console.log(JSON.parse(data));
	});
	req.on("end", function () {
		console.log("end!");
	})
});

/**************************************************************/
	
//设置io session
io.use(function (socket, next) {
	var req = socket.handshake;
	var res = {};
	cookieParser(req, res, function (err) {
		if (err)
			return next(err);
		session(req, res, next);
	});
});

//实时消息模块
io.listen(server);
var pNsp = io.of('/player');
pNsp.on('connection', function (socket) {
	socket.handshake.session = {};
	//监听用户签到
	socket.on("check_in_player", function (data) {
		console.log("player: " + data);
		socket.handshake.session.player = data;

		//按需要提取players或tables列表
		//...
		var globalData = {
			players : {
				idxxx0001 : {
					status : {
						value : "",
						partner : "",
						location : ""
					},
					info : {
						win : 12,
						lose : 12,
						draw : 12
					}
				}
			},
			cRoom : {
				name : "自由对弈区",
				tables : memData["rTables"],
				status : "left",
				owner : "system",
				count : {
					empty : 1,
					sum : 2
				}
			},
			rooms : [{
					name : "自由对弈区",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室2",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室3",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室4",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室5",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室6",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				}, {
					name : "嘻唰唰棋室7",
					id : "rTables",
					owner : "idxxx0001",
					count : {
						empty : 1,
						sum : 2
					}
				},
			]
		};

		//返回该列表
		var pChannel = socket.handshake.session.player
			pNsp.emit(pChannel, {
				type : "global",
				channel : pChannel,
				data : globalData,
				time : "32432"
			});
		console.log("Session: ", socket.handshake.session);
	});

	socket.on("player_message", function (data) {});

	/**************************************************************************************/
	//监听Room签到
	socket.on("check_in_room", function (data) {
		socket.handshake.session.room = data;

		//更新Room数据
		var roomInfo = memData[socket.handshake.session.room];

		console.log("room: " + socket.handshake.session.room);

		//返回Room数据
		var tChannel = socket.handshake.session.room;
		pNsp.emit(tChannel, {
			type : "room",
			channel : tChannel,
			data : roomInfo,
			time : "2332432"
		});
	});
	/**************************************************************************************/
	//玩家签到
	socket.on("check_in_table", function (data) {
		var arr = data.split("_");
		if (arr.length === 0) {
			socket.handshake.session.table = arr[0];
		} else {
			socket.handshake.session.room = arr[0];
			socket.handshake.session.table = arr[1];
		}

		//定位游戏Table
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		var player = socket.handshake.session.player;

		if (memData.tableExist(room, table, player)) {
			if(memData.countPlayers(room, table) !== 2) {
				memData.playerCome(room, table, player);
				//通知参与者 返回Table数据
				var tChannel = room + "_" + table;
				pNsp.emit(tChannel, {
					type : "playerCome",
					player : player,
					table : memData[room][table],
					time : (new Date()).getTime(),
					gName : "chess" //game name
				});
			}
			else { //当游戏Table人数满后
				var pChannel = socket.handshake.session.player;
				pNsp.emit(pChannel, {
					type : "enterTableFailed",
					channel : pChannel,
					player : player,
					time : (new Date()).getTime()
				});		
			}
			
		} else if (room === "rTables" && table === socket.handshake.session.player) {
			memData.initPlayerTable(room, table);
			memData.playerCome(room, table, player);

			//通知参与者 返回Table数据
			var tChannel = room + "_" + table;
			pNsp.emit(tChannel, {
				type : "tableInfo",
				channel : tChannel,
				player : player,
				table : memData[room][table],
				time : (new Date()).getTime()
			});
		} else {
			var pChannel = socket.handshake.session.player;
			pNsp.emit(pChannel, {
				type : "enterTableFailed",
				channel : pChannel,
				player : player,
				time : (new Date()).getTime()
			});			
		}

	});

	//玩家准备好
	socket.on("player_ready", function (data) {
		//更新Table玩家信息和状态信息
		console.log("player_ready");
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.tableExist(room, table, player)) {
			//准备
			memData.playerReady(room, table, player);
			//更新用户名称
			memData[room][table].info.players[player].name = data.pName;

			//接受第一个预备的Table数据
			if (memData.readyPlayers(room, table) === 1) {
				//初始化Current数据
				// memData.initCurrentInfo(room, table);
				//更新游戏Table数据
				memData[room][table].data = data.tData;
			}
			//通知参与者 返回Table数据
			var tChannel = room + "_" + table;
			pNsp.emit(tChannel, {
				type : "playerReady",
				player : player,
				table : memData[room][table],
				time : (new Date()).getTime(),
				gName : "chess" //game name
			});
		} else {}
	});

	//玩家走棋
	socket.on("step_perform", function (data) {
		console.log("step_perform");
		//验证Perform权限
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.playerExist(room, table, player) && memData.readyPlayers(room, table) === 2) {
			paceRule.current = memData[room][table].current;
			paceRule.data = memData[room][table].data;

			paceRule.current.opInfo = data;

			if (paceRule.checkPace(data.to[0], data.to[1]) && memData[room][table].info.players[player].side === paceRule.current.side) {

				//记录日志
				memData.recordHistory(room, table, 3);

				//执行步骤
				var tRet = paceRule.perform();

				console.log(tRet);

				if (!tRet.hasOwnProperty("winner")) {
					//通知参与者 返回Table数据
					var tChannel = room + "_" + table;
					pNsp.emit(tChannel, {
						type : "stepPerform",
						channel : tChannel,
						table : memData[room][table],
						player : player,
						time : tRet.time
					});
				} else {
					//通知参与者 返回Table数据
					memData.gameOver(room, table, player);
					var tChannel = room + "_" + table;
					pNsp.emit(tChannel, {
						type : "gameOver",
						channel : tChannel,
						winner : tRet.winner,
						table : memData[room][table],
						time : tRet.time
					});
				}
			}

		} else {
			console.log(player + "异常操作");
		}
	});

	//玩家认输
	socket.on("give_up", function (data) {
		//验证Perform权限
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.playerExist(room, table, player) && memData.readyPlayers(room, table) === 2) {
			memData.gameOver(room, table, player);
			//通知参与者 返回Table数据
			var tChannel = room + "_" + table;
			pNsp.emit(tChannel, {
				type : "giveUp",
				player : player,
				table : memData[room][table],
				time : (new Date()).getTime()
			});
		} else {
			console.log(player + "异常操作");
		}
	});

	socket.on("draw_game", function (data) {
		//验证Perform权限
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.playerExist(room, table, player) && memData.readyPlayers(room, table) === 2) {
			//删除该Table的上一份draw数据
			if ((!!memData[room][table].draw && !!memData[room][table].draw.request) && (!!memData[room][table].draw.answer)) {
				delete memData[room][table].draw;
			}
			if (!memData[room][table].draw) {
				memData[room][table].draw = {};
			}
			if (data.type === "request") {
				memData[room][table].draw.request = player;
			} else if (memData[room][table].draw.request !== player) {
				memData[room][table].draw.answer = data.content;
			}

			var tChannel = room + "_" + table;
			//当draw消息对话结束，初始化游戏Table
			if ((!!memData[room][table].draw.request) && (memData[room][table].draw.answer === "admit")) {
				memData.gameOver(room, table, player);
				pNsp.emit(tChannel, {
					type : "gameOver",
					channel : tChannel,
					table : memData[room][table],
				});
			} else {
				pNsp.emit(tChannel, {
					type : "drawGame",
					channel : tChannel,
					data : memData[room][table].draw,
					table : memData[room][table],
				});
			}
		} else {
			console.log(player + "异常操作");
		}
	});

	socket.on("step_back", function (data) {
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.playerExist(room, table, player) && memData.readyPlayers(room, table) === 2) {
			//删除该Table的上一份stepBack数据
			if ((!!memData[room][table].stepBack && !!memData[room][table].stepBack.request) && (!!memData[room][table].stepBack.answer)) {
				delete memData[room][table].stepBack;
			}
			if (!memData[room][table].stepBack && data.type === "request") {
				memData[room][table].stepBack = {};
			}

			if (!!memData[room][table].stepBack) {
				if (data.type === "request") {
					memData[room][table].stepBack.request = player;
				} else if (memData[room][table].stepBack.request !== player) {
					memData[room][table].stepBack.answer = data.content;
				}

				var tChannel = room + "_" + table;
				var requestId = memData[room][table].stepBack.request;

				if ((!!requestId) && (memData[room][table].stepBack.answer === "admit")) {
					if (memData[room][table].current.side === memData[room][table].info.players[requestId].side) {
						memData.stepBack(room, table, 2);
					} else {
						memData.stepBack(room, table, 1);
					}
				}

				pNsp.emit(tChannel, {
					type : "stepBack",
					channel : tChannel,
					data : memData[room][table].stepBack,
					table : memData[room][table],
				});
			}
		} else {
			console.log(player + "异常操作");
		}
	});

	//监听用户离开
	socket.on("leave_table", function (data) {
		//更新Table数据
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.tableExist(room, table)) {
			memData.playerLeave(room, table, player);

			//通知参与者
			var tChannel = room + "_" + table;
			pNsp.emit(tChannel, {
				type : "leaveTable",
				player : player,
				table : memData[room][table],
				time : (new Date()).getTime()
			});
		} else {}

	});

	//用户离线
	socket.on('disconnect', function () {
		var player = socket.handshake.session.player;
		var room = socket.handshake.session.room;
		var table = socket.handshake.session.table;
		if (memData.tableExist(room, table)) {
			memData.playerLeave(room, table, player);
		}
		//通知参与者
		if (memData.tableExist(room, table)) {
			//通知参与者
			var tChannel = room + "_" + table;
			pNsp.emit(tChannel, {
				type : "leaveTable",
				channel : tChannel,
				player : player,
				table : memData[room][table],
				time : "2332432"
			});
		}
		console.log(player + " is disconnected!");

	});
});

/***************************************************************************************/
var dataMap = {
	sides : ["A", "B"],
	color : {
		A : "红方",
		B : "蓝方"
	}
}

var memData = {
	rTables : {},
	initPlayerTable : function (rId, tId) {
		this[rId][tId] = {};
		this[rId][tId].info = {
			players : {},
			start : "",
			name : "",
			owner : "",
			count : ""
		};
		this[rId][tId].data = {};
		//初始化Current数据
		this.initCurrentInfo(rId, tId);
		this[rId][tId].history = [];
	},
	initCurrentInfo : function (rId, tId) {
		delete this[rId][tId].current;
		this[rId][tId].current = {
			side : "A",
			timer : 28,
			count : 0,
			opInfo : {
				object : {
					role : "",
					side : ""
				},
				from : [0, 0],
				to : [0, 0]
			}
		};
	},
	recordHistory : function (rId, tId, length) {
		var step = {}
		step.from = {
			pos : [this[rId][tId].current.opInfo.from[0], this[rId][tId].current.opInfo.from[1]],
			role : this[rId][tId].current.opInfo.object.role,
			side : this[rId][tId].current.opInfo.object.side
		};
		var x = this[rId][tId].current.opInfo.to[0];
		var y = this[rId][tId].current.opInfo.to[1];
		step.to = {
			pos : [x, y],
			role : roleRule.checkPos(x, y, this[rId][tId].data) ? this[rId][tId].data[x][y].role : "",
			side : roleRule.checkPos(x, y, this[rId][tId].data) ? this[rId][tId].data[x][y].side : ""
		};
		this[rId][tId].history.push(step);
	},
	stepBack : function (rId, tId, n) {
		var history = this[rId][tId].history;
		var len = history.length;
		var tData = this[rId][tId];
		for (var i = 0; i < n && len > 0; i++) {
			//table棋子数据
			if (history[len - 1].to.role === "") {
				delete tData.data[history[len - 1].to.pos[0]][history[len - 1].to.pos[1]];
			} else {
				tData.data[history[len - 1].to.pos[0]][history[len - 1].to.pos[1]].side = history[len - 1].to.side;
				tData.data[history[len - 1].to.pos[0]][history[len - 1].to.pos[1]].role = history[len - 1].to.role;
			}

			if (!tData.data[history[len - 1].from.pos[0]]) {
				tData.data[history[len - 1].from.pos[0]] = {};
			} else if (!this[rId][tId].data[history[len - 1].from.pos[0]][history[len - 1].from.pos[1]]) {
				tData.data[history[len - 1].from.pos[0]][history[len - 1].from.pos[1]] = {};
			}

			tData.data[history[len - 1].from.pos[0]][history[len - 1].from.pos[1]].side = history[len - 1].from.side;
			tData.data[history[len - 1].from.pos[0]][history[len - 1].from.pos[1]].role = history[len - 1].from.role;
			//Current数据
			//记录步数,切换Turn
			tData.current.count--;
			tData.current.side = dataMap.sides[tData.current.count % 2];

			//history数据
			history.length = history.length - 1;
			len = history.length;
		}
	},
	tableExist : function (rId, tId) {
		var ret = false;
		if (typeof(this[rId]) !== "undefined" && typeof(this[rId][tId]) !== "undefined") {
			ret = true;
		}
		return ret;
	},
	countPlayers : function (rId, tId) {
		var i = 0;
		for (var p in this[rId][tId].info.players) {
			i++;
		}
		return i;
	},
	readyPlayers : function (rId, tId) {
		var i = 0;
		for (var p in this[rId][tId].info.players) {
			if (this[rId][tId].info.players[p].status === 1) {
				i++;
			}
		}
		return i;
	},
	playerExist : function (rId, tId, pId) {
		var ret = false;
		if (this.tableExist(rId, tId)) {
			var gTable = this[rId][tId];
			if (gTable.info.players[pId] !== undefined) {
				ret = true;
			}
		}
		return ret;
	},
	getPartner : function (rId, tId, pId) {
		var gTable = this[rId][tId];
		for (var p in gTable.info.players) {
			if (p !== pId) {
				return gTable.info.players[p];
			}
		}
	},
	playerCome : function (rId, tId, pId) {
		if ((!this.playerExist(rId, tId, pId)) && this.countPlayers(rId, tId) === 0) {
			this[rId][tId].info.players[pId] = {};
			this[rId][tId].info.players[pId].status = 0;
			this[rId][tId].info.players[pId].side = 'A';
			return true;
		} else if ((!this.playerExist(rId, tId, pId)) && this.countPlayers(rId, tId) === 1) {
			console.log(pId);
			this[rId][tId].info.players[pId] = {};
			this[rId][tId].info.players[pId].status = 0;
			var s = [];
			for (var t in this[rId][tId].info.players) {
				if (t !== undefined) {
					s.push(this[rId][tId].info.players[t].side);
				}
			}
			if (s[0] === "A") {
				this[rId][tId].info.players[pId].side = 'B';
			} else {
				this[rId][tId].info.players[pId].side = 'A';
			}

		} else {
			return false;
		}
	},
	playerReady : function (rId, tId, pId) {
		if (this.playerExist(rId, tId, pId)) {
			this[rId][tId].info.players[pId].status = 1;
		}
	},
	playerLeave : function (rId, tId, pId) {
		if (this.playerExist(rId, tId, pId)) {
			delete this[rId][tId].info.players[pId];
		}
		if (this.countPlayers(rId, tId) === 0) {
			delete this[rId][tId];
		}
	},
	gameOver : function (rId, tId, pId) {
		var i = 0;
		for (var p in this[rId][tId].info.players) {
			this[rId][tId].info.players[p].status = 0;
			this[rId][tId].info.players[p].side = dataMap.sides[i % 2];
			i++;
		}
	}
};

/*****************************************************************************/

var paceRule = {
	current : {},
	data : {},
	init : function () {
		this.current.side = "A";
		this.current.count = 0;
	},
	checkPace : function (x, y) {
		var role = this.current.opInfo.object.role;
		return roleRule[role](this.current, x, y, this.data);
	},
	perform : function () {
		var from = this.current.opInfo.from;
		var tItem = {};
		var result = {
			time : (new Date()).getTime(),
			status : "failed"
		}
		if (typeof(this.data[this.current.opInfo.from[0]]) !== "undefined" && typeof(this.data[this.current.opInfo.from[0]][this.current.opInfo.from[1]]) !== "undefined") {

			result.status = "passed";
			//判断是否结束
			if (this.judgeGameResult()) {
				// alert("游戏结束，"+dataMap.color[this.current.opInfo.object.side]+"方胜利");
				result.winner = this.current.opInfo.object.side;
			}

			tItem.role = this.data[this.current.opInfo.from[0]][this.current.opInfo.from[1]].role;
			tItem.side = this.data[this.current.opInfo.from[0]][this.current.opInfo.from[1]].side;

			if (typeof(this.data[this.current.opInfo.to[0]]) === "undefined") {
				this.data[this.current.opInfo.to[0]] = {};
			}

			if (!roleRule.checkPos(this.current.opInfo.to[0], this.current.opInfo.to[1], this.data) || this.data[this.current.opInfo.to[0]][this.current.opInfo.to[1]].side !== this.current.side) {
				this.data[this.current.opInfo.to[0]][this.current.opInfo.to[1]] = tItem;
				delete this.data[this.current.opInfo.from[0]][this.current.opInfo.from[1]];
			}

			//记录步数,切换Turn
			this.current.count++;
			this.current.side = dataMap.sides[this.current.count % 2];

		}
		return result;
	},
	judgeGameResult : function () {
		var ret = false;
		if (this.data[this.current.opInfo.to[0]] !== undefined && this.data[this.current.opInfo.to[0]][this.current.opInfo.to[1]] !== undefined) {
			var t = this.data[this.current.opInfo.to[0]][this.current.opInfo.to[1]];
			if (t.role === "jiang") {
				ret = true;
			}
		}
		return ret;
	}
};

var roleRule = {
	checkPos : function (x, y, tData) {
		if (typeof(tData[x]) !== "undefined" && typeof(tData[x][y]) !== "undefined") {
			return true;
		} else {
			return false;
		}
	},
	bing : function (current, x, y) {
		var cRet = true;
		if (current.opInfo.object.side == dataMap.sides[0]) {
			if (x == current.opInfo.from[0] && y - current.opInfo.from[1] == 1) {
				cRet == true;
			} else if (y > 4 && Math.abs(x - current.opInfo.from[0]) == 1 && y == current.opInfo.from[1]) {
				cRet == true;
			} else {
				cRet = false;
			}
		} else {
			if (x == current.opInfo.from[0] && y - current.opInfo.from[1] == -1) {
				cRet = true;
			} else if (y < 5 && Math.abs(x - current.opInfo.from[0]) == 1 && y == current.opInfo.from[1]) {
				cRet = true;
			} else {
				cRet = false;
			}
		}
		return cRet;
	},
	pao : function (current, x, y, tData) {
		var i = 1;
		var cRet = true;
		if (y != current.opInfo.from[1] && x != current.opInfo.from[0]) {
			cRet = false;
		} else if (y != current.opInfo.from[1] && x == current.opInfo.from[0]) {
			var maxValue = Math.max(y, current.opInfo.from[1]);
			var minValue = Math.min(y, current.opInfo.from[1]);
			var count = 0;
			while (x == current.opInfo.from[0] && maxValue > (minValue + i)) {
				// if(this.table.rows[minValue+i].cells[x].innerHTML!="")
				if (this.checkPos(x, minValue + i, tData)) {
					count++;
				}
				i++;
			}
		} else {
			var maxValue = Math.max(x, current.opInfo.from[0]);
			var minValue = Math.min(x, current.opInfo.from[0]);
			var count = 0;
			while (y == current.opInfo.from[1] && maxValue > (minValue + i)) {
				// if(this.table.rows[y].cells[minValue+i].innerHTML!="")
				if (this.checkPos(minValue + i, y, tData)) {
					count++;
				}
				i++;
			}
		}
		// var location=this.table.rows[y].cells[x];
		// if((location.innerHTML==""&&count==0)||(location.innerHTML!=""&&count==1))
		if ((count == 0 && !(this.checkPos(x, y, tData))) || (this.checkPos(x, y, tData) && count == 1)) {
			cRet = true;
		} else {
			cRet = false;
		}
		return cRet;
	},
	jiang : function (current, x, y, tData) {
		var _this = this;
		function checkTwoJiang(current, x, y, tData) {
			var ret = true;
			if (x === current.opInfo.from[0]) {
				var minValue = Math.min(current.opInfo.from[1], y);
				var maxValue = Math.max(current.opInfo.from[1], y);
				for (var i = minValue + 1; i < maxValue; i++) {
					if (_this.checkPos(x, minValue + i, tData)) {
						return false;
					}
				}
			} else {
				ret = false;
			}
			return ret;
		}

		var cRet = true;
		var c1 = (Math.abs(x - current.opInfo.from[0]) == 1 && Math.abs(y - current.opInfo.from[1]) == 0);
		var c2 = (Math.abs(y - current.opInfo.from[1]) == 1 && Math.abs(x - current.opInfo.from[0]) == 0);
		if (c1 || c2) {
			if (x > 2 && x < 6 && y < 3 && current.opInfo.object.side == dataMap.sides[0]) {
				cRet = true;
			} else if (x > 2 && x < 6 && y > 6 && current.opInfo.object.side == dataMap.sides[1]) {
				cRet = true;
			} else {
				cRet = false;
			}
		} else {
			cRet = checkTwoJiang(current, x, y, tData);
		}
		return cRet;
	},
	shi : function (current, x, y) {
		var cRet = true;
		if (Math.abs(x - current.opInfo.from[0]) == 1 && Math.abs(y - current.opInfo.from[1]) == 1) {
			if (x > 2 && x < 6 && y < 3 && current.opInfo.object.side == dataMap.sides[0]) {
				cRet = true;
			} else if (x > 2 && x < 6 && y > 6 && current.opInfo.object.side == dataMap.sides[1]) {
				cRet = true;
			} else {
				cRet = false;
			}
		} else {
			cRet = false;
		}
		return cRet;
	},
	che : function (current, x, y, tData) {
		var i = 1;
		var cRet = true;
		if (y != current.opInfo.from[1] && x != current.opInfo.from[0]) {
			cRet = false;
		} else {
			var maxValue = Math.max(y, current.opInfo.from[1]);
			var minValue = Math.min(y, current.opInfo.from[1]);
			while (x == current.opInfo.from[0] && maxValue > (minValue + i)) {
				// if(this.table.rows[minValue+i].cells[x].innerHTML!="")
				if (this.checkPos(x, minValue + i, tData)) {
					cRet = false;
					break;
				}
				i++;
			}
			var maxValue = Math.max(x, current.opInfo.from[0]);
			var minValue = Math.min(x, current.opInfo.from[0]);
			while (y == current.opInfo.from[1] && maxValue > (minValue + i)) {
				// if(this.table.rows[y].cells[minValue+i].innerHTML!="")
				if (this.checkPos(minValue + i, y, tData)) {
					cRet = false;
					break;
				}
				i++;
			}
		}
		return cRet;
	},
	xiang : function (current, x, y, tData) {
		var cRet = true;
		if (Math.abs(x - current.opInfo.from[0]) == 2 && Math.abs(y - current.opInfo.from[1]) == 2) {
			var tPos = [(x + current.opInfo.from[0]) / 2, (y + current.opInfo.from[1]) / 2];
		} else {
			return false;
		}
		// if(!this.checkPos(tPos[0], tPos[1])&&(!this.checkPos(x, y)||this.data[x][y].object.side!=current.side))
		if (!this.checkPos(tPos[0], tPos[1], tData)) {
			if (y < 5 && current.opInfo.object.side == dataMap.sides[0]) {
				cRet = true;
			} else if (y > 4 && current.opInfo.object.side == dataMap.sides[1]) {
				cRet = true;
			} else {
				cRet = false;
			}
		} else {
			cRet = false;
		}
		return cRet;
	},
	ma : function (current, x, y, tData) {
		var cRet = true;
		if (Math.abs(x - current.opInfo.from[0]) == 1 && Math.abs(y - current.opInfo.from[1]) == 2) {
			var tPos = [current.opInfo.from[0], (y + current.opInfo.from[1]) / 2];
		} else if (Math.abs(x - current.opInfo.from[0]) == 2 && Math.abs(y - current.opInfo.from[1]) == 1) {
			var tPos = [(x + current.opInfo.from[0]) / 2, current.opInfo.from[1]];
		} else {
			return false;
		}
		if (!this.checkPos(tPos[0], tPos[1], tData)) {
			cRet = true;
		} else {
			cRet = false;
		}
		return cRet;
	}
};
