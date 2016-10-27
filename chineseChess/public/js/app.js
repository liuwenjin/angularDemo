var host = "http://192.168.0.120:3000";
var rPath = "/index.html#";

var app = angular.module('myApp', ["ngRoute"]);
app.config(["$routeProvider", function ($routeProvider) {
      $routeProvider.
      // when('/login', {templateUrl: 'template/login.html', controller: "LoginCtrl"}).
      // when('/registar', {templateUrl: 'template/registar.html', controller: "RegistarCtrl"}).
      // when('/friendList', {templateUrl: 'template/friendList.html', controller: "TableListCtrl"}).
      // when('/roomList', {templateUrl: 'template/roomList.html', controller: "TableListCtrl"}).
      // when('/tableList', {templateUrl: 'template/tableList.html', controller: "TableListCtrl"}).
      // when('/tableList/:roomId', {templateUrl: 'template/tableList.html', controller: "TableListCtrl"}).
      when('/userAdmin', {
        templateUrl : 'template/userAdmin.html',
        controller : "GameTableCtrl"
      }).
      when('/gameTable', {
        templateUrl : 'template/gameTable.html',
        controller : "GameTableCtrl"
      }).
      when('/gameTable/:tableId', {
        templateUrl : 'template/gameTable.html',
        controller : "GameTableCtrl"
      }).
      otherwise({
        redirectTo : '/gameTable'
      });
    }
  ]);

/****定义全局的服务对象****/
var playerInterface = {
  id : "testId0001",
  socket : {
    url : location.protocol + "//" + location.host + "/player",
  },
  data : {
    flag : "rooms" //初始化数据
  },
  room : {},
  table : {
    id : "testId0001",
  },
  init : function () {
    //获取ID
    if (!!$.cookie('id')) {
      this.id = $.cookie('id');
    } else {
      //生成随机数作为ID
      this.id = "g" + (new Date()).getTime();
      $.cookie('id', this.id);
    }

    //连接服务器
    this.socket._self = io.connect(this.socket.url);

    var _this = this;
    //监听自己的Channel
    this.socket._self.on(this.id, function (msg) {
      console.log(msg.type);
      messageHandler[msg.type](msg);
    });

    //签到
    this.socket._self.emit('check_in_player', this.id);

    //监听Player进入Table的消息
    this.socket._self.on("enter_table", function (msg) {
      console.log(msg.type);
      messageHandler[msg.type](msg);
    });

    //监听Player离开Table的消息
    this.socket._self.on("leave_table", function (msg) {
      console.log(msg.type);
      messageHandler[msg.type](msg);
    });
  },
  enterRequest : function () {
    if (!this.socket._self) {
      this.init();
    }
  },
  enterTableRequest : function (id) {
    if (id) {
      this.table_id = id;
      //监听自己进入的Table
      this.socket._self.on(this.table_id, function (msg) {
        console.log(msg.type);
        messageHandler[msg.type](msg);
      });

      //签到
      this.socket._self.emit('check_in_table', this.table_id);
    } else {}

  },
  stepPerformRequest : function (sData) {
    this.socket._self.emit('step_perform', sData);
  },
  gameReadyRequest : function (tData) {
    if (typeof(this.table.players[this.id]) !== "undefined") {
      this.socket._self.emit('player_ready', tData);
    }
  },
  giveUpRequest : function (tData) {
    this.socket._self.emit('give_up', tData);
  },
  drawGameRequest : function (tData) {
    this.socket._self.emit('draw_game', tData);
  },
  stepBackRequest : function (tData) {
    this.socket._self.emit('step_back', tData);
  },
  enterRoomRequest : function (id) {
    if (id) {
      this.room.id = id;
    } else {
      this.room.id = "rTables";
    }

    if (!this.socket._self) {
      this.init();
    }

    //监听自己进入的Table
    this.socket._self.on(this.room.id, function (msg) {
      messageHandler[msg.type](msg);
    });

    //签到
    this.socket._self.emit('check_in_room', this.room.id);

  },
  countPlayers : function () {
    var i = 0;
    for (var p in this.table.players) {
      i++;
    }
    return i;
  },
  readyPlayers : function () {
    var i = 0;
    for (var p in this.table.players) {
      if (this.table.players[p].status === 1) {
        i++;
      }
    }
    return i;
  },
  getPartner : function () {
    for (var p in this.table.players) {
      if (p !== this.id) {
        return this.table.players[p];
      }
    }
  },
  getNameBySide : function (side) {
    for (var p in this.table.players) {
      if (this.table.players[p].side === side) {
        return this.table.players[p].name;
      }
    }
  }
}

