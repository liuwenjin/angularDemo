app.directive('gameTableInitial', function () {
	return {
		restrict : "AE",
		controller : function ($scope, $window, $routeParams) {
			$scope.initialGameTable = function () {
				if (typeof(playerInterface.table.data) === "undefined") {
					if (!playerInterface.socket._self) {
						playerInterface.init();
					}
					if (typeof($routeParams) !== "undefined" && typeof($routeParams.tableId) !== "undefined") {
						playerInterface.enterTableRequest($routeParams.tableId);
						//初始化棋盘棋子
						initialIndexView();
					} else {
						playerInterface.table_id = "rTables_" + playerInterface.id;
						//更新游戏Table的hash
						location.hash = "/gameTable/" + playerInterface.table_id;
					}
				} else {
					viewControl.updateGameTable(playerInterface.room.data.tables);
				}
			}
			$scope.updateTableSize = function () {
				$(".mainArea").css("height", document.documentElement.clientHeight - $(".topArea")[0].clientHeight + "px");
				var h = $("#contentArea")[0].clientHeight;
				var w = $("#contentArea")[0].clientWidth + 2;
				if (w < h * 9 / 11) {
					$("#gameView").css("width", w + "px");
				} else {
					$("#gameView").css("width", h * 9 / 11 + "px");
				}
				$("#gameTable").css("margin-top", $("#gameView")[0].clientWidth / 18 + "px");
				$("#gameTable").css("margin-left", $("#gameView")[0].clientWidth / 18 + "px");
				$("#gameTable").css("width", $("#gameView")[0].clientWidth * 8 / 9 + "px");
				$("#gameTable").css("width", $("#gameView")[0].clientWidth * 8 / 9 + "px");
				$("#gameView tr td").css("width", ($("#gameView")[0].clientWidth - 1) / 9 + "px");
				$("#gameView tr td").css("height", ($("#gameView")[0].clientWidth - 1) / 9 + "px");
				$("#chessmanTable tr td").css("width", ($("#gameView")[0].clientWidth - 1) / 9 + "px");
				$("#chessmanTable tr td").css("height", ($("#gameView")[0].clientWidth - 1) / 9 + "px");

				//other
				$("#gameTable .line1").css("border-width", "$('#gameView tr td')[0].clientWidthpx 0 $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx")
				$("#gameTable .line2").css("border-width", "$('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx 0")
				$("#gameTable .line3").css("border-width", "$('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx 0")
				$("#gameTable .line4").css("border-width", "$('#gameView tr td')[0].clientWidthpx 0 $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx")
				$("#gameTable .line5").css("border-width", "$('#gameView tr td')[0].clientWidthpx 0 $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx")
				$("#gameTable .line6").css("border-width", "$('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx 0")
				$("#gameTable .line7").css("border-width", "$('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx 0")
				$("#gameTable .line8").css("border-width", "$('#gameView tr td')[0].clientWidthpx 0 $('#gameView tr td')[0].clientWidthpx $('#gameView tr td')[0].clientWidthpx")

			}
		},
		link : function (scope, elem, attrs) {
			//初始化玩家信息
			scope.initialGameTable();
			
			//修改背景色
			$(".mainArea>.content").css("backgroundColor", "#88FF88");
			
			//屏幕自适应
			scope.updateTableSize();
			$(window).resize(function () {
				try {
					scope.updateTableSize();
				} catch (e) {}
			});

			//绑定退出页面事件
			// window.onbeforeunload=function() {
			// alert("test");
			// }
			$("#gameView")[0].onunload = function () {
				console.log("退出游戏Table")
			}

		}
	};
});

app.directive('mainAreaAdapter', function () {
	return {
		restrict : "AE",
		controller : function ($scope, $window, $routeParams) {
			$scope.initialMainArea = function () {
				alert($("body")[0].clientHeight);
				alert($(".container-fluid")[0].clientHeight);
			}
		},
		link : function (scope, elem, attrs) {
			//屏幕自适应
			scope.initialMainArea();
			$(window).resize(function () {
				try {
					scope.initialMainArea();
				} catch (e) {}
			});

		}
	};
});

app.directive('roomListInitial', function () {
	return {
		restrict : "AE",
		controller : function ($scope, $window) {
			$scope.initialRoomList = function () {
				if (typeof(playerInterface.data.rooms) === "undefined") {
					playerInterface.data.flag = "rooms";
					playerInterface.enterRequest();
				} else {
					viewControl.updateRoomList(playerInterface.data.rooms);
				}
			}
		},
		link : function (scope, elem, attrs) {
			//初始化游戏Room列表
			scope.initialRoomList();

		}
	};
});
app.directive('friendListInitial', function () {
	return {
		restrict : "AE",
		controller : function ($scope, $window) {
			$scope.initialFriendList = function () {
				if (typeof(playerInterface.data.players) === "undefined") {
					playerInterface.data.flag = "players";
					playerInterface.enterRequest();
				} else {
					viewControl.updatePlayerList(playerInterface.data.players);
				}
			}
		},
		link : function (scope, elem, attrs) {
			//初始化游戏Table
			scope.initialFriendList();
		}
	};
});

app.directive('tableListInitial', function () {
	return {
		restrict : "AE",
		controller : function ($scope, $routeParams) {
			$scope.initialTableList = function () {
				if (typeof(playerInterface.room.data) === "undefined") {
					if (typeof($routeParams.roomId) !== "undefined") {
						playerInterface.enterRoomRequest($routeParams.roomId);
					} else {
						playerInterface.enterRoomRequest("");
					}
				} else {
					viewControl.updateTableList(playerInterface.room.data);
				}
			}
		},
		link : function (scope, elem, attrs) {
			//初始化游戏Table
			scope.initialTableList();
		}
	};
});
