
function initialIndexView() {
	//初始化
	chessGame.initialGame(chessRule);
	chessGame.autoRecoverTable();

	//显示预备对话框
	chessDialog.ready();

	$(".drawGameBtn").click(function () {
		chessDialog.confirmDraw();
	});
	$(".stepBackBtn").click(function () {
		chessDialog.confirmStepBack();
	});

	$(".giveUpBtn").click(function () {
		chessDialog.confirmGiveUp();
	});

	$("#gameOption .shareBtn").click(function () {
		if(playerInterface.countPlayers() === 2) {
			chessDialog.qrCodeView(location.href, "full");
		}
		else {
			chessDialog.qrCodeView(location.href);
		}
		
	});
	
	$("#gameOption .exitBtn").click(function () {
		chessDialog.confirmExitGame(location.protocol + "//" + location.host + rPath + "/userAdmin");
	});

}

var chessGame = {
	chessRule : {},
	initialGame : function () {
		this.chessRule = chessRule;
		this.chessRule.init($("#chessmanTable")[0], $("#chessTemplate")[0].rows[0].cells[0]);
		//初始化chessRule中paceRule的Data
		this.chessRule.paceRule.data = this.transferData();
	},
	startGame : function () {
		this.chessRule.startChess();
	},
	pauseGame : function () {
		var _this = this;
		this.chessRule.pauseChess();
		$(".startGameBtn").unbind();
		$(".startGameBtn").click(function () {
			_this.startGame();
		});
		$(".startGameBtn").html("开始棋局");
	},
	autoRecoverTable : function () {

		//清空游戏Table
		this.chessRule.emptyChessTable();

		//初始化chessRule中paceRule
		this.chessRule.paceRule.init();
		this.chessRule.paceRule.data = this.transferData();

		//更新棋盘棋子
		this.chessRule.table._updateCellByTextAreaTemplate(this.data, this.chessRule.tempChess);

	},
	transferData : function () {
		var tData = {};
		var data = this.data;
		for (var i = 0; i < data.length; i++) {
			if (typeof(tData[data[i].to[0]]) === "undefined") {
				tData[data[i].to[0]] = {};
			}
			tData[data[i].to[0]][data[i].to[1]] = data[i].object;
		}
		return tData;
	},
	_transforData : function (data) {
		var tData = [];
		for (var r in data) {
			for (var c in data[r]) {
				var chess = {
					object : {
						role : data[r][c].role,
						side : data[r][c].side
					},
					to : [r, c]
				}
				tData.push(chess);
			}
		}
		return tData;
	},
	getTableData : function () {
		var tData = {};
		var cSelector = $(this.chessRule.table).find("tr>td>label");
		for (var i = 0; i < cSelector.length; i++) {
			var c = cSelector[i].parentNode.cellIndex;
			var r = cSelector[i].parentNode.parentNode.rowIndex;
			if (typeof(tData[c]) === "undefined") {
				tData[c] = {};
			}
			tData[c][r] = {};
			tData[c][r].role = cSelector[i].getAttribute("name");
			tData[c][r].side = cSelector[i].getAttribute("class");
		}
		return tData;
	},
	data : [{
			object : {
				role : "che",
				side : "A"
			},
			to : [0, 0]
		}, {
			object : {
				role : "ma",
				side : "A"
			},
			to : [1, 0]
		}, {
			object : {
				role : "xiang",
				side : "A"
			},
			to : [2, 0]
		}, {
			object : {
				role : "shi",
				side : "A"
			},
			to : [3, 0]
		}, {
			object : {
				role : "jiang",
				side : "A"
			},
			to : [4, 0]
		}, {
			object : {
				role : "shi",
				side : "A"
			},
			to : [5, 0]
		}, {
			object : {
				role : "xiang",
				side : "A"
			},
			to : [6, 0]
		}, {
			object : {
				role : "ma",
				side : "A"
			},
			to : [7, 0]
		}, {
			object : {
				role : "che",
				side : "A"
			},
			to : [8, 0]
		}, {
			object : {
				role : "pao",
				side : "A"
			},
			to : [1, 2]
		}, {
			object : {
				role : "pao",
				side : "A"
			},
			to : [7, 2]
		}, {
			object : {
				role : "bing",
				side : "A"
			},
			to : [0, 3]
		}, {
			object : {
				role : "bing",
				side : "A"
			},
			to : [2, 3]
		}, {
			object : {
				role : "bing",
				side : "A"
			},
			to : [4, 3]
		}, {
			object : {
				role : "bing",
				side : "A"
			},
			to : [6, 3]
		}, {
			object : {
				role : "bing",
				side : "A"
			},
			to : [8, 3]
		}, {
			object : {
				role : "bing",
				side : "B"
			},
			to : [0, 6]
		}, {
			object : {
				role : "bing",
				side : "B"
			},
			to : [2, 6]
		}, {
			object : {
				role : "bing",
				side : "B"
			},
			to : [4, 6]
		}, {
			object : {
				role : "bing",
				side : "B"
			},
			to : [6, 6]
		}, {
			object : {
				role : "bing",
				side : "B"
			},
			to : [8, 6]
		}, {
			object : {
				role : "pao",
				side : "B"
			},
			to : [1, 7]
		}, {
			object : {
				role : "pao",
				side : "B"
			},
			to : [7, 7]
		}, {
			object : {
				role : "che",
				side : "B"
			},
			to : [0, 9]
		}, {
			object : {
				role : "ma",
				side : "B"
			},
			to : [1, 9]
		}, {
			object : {
				role : "xiang",
				side : "B"
			},
			to : [2, 9]
		}, {
			object : {
				role : "shi",
				side : "B"
			},
			to : [3, 9]
		}, {
			object : {
				role : "jiang",
				side : "B"
			},
			to : [4, 9]
		}, {
			object : {
				role : "shi",
				side : "B"
			},
			to : [5, 9]
		}, {
			object : {
				role : "xiang",
				side : "B"
			},
			to : [6, 9]
		}, {
			object : {
				role : "ma",
				side : "B"
			},
			to : [7, 9]
		}, {
			object : {
				role : "che",
				side : "B"
			},
			to : [8, 9]
		}
	]
};