/*************************************************************/
var messageHandler = {
  global : function (msg) {
    if (playerInterface.data.flag === "rooms") {
      playerInterface.data = msg.data;
      viewControl.updateRoomList(playerInterface.data.rooms);
    } else if (playerInterface.data.flag === "players") {
      playerInterface.data = msg.data;
      viewControl.updatePlayerList(playerInterface.data.players);
    }
    // viewControl.updatePlayerList(data.players);
    // viewControl.updateTableList(data.tables);
  },
  room : function (msg) {
    console.log(msg);
    playerInterface.room.data = msg.data;
    viewControl.updateTableList(playerInterface.room.data);
  },
  invite : function (data) {
    viewControl.updateRealTimeMsg();
  },
  feedback : function (data) {
    viewControl.updateRealTimeMsg();
  },
  chart : function (data) {
    viewControl.updateRealTimeMsg();
  },
  game : function (data) {
    viewControl.updateRealTimeMsg();
  },
  control : function (data) {},
  //table Message
  tGame : function (data) {},
  tableInfo : function (data) {
    console.log(data);
    //更新Table中Player的信息
    playerInterface.table = data.table.info;
  },
  playerCome : function (data) {
    //更新Table信息
    playerInterface.table = data.table.info;

    if (data.player !== playerInterface.id) {
      gameTableStatus["playerCome"]();
    }

  },
  playerReady : function (data) {
    console.log(data);
    //更新棋局信息
    viewControl.updateGameTable(data.table.data);
    //更新当前步骤数据
    viewControl.updateCurrentInfo(data.table.current);
    //更新Table信息
    playerInterface.table = data.table.info;

    gameTableStatus["playerReady"]();
  },
  leaveTable : function (data) {
    console.log(data);
    if (data.player !== playerInterface.id) {
      //更新Table信息
      playerInterface.table = data.table.info;

      gameTableStatus["leaveTable"]();
    }
  },
  stepPerform : function (data) {
    console.log(data);
    //更新棋局信息
    viewControl.updateGameTable(data.table.data);
    //更新当前步骤数据
    viewControl.updateCurrentInfo(data.table.current);
    //更新Table信息
    playerInterface.table = data.table.info;

    gameTableStatus["stepPerform"]();

  },
  gameOver : function (data) {
    console.log(data);
    //更新Table信息
    playerInterface.table = data.table.info;
    //更新当前步骤数据
    viewControl.updateCurrentInfo(data.table.current);
    gameTableStatus["gameOver"](data.winner);
  },
  giveUp : function (data) {
    console.log(data);
    playerInterface.table = data.table.info;
    //更新当前步骤数据
    viewControl.updateCurrentInfo(data.table.current);
    gameTableStatus["giveUp"](data.player);
  },
  drawGame : function (data) {
    //打开同意或拒绝讲和对话框
    gameTableStatus["drawGame"](data.data);
  },
  stepBack : function (data) {
    gameTableStatus["stepBack"](data);
  },
  enterTableFailed : function (data) {
    playerInterface.table_id = "rTables_" + playerInterface.id;
    //更新游戏Table的hash
    location.hash = "/gameTable/" + playerInterface.table_id;
  }
}

var gameTableStatus = {
  playerCome : function () {
    $(".chessTableText").html("有玩家加入,待预备");
    $('#chessTableModal').modal('hide');
  },
  playerReady : function () {
    //当俩个Player都预备好时开始游戏
    var status = playerInterface.table.players[playerInterface.id].status;
    if (playerInterface.countPlayers() < 2) {
      chessDialog.qrCodeView(location.href);
    } else if (playerInterface.readyPlayers() === 2) {
      chessGame.startGame();
      $('#chessTableModal').modal('hide');
      $(".chessTableText").html("与玩家[" + playerInterface.getPartner().name + "]对弈中");
      //是否需要等待几秒待定

      this.stepPerform();

    } else {
      if (status === 1) {
        $('#chessTableModal').modal('hide');
      }
      $(".chessTableText").html("等待对方预备");
    }
  },
  leaveTable : function () {
    $(".chessTableText").html("玩家离开");
    chessDialog.leaveTable();
  },
  stepPerform : function () {
    console.log("stepPerform");
    var cSide = chessRule.paceRule.current.side;
    var pSide = playerInterface.table.players[playerInterface.id].side
      if (cSide === pSide) {
        $(".chessTableText").html("轮到您走棋啦");
        $("#chessmanTable tr td label." + pSide).css("background-color", "#fff");
      } else {
        $(".chessTableText").html("等待对方走棋");
        $("#chessmanTable tr td label").css("background-color", "#000")
      }
  },
  gameOver : function (side) {
    if (!!side) {
      chessDialog.gameOver('获胜玩家是: ' + playerInterface.getNameBySide(side));
    } else {
      chessDialog.gameOver('游戏结果: 平局');
    }
  },
  giveUp : function (id) {
    if (id === playerInterface.id) {
      chessDialog.gameOver('您认输了，是否从新开始游戏？');
    } else {
      chessDialog.gameOver('对方认输，是否从新开始游戏？');
    }
  },
  drawGame : function (drawData) {
    console.log(drawData);
    if (playerInterface.id !== drawData.request && !drawData.answer) {
      chessDialog.drawGame("是否同意对方和棋申请？");
    } else if (playerInterface.id === drawData.request && drawData.answer === "refuse") {
      console.log("对方拒绝和棋");
    } else if (drawData.answer === "admit") {
      chessGame.autoRecoverTable();
    }
  },
  stepBack : function (data) {
    console.log(data);
    if (playerInterface.id !== data.data.request && !data.data.answer) {
      chessDialog.stepBack("是否同意对方悔棋请求？");
    } else if (playerInterface.id === data.data.request && data.data.answer === "refuse") {
      console.log("对方拒绝悔棋请求");
    } else if (data.data.answer === "admit") {
      messageHandler.stepPerform(data);
    }
  }

}

