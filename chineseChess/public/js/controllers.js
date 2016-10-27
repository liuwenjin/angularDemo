
app.controller('GameTableCtrl', function($scope, $routeParams){
	
});
app.controller('RegistarCtrl', function($scope, $http, $window, $routeParams){
	$scope.url="/registerRequest";
	$scope.checkInputUserName=function(e, s) {
		var patt = /(^([a-z]|[A-Z])(\w){3,17})/g;
		if(s.match(patt)!=null&&s.match(patt)[0]==s) {
			if(!$($(".input-group").get(0)).hasClass("has-success")) {
				$($(".input-group").get(0)).addClass("has-success");	
			}
			$($(".form-control-feedback").get(0)).removeClass("hidden");
			$($(".form-control-feedback").get(0)).show();
		}
		else {
			if($($(".input-group").get(0)).hasClass("has-success")) {
				$($(".input-group").get(0)).removeClass("has-success");					
			}
			$($(".form-control-feedback").get(0)).removeClass("show");
			$($(".form-control-feedback").get(0)).hide();
		}	
	};
	$scope.checkInputPassword=function(e, s) {
		var patt = /.{6,18}/g;		
		if(s.match(patt)!=null&&s.match(patt)[0]==s) {
			if(!$($(".input-group").get(1)).hasClass("has-success")) {
				$($(".input-group").get(1)).addClass("has-success");	
			}
			$($(".form-control-feedback").get(1)).removeClass("hidden");
			$($(".form-control-feedback").get(1)).show();
		}
		else {
			if($($(".input-group").get(1)).hasClass("has-success")) {
				$($(".input-group").get(1)).removeClass("has-success");					
			}
			$($(".form-control-feedback").get(1)).removeClass("show");
			$($(".form-control-feedback").get(1)).hide();
		}	
	}
	$scope.tryRegistar=function(u, p) {
		var uPatt = /(^([a-z]|[A-Z])(\w){3,17})/g;
		var pPatt = /.{6,18}/g;	
		if(u!=undefined&&p!=undefined){
			if(u.match(uPatt)!=null&&u.match(uPatt)[0]==u){
				if(p.match(pPatt)!=null&&p.match(pPatt)[0]==p){
					$http({method : 'POST',data : { user: u, pwd: p}, url : $scope.url})
					.success(function(response, status, headers, config){
						
					});
				}
			}
		}
		else {
			
		}		
	}
});
app.controller('TableListCtrl', function($scope, $routeParams){
	
});
app.controller('LoginCtrl', function($scope, $http, $window, $routeParams){
	$scope.url="/loginRequest";
	$scope.checkInputUserName=function(e, s) {
		var patt = /(^([a-z]|[A-Z])(\w){3,17})/g;
		if(s.match(patt)!=null&&s.match(patt)[0]==s) {
			if(!$($(".input-group").get(0)).hasClass("has-success")) {
				$($(".input-group").get(0)).addClass("has-success");	
			}
			$($(".form-control-feedback").get(0)).removeClass("hidden");
			$($(".form-control-feedback").get(0)).show();
		}
		else {
			if($($(".input-group").get(0)).hasClass("has-success")) {
				$($(".input-group").get(0)).removeClass("has-success");					
			}
			$($(".form-control-feedback").get(0)).removeClass("show");
			$($(".form-control-feedback").get(0)).hide();
		}	
	};
	$scope.checkInputPassword=function(e, s) {
		var patt = /.{6,18}/g;		
		if(s.match(patt)!=null&&s.match(patt)[0]==s) {
			if(!$($(".input-group").get(1)).hasClass("has-success")) {
				$($(".input-group").get(1)).addClass("has-success");	
			}
			$($(".form-control-feedback").get(1)).removeClass("hidden");
			$($(".form-control-feedback").get(1)).show();
		}
		else {
			if($($(".input-group").get(1)).hasClass("has-success")) {
				$($(".input-group").get(1)).removeClass("has-success");					
			}
			$($(".form-control-feedback").get(1)).removeClass("show");
			$($(".form-control-feedback").get(1)).hide();
		}	
	}
	$scope.tryLogin=function(u, p) {
		var uPatt = /(^([a-z]|[A-Z])(\w){3,17})/g;
		var pPatt = /.{6,18}/g;	
		if(u!=undefined&&p!=undefined){
			if(u.match(uPatt)!=null&&u.match(uPatt)[0]==u){
				if(p.match(pPatt)!=null&&p.match(pPatt)[0]==p){
					$http({method : 'POST',data : { user: u, pwd: p}, url : $scope.url})
					.success(function(response, status, headers, config){
						console.log(response);
						playerInterface.id=u;
						playerInterface.enterRequest();
						window.location.href=host+"/index.html#/roomList"
					});
				}
			}
		}
		else {
			
		}		
	}
});