var dataMap = {
	sides : ["A", "B"],
	color : {
		A : "红方",
		B : "蓝方"
	}
}

var chessRule = {
	paceRule : {},
	table : {},
	tempChess : {},
	init : function (table, tChess) {
		this.paceRule = paceRule;
		this.table = table;
		this.tempChess = tChess;
	},
	perform : function (x, y) {
		var chessman = this.table.rows[y].cells[x].getElementsByTagName("label")[0];
		if (this.paceRule.current.opInfo.from.length == this.paceRule.current.opInfo.to.length) {
			if (typeof(chessman) != "undefined" && this.paceRule.current.side == chessman.className) {
				chessman.parentNode.className = "selected";
				this.paceRule.current.opInfo.object.role = chessman.attributes["name"].nodeValue;
				this.paceRule.current.opInfo.object.side = chessman.className;
				this.paceRule.current.opInfo.from[0] = x;
				this.paceRule.current.opInfo.from[1] = y;
				this.paceRule.current.opInfo.to.length = 0;
			}
		} else if (typeof(chessman) != "undefined" && this.paceRule.current.opInfo.object.side == chessman.className) {
			var older = this.table.rows[this.paceRule.current.opInfo.from[1]].cells[this.paceRule.current.opInfo.from[0]];
			older.className = "";
			chessman.parentNode.className = "selected";
			this.paceRule.current.opInfo.object.role = chessman.attributes["name"].nodeValue;
			this.paceRule.current.opInfo.object.side = chessman.className;
			this.paceRule.current.opInfo.from[0] = x;
			this.paceRule.current.opInfo.from[1] = y;
			this.paceRule.current.opInfo.to.length = 0;
		} else if (this.paceRule.checkPace(x, y) && (typeof(chessman) == "undefined" || this.paceRule.current.opInfo.object.side != chessman.className)) {
			this.paceRule.current.opInfo.to[0] = x;
			this.paceRule.current.opInfo.to[1] = y;

			//调整Table显示
			this.dealPerform();

			//记录步数,切换Turn
			this.paceRule.current.count++;
			this.paceRule.current.side = dataMap.sides[this.paceRule.current.count % 2];
		}
	},
	dealPerform : function () {

		// this.paceRule.perform();

		this.table.rows[this.paceRule.current.opInfo.to[1]].cells[this.paceRule.current.opInfo.to[0]].innerHTML = this.table.rows[this.paceRule.current.opInfo.from[1]].cells[this.paceRule.current.opInfo.from[0]].innerHTML;
		var older = this.table.rows[this.paceRule.current.opInfo.from[1]].cells[this.paceRule.current.opInfo.from[0]];
		older.className = "";
		older.innerHTML = "";

		//发送走棋步骤
		playerInterface.stepPerformRequest(this.paceRule.current.opInfo);

	},
	updateChessTable : function () {
		this.emptyChessTable();
		for (var i in this.paceRule.data) {
			for (var j in this.paceRule.data[i]) {
				var location = this.table.rows[i].cells[j];
				location.updateViewByTextAreaTemplate(this.tempChess, this.paceRule.data[i][j]);
			}
		}
	},
	placeChessman : function (x, y, chess) {
		var location = this.table.rows[y].cells[x];
		location.updateViewByTextAreaTemplate(this.tempChess, chess);
		location.setAttribute("class", "");
		var older = this.table.rows[this.paceRule.current.opInfo.from[1]].cells[this.paceRule.current.opInfo.from[0]];
		older.className = "";
		older.innerHTML = "";
	},
	emptyChessTable : function () {
		$(this.table).find("td").html("");
		$(this.table).find("td").attr("class", "");
	},
	startChess : function () {
		var _this = this;
		$(this.table).find("td").unbind();
		$(this.table).find("td").click(function () {
			if (playerInterface.table.players[playerInterface.id].side === _this.paceRule.current.side) {
				_this.perform(this.cellIndex, this.parentNode.rowIndex);
			} else {
				// alert("等待对方走棋");
			}

		});
	},
	pauseChess : function () {
		$(this.table).find("td").unbind();
	}
};