/***************************************************************/
var viewControl = {
  updateRoomList : function (data) {
    $("#roomList .rList").html("");
    for (var t in data) {
      var tItem = $('<li class="rItem col-lg-3 col-md-4 col-sm-6 col-xs-12">\
          							<div class="roomInfo">\
          								<p class="rInfo">\
          									<a>\
          										<img class="rIcon" src="images/user.png" />\
          										<span class="rName">喜刷刷棋室1####</span>\
          									</a>\
          								</p>\
          								<p class="rInfo">\
          									<a href="http://127.0.0.1:3000/index.html#/tableList"><span>进入</span></a>\
          								</p>\
          							</div>\
          						</li>');
      // tItem.find(".roomInfo .rInfo>a").attr("href", location.pathname+"/tableList/"+data[t].id);
      tItem.find(".rIcon:eq(0)").attr("str", "");
      tItem.find(".rName:eq(0)").html(data[t].name);
      tItem.appendTo($("#roomList .rList"));
    }
  },
  updatePlayerList : function (data) {
    $("#friendList .pList").html("");
    for (var t in data) {
      var tItem = $('<li class="pItem col-lg-3 col-md-4 col-sm-6 col-xs-12">\
          												<div class="friendInfo">\
          													<p class="uInfo">\
          														<a><img class="uIcon" src="images/user.png" /><span class="uName">刘文津</span></a>\
          													</p>\
          													<p class="opInfo"><a>其他</a><a>约战</a><a>留言</a></p>\
          												</div>\
          											</li>');
      tItem.find(".tableInfo").attr("href", location.pathname + "#/gameTable");
      tItem.find(".uIcon:eq(0)").attr("str", "images/user.png");
      tItem.find(".uName:eq(0)").attr("str", "");
      tItem.appendTo($("#friendList .pList"));
    }
  },
  updateTableList : function (data) {
    $("#tableList .tList").html("");
    for (var t in data) {
      var tItem = $('<li class="pItem col-lg-3 col-md-4 col-sm-6 col-xs-12">\
          												<a class="tableInfo" href="http://127.0.0.1:3000/index.html#/gameTable">\
          													<p><img class="uIcon" src="images/user.png" /><span class="uName">张三</span></p>\
          													<p><img class="uIcon" src="images/user.png" /><span class="uName">李四</span></p>\
          												</a>\
          											</li>');
      tItem.find(".tableInfo").attr("href", location.pathname + "#/gameTable");
      tItem.find(".uIcon:eq(0)").attr("str", "");
      tItem.find(".uName:eq(0)").attr("str", "");
      tItem.find(".uIcon:eq(1)").attr("str", "");
      tItem.find(".uName:eq(1)").attr("str", "");
      tItem.appendTo($("#tableList .tList"));
    }
  },
  updateGameTable : function (data) {
    //更新棋局数据
    chessGame.chessRule.paceRule.data = data;
    //清空游戏Table
    chessGame.chessRule.emptyChessTable();
    //更新棋局显示
    chessGame.chessRule.table._updateCellByTextAreaTemplate(chessGame._transforData(data), chessGame.chessRule.tempChess);
  },
  updateCurrentInfo : function (data) {
    //更新Current信息
    chessGame.chessRule.paceRule.current = data;
  },
  updatePlayerInfo : function () {},
  updateGameInfo : function () {},
  updateRealTimeMsg : function () {}
}