var paceRule = {
	current : {
		side : "A",
		timer : 28,
		status : "0",
		count : 0,
		opInfo : {
			object : {
				role : "che",
				side : "A"
			},
			from : [2, 3],
			to : [2, 2]
		}
	},
	data : {
		0 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		1 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		2 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		3 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		4 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		5 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		6 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		7 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		},
		8 : {
			0 : {
				role : "che",
				side : "A"
			},
			3 : {
				role : "bing",
				side : "A"
			},
			6 : {
				role : "bing",
				side : "B"
			},
			9 : {
				role : "che",
				side : "B"
			}
		}
	},

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
		if (typeof(this.data[this.current.opInfo.from[0]]) !== "undefined" && typeof(this.data[this.current.opInfo.from[0]][this.current.opInfo.from[1]]) !== "undefined") {

			//判断是否结束
			// if(this.judgeGameResult()) {
			// alert("游戏结束，"+dataMap.color[this.current.opInfo.object.side]+"方胜利");
			// }

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
}

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
}

var chessDialog = {
	ready : function () {
		$("#chessTableModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title">开始游戏</h4>'
				 + '</div>'
				 + '<div class="modal-body">'
				 + '<p class="row">'
				 + '<div class="col-lg-12">'
				 + '<div class="input-group input-group-lg">'
				 + '<span class="input-group-addon input-group-addon-lg" id="basic-addon1">签名</span>'
				 + '<input type="text" class="form-control form-control-lg userName" placeholder="输入2~16个字符">'
				 + '</div>'
				 + '</div>'
				 + '</p>'
				 + '<p class="row">'
				 + '<button type="button" class="btn btn-primary btn-lg gameReadyBtn">准备</button>'
				 + '</p>'
				 + '</div>');
		content.appendTo($("#chessTableModal .modal-content"));

		if (!!$.cookie('user')) {
			$("#chessTableModal .userName").val($.cookie('user'));
		}

		$('#chessTableModal').modal({
			backdrop : false,
			keyboard : false
		});

		//绑定游戏准备按钮事件
		$("#chessTableModal .gameReadyBtn").unbind();
		$("#chessTableModal .gameReadyBtn").click(function () {
			var data = {
				tData : chessGame.chessRule.paceRule.data,
				pName : $("#chessTableModal .userName").val()
			};
			playerInterface.gameReadyRequest(data);
			$.cookie('user', $("#chessTableModal .userName").val());
		});
	},
	leaveTable : function () {},
	gameOver : function (str) {
		$("#chessTableModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title">游戏结束</h4>'
				 + '</div>'
				 + '<div class="modal-body content-text">'
				 + '<p class="row">'
				+str
				 + '</p>'
				 + '<p class="row">'
				 + '<button type="button" class="btn btn-primary btn-lg gameReadyBtn">再来一局</button>'
				 + '</p>'
				 + '</div>');
		content.appendTo($("#chessTableModal .modal-content"));

		$('#chessTableModal').modal({
			backdrop : false,
			keyboard : false
		});

		$("#chessTableModal .gameReadyBtn").click(function () {
			chessGame.autoRecoverTable();
			var data = {
				tData : chessGame.chessRule.paceRule.data,
				pName : $.cookie('user')
			};
			playerInterface.gameReadyRequest(data);
		});

	},
	confirmGiveUp : function () {
		this.confirm("确认要认输吗？");

		$("#confirmModal .btn-primary").click(function () {
			playerInterface.giveUpRequest();
			$('#confirmModal').modal("hide");
		});
		$("#confirmModal .btn-default").click(function () {
			$('#confirmModal').modal("hide");
		});
	},
	confirmDraw : function () {
		this.confirm("确认要和棋吗？");

		$("#confirmModal .btn-primary").click(function () {
			playerInterface.drawGameRequest({
				type : "request"
			});
			$('#confirmModal').modal("hide");
		});
		$("#confirmModal .btn-default").click(function () {
			$('#confirmModal').modal("hide");
		});
	},
	confirmStepBack : function (str) {
		this.confirm('确认要悔棋吗？');

		$("#confirmModal .btn-primary").click(function () {
			playerInterface.stepBackRequest({
				type : "request"
			});
			$('#confirmModal').modal("hide");
		});
		$("#confirmModal .btn-default").click(function () {
			$('#confirmModal').modal("hide");
		});
	},
	confirmExitGame : function (url) {
		this.confirm("确认要退出游戏吗？");

		$("#confirmModal .btn-primary").click(function () {			
			$('#confirmModal').modal("hide");
			location.href = url;
		});
		$("#confirmModal .btn-default").click(function () {
			$('#confirmModal').modal("hide");
		});
	},	
	qrCodeView : function (url, type) {
		$("#chessTableModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title">扫码加入游戏</h4>'
				 + '</div>'
				 + '<div class="modal-body">'
				 + '<div class="qrArea"></div>'
				 + '</div>');
		content.appendTo($("#chessTableModal .modal-content"));

		$('#chessTableModal').modal({
			backdrop : false,
			keyboard : false
		});
		
		if(type) {
			$('#chessTableModal .modal-title').html("扫码创建新游戏桌面");
		}
		else {
			$('#chessTableModal .modal-title').html("扫码加入游戏");
		}

		$('#chessTableModal .qrArea').qrcode({
			width : 200,
			height : 200,
			correctLevel : 0,
			text : url
		});

		$("#chessTableModal .modal-content").click(function () {
			$('#chessTableModal').modal("hide");
		});
	},
	drawGame : function (str) {
		$("#chessTableModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title">和棋申请</h4>'
				 + '</div>'
				 + '<div class="modal-body">'
				 + '<p class="row content-text">'
				+str
				 + '</p>'
				 + '<p class="row">'
				 + '<button type="button" class="btn btn-primary btn-lg admitBtn">同意</button>'
				 + '<button type="button" class="btn btn-default btn-lg refuseBtn">拒绝</button>'
				 + '</p>'
				 + '</div>');
		content.appendTo($("#chessTableModal .modal-content"));

		$('#chessTableModal').modal({
			backdrop : false,
			keyboard : false
		});

		$("#chessTableModal .admitBtn").click(function () {
			playerInterface.drawGameRequest({
				type : "answer",
				content : "admit"
			});
		});
		$("#chessTableModal .refuseBtn").click(function () {
			playerInterface.drawGameRequest({
				type : "answer",
				content : "refuse"
			});
			$('#chessTableModal').modal("hide");
		});
	},
	stepBack : function (str) {
		$("#chessTableModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title">悔棋申请</h4>'
				 + '</div>'
				 + '<div class="modal-body">'
				 + '<p class="row content-text">'
				+str
				 + '</p>'
				 + '<p class="row">'
				 + '<button type="button" class="btn btn-primary btn-lg">同意</button>'
				 + '<button type="button" class="btn btn-default btn-lg">拒绝</button>'
				 + '</p>'
				 + '</div>');
		content.appendTo($("#chessTableModal .modal-content"));

		$('#chessTableModal').modal({
			backdrop : false,
			keyboard : false
		});

		$("#chessTableModal .btn-primary").click(function () {
			playerInterface.stepBackRequest({
				type : "answer",
				content : "admit"
			});
			$('#chessTableModal').modal("hide");
		});
		$("#chessTableModal .btn-default").click(function () {
			playerInterface.stepBackRequest({
				type : "answer",
				content : "refuse"
			});
			$('#chessTableModal').modal("hide");
		});
	},
	gameOptionView : function () {
		
	},
	confirm : function (str) {
		$("#confirmModal .modal-content").html("");
		var content = $(''
				 + '<div class="modal-header">'
				 + '<h4 class="modal-title confirm-title">确认信息</h4>'
				 + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				 + '</div>'
				 + '<div class="modal-body">'
				 + '<p class="row content-text">'
					+str
				 + '</p>'
				 + '<p class="row">'
				 + '<button type="button" class="btn btn-primary btn-lg">确认</button>'
				 + '<button type="button" class="btn btn-default btn-lg">取消</button>'
				 + '</p>'
				 + '</div>');
		content.appendTo($("#confirmModal .modal-content"));

		$('#confirmModal').modal({
			backdrop : false,
			keyboard : false
		});
	}

}
