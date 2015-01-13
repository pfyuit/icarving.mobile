angular.module('icarving.controllers', [])

.controller('ViewCtrl', function($scope, $http, $ionicModal, $ionicPopup, $filter, Activity, UserService) {
  $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
  };	
	
  $ionicModal.fromTemplateUrl('templates/user-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  }; 
  $scope.closeModal = function() {
    $scope.modal.hide();
  }; 
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
  });
  $scope.$on('modal.removed', function() {
  });
  
  $scope.data = {};
  $scope.data1 = {};  
  $scope.login = function (data) {
	  if(data.username == undefined || data.username==null || data.username ==""){
		  $scope.showAlert("登录失败。用户名不可为空。");
		  return;
	  }
	  if(data.password == undefined || data.password==null || data.password ==""){
		  $scope.showAlert("登录失败。密码不可为空。");
		  return;
	  }	  
	  $http.get('/icarving.api.pinche/user/login?username='+data.username+'&password='+data.password).
	  success(function(data, status, headers, config) {
		  var userid = data.response.uid;
		  var username = data.response.username;
		  var password = data.response.password;
		  
		  var date=new Date();
		  var expireDays=10;
		  date.setTime(date.getTime()+expireDays*24*3600*1000);
		  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "username="+username+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "password="+password+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  
		  uid=userid;		  
		  $scope.closeModal(); 
	  }).
	  error(function(data, status, headers, config) {
		  $scope.showAlert("登录失败。 "+data.message+"。");
	 });
  }; 
	
   $scope.register = function (data1) { 
	   if(data1.username == undefined || data1.username==null || data1.username ==""){
		   $scope.showAlert("注册失败。用户名不可为空。");
		   return;
	   }
	   if(data1.password == undefined || data1.password==null || data1.password ==""){
		   $scope.showAlert("注册失败。密码不可为空。");
		   return;
	   }
	   if(data1.password != data1.password1){
		   $scope.showAlert("注册失败。密码不匹配，请重试。");
		   return;
	   }
	   var payload = {"username":data1.username,"password":data1.password,"name":"","phone":data1.phone}
	   $http.post('/icarving.api.pinche/user/register', payload).
	   success(function(data, status, headers, config) {
		  var userid = data.response.uid;
		  var username = data.response.username;
		  var password = data.response.password;
		  
		  var date=new Date();
		  var expireDays=10;
		  date.setTime(date.getTime()+expireDays*24*3600*1000);
		  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "username="+username+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "password="+password+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  
		  uid=userid;		  
		  $scope.closeModal(); 
	   }).
	   error(function(data, status, headers, config) {
		   $scope.showAlert("注册失败。 "+data.message+"。");
	   });
  };
	
    $scope.activities = [];
    var cookieUid = UserService.getUid();
    var filter = 0;
	
	Activity.all().success(function(res){
		if(cookieUid != ""){
			uid = cookieUid;
		} else {
			var index = window.location.href.indexOf("?", 0);
			
			if(index > -1){
				var query = window.location.href.substring(index+1,  window.location.href.length);
				if(query != null && query != undefined && query != ""){					
					var args = new Object( );
				    var pairs = query.split("&");
				    for(var i = 0; i < pairs.length; i++) {
				        var pos = pairs[i].indexOf('='); 
				        if (pos == -1) continue;  
				        var argname = pairs[i].substring(0,pos);
				        var value = pairs[i].substring(pos+1);
				        args[argname] = value;
				    }
				   
				    uid = args["uid"];
				    var username = args["username"];
				    var password = args["password"];
				    
					var date=new Date();
					var expireDays=10;
					date.setTime(date.getTime()+expireDays*24*3600*1000);
					var cookieStr = "uid="+uid+"; expires="+date.toUTCString();
					document.cookie=cookieStr;
					cookieStr = "username="+username+"; expires="+date.toUTCString();
					document.cookie=cookieStr;
					cookieStr = "password="+password+"; expires="+date.toUTCString();
					document.cookie=cookieStr;
			}
			
			}
			else {
				var userAgent = navigator.userAgent.toLowerCase(); 
				if(userAgent.indexOf("micromessenger", 0) > -1){
					window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2Fwww.icarving.cn%2Ficarving.api.wechat%2Fuser%2Fauth%2Fcallback&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
				}
				else {
					$scope.openModal();
				}
			}

		}
		$scope.items = res.response;
		Activity.save($scope.items);
		for(var i =0;i<$scope.items.length; i++){
			$scope.activities[i] = $scope.items[i];
			if($scope.items[i].activityType==1){
				$scope.activities[i].type = "捡人";
				$scope.activities[i].pick = true;
				$scope.activities[i].picked = false;
			} else {
				$scope.activities[i].type = "搭车";
				$scope.activities[i].pick = false;
				$scope.activities[i].picked = true;
			}
		}
	});
	
	$scope.selectAll = function(){
		$scope.activities = [];
		if($scope.items == null || $scope.items == undefined){
			return;
		}
		for(var i =0;i<$scope.items.length; i++){
			$scope.activities[i] = $scope.items[i];
			if($scope.items[i].activityType==1){
				$scope.activities[i].type = "捡人";
				$scope.activities[i].pick = true;
				$scope.activities[i].picked = false;
			} else {
				$scope.activities[i].type = "搭车";
				$scope.activities[i].pick = false;
				$scope.activities[i].picked = true;
			}
		}
		filter = 0;
	};
	
	$scope.selectPick = function(){
		$scope.activities = [];
		for(var i =0;i<$scope.items.length; i++){
			if($scope.items[i].activityType==1){
				var temp = $scope.items[i];
				temp.type = "捡人";
				temp.pick = true;
				temp.picked = false;
				$scope.activities.push(temp);
			}
		}
		filter = 1;
	};
	
	$scope.selectPicked = function(){
		$scope.activities = [];
		for(var i =0;i<$scope.items.length; i++){
			if($scope.items[i].activityType==2){
				var temp = $scope.items[i];
				temp.type = "搭车";
				temp.pick = false;
				temp.picked = true;
				$scope.activities.push(temp);
			}
		}
		filter = 2;
	};

	$scope.doRefresh = function() {
		Activity.all().success(function(res){
			$scope.items = res.response;
			Activity.save($scope.items);
			
			//all
		    if(filter == 0){
		    	$scope.activities = [];
				for(var i =0;i<$scope.items.length; i++){
					$scope.activities[i] = $scope.items[i];
					if($scope.items[i].activityType==1){
						$scope.activities[i].type = "捡人";
						$scope.activities[i].pick = true;
						$scope.activities[i].picked = false;
					} else {
						$scope.activities[i].type = "搭车";
						$scope.activities[i].pick = false;
						$scope.activities[i].picked = true;
					}
				}
		    }
		    
		    //pick
		    if(filter == 1){
				$scope.activities = [];
				for(var i =0;i<$scope.items.length; i++){
					if($scope.items[i].activityType==1){
						var temp = $scope.items[i];
						temp.type = "捡人";
						temp.pick = true;
						temp.picked = false;
						$scope.activities.push(temp);
					}
				}
		    }
		    
		    //picked
		    if(filter == 2){
				$scope.activities = [];
				for(var i =0;i<$scope.items.length; i++){
					if($scope.items[i].activityType==2){
						var temp = $scope.items[i];
						temp.type = "搭车";
						temp.pick = false;
						temp.picked = true;
						$scope.activities.push(temp);
					}
				}
		    }
		    

			
		});
		$scope.$broadcast('scroll.refreshComplete');
    };
    
    $scope.model={};
	$scope.openStartTimeDatePicker = function() {		  
		$scope.$watch('model.startTimeStr', function(unformattedDate){
			$scope.model.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.startTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {
		$scope.$watch('model.returnTimeStr', function(unformattedDate){
		    $scope.model.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.returnTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 };    
})

.controller('ViewSearchFormCtrl', function($scope, $ionicPopup, $stateParams) {
	//TODO
})

.controller('ViewSearchActivityListCtrl', function($scope, $ionicPopup, $stateParams, SearchActivity) {
    $scope.showAlert = function(templateStr) {
	   var alertPopup = $ionicPopup.alert({
	     title: '<b>温馨提示</b>',
	     template: templateStr
	   });
	   alertPopup.then(function(res) {
	     console.log('');
	   });
    };
	
	$scope.items = [];
	$scope.acts = [];
	var filter = 0;
	SearchActivity.all($stateParams.sourceAddress, $stateParams.destAddress,$stateParams.startTime, $stateParams.returnTime).success(function(res){	
		$scope.items = res.response;
		SearchActivity.save($scope.items);
		for(var i =0;i<$scope.items.length; i++){
			$scope.acts[i] = $scope.items[i];
			if($scope.items[i].activityType==1){
				$scope.acts[i].type = "捡人";
				$scope.acts[i].pick = true;
				$scope.acts[i].picked = false;
			} else {
				$scope.acts[i].type = "搭车";
				$scope.acts[i].pick = false;
				$scope.acts[i].picked = true;
			}
		}		
	}).error(function(res) {
		$scope.showAlert("搜索失败。 "+res.message+"。");
	});
	 
	$scope.selectAll = function(){
		$scope.acts = [];
		for(var i =0;i<$scope.items.length; i++){
			$scope.acts[i] = $scope.items[i];
			if($scope.items[i].activityType==1){
				$scope.acts[i].type = "捡人";
				$scope.acts[i].pick = true;
				$scope.acts[i].picked = false;
			} else {
				$scope.acts[i].type = "搭车";
				$scope.acts[i].pick = false;
				$scope.acts[i].picked = true;
			}
		}
		filter = 0;
	};
	
	$scope.selectPick = function(){
		$scope.acts = [];
		for(var i =0;i<$scope.items.length; i++){
			if($scope.items[i].activityType==1){
				var temp = $scope.items[i];
				temp.type = "捡人";
				temp.pick = true;
				temp.picked = false;
				$scope.acts.push(temp);
			}
		}
		filter = 1;
	};
	
	$scope.selectPicked = function(){
		$scope.acts = [];
		for(var i =0;i<$scope.items.length; i++){
			if($scope.items[i].activityType==2){
				var temp = $scope.items[i];
				temp.type = "搭车";
				temp.pick = false;
				temp.picked = true;
				$scope.acts.push(temp);
			}
		}
		filter = 2;
	};  
})


.controller('ViewActivityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, Activity) {
    $scope.showAlert = function(templateStr) {
	   var alertPopup = $ionicPopup.alert({
	     title: '<b>温馨提示</b>',
	     template: templateStr
	   });
	   alertPopup.then(function(res) {
	     console.log('');
	   });
    };
	
	$scope.activity = Activity.get($stateParams.activityId);
	if($scope.activity.ownerId == uid){
		$scope.activity.my = true;
	} else {
		$scope.activity.my = false;
	}	
	$scope.activity.applied = false;
	var applies = $scope.activity.applies;
	if(applies != null){
		$scope.applies = applies;
		for(var i = 0; i < applies.length; i++){
			if(applies[i].ownerId == uid){
				$scope.activity.applied = true;
				$scope.activity.myapply = applies[i];
				break;
			}
		}
	}
	if($scope.activity.activityType==1){
		$scope.activity.type = "捡人";
		$scope.activity.pick = true;
		$scope.activity.picked = false;
	} else {
		$scope.activity.type = "搭车";
		$scope.activity.pick = false;
		$scope.activity.picked = true;
	}
	
	$scope.applyActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请成功，可以在个人页面中查看申请详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请失败。 '+data.message+"。");
		  });
	};
	
    $scope.updateActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"startTime":$scope.activity.startTime+":00","returnTime":$scope.activity.returnTime+":00","sourceAddress":$scope.activity.sourceAddress,"destAddress":$scope.activity.destAddress,"charge":$scope.activity.charge,"carType":$scope.activity.carType,"note":$scope.activity.note};
		$http.post('/icarving.api.pinche/activity/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新失败。 "+data.message+"。");
		  });
    };
	
    $scope.cancelActivity = function(){
		 $http.get('/icarving.api.pinche/activity/cancel?uid='+uid+'&activityId='+$scope.activity.activityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消失败。 "+data.message+"。");
		  });
    };
    
	$scope.approveApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/approve?applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApproveApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/unapprove?applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.cancelApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/cancel?uid='+uid+'&applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("取消申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("取消申请失败。 "+data.message+"。");
		  });
	};
	
	// date time picker
    $scope.model = {};
    $scope.openStartTimeDatePicker = function() {		  
		$scope.$watch('model.startTimeStr', function(unformattedDate){
			$scope.model.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.startTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {
		$scope.$watch('model.returnTimeStr', function(unformattedDate){
		    $scope.model.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.returnTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 };
	
})


.controller('PickCtrl', function($scope, $http, $ionicPopup, $filter) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };
	
	$scope.model = {};
	$scope.publishPickActivity = function(){
		var validationResult = false;
		var validationMessage ='';
		if ($scope.model.sourceAddress =="" || $scope.model.sourceAddress == undefined){
			validationResult = true;
			validationMessage = "出发地为必填项";
		}
		if ($scope.model.destAddress =="" || $scope.model.destAddress == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "目的地为必填项";
		}
		var startTime = $scope.model.startTime;
		var returnTime = $scope.model.returnTime;
		console.log("returnTime=" + returnTime + "  startTime=" + startTime);
		if (startTime != "" && startTime !=undefined && returnTime !="" && returnTime !=undefined) {
			startTime = startTime.replace(/-/g, "/");
			returnTime = returnTime.replace(/-/g, "/");
			if (Date.parse(returnTime) < Date.parse(startTime)) {
				validationResult = true;
				validationMessage = validationMessage + "<br>"+"返回时间不能早于出发时间";
			}
		}else{
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "日期为必填项";
		}
		if ($scope.model.capacity == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "人数为必填项";
		}
		if ($scope.model.capacity < 1){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "人数不能为0";
		}
		if ($scope.model.phone == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "电话为必填项,并且是数字";
		}
		if (validationResult) {
			$scope.showAlert(validationMessage);
			return false;
		}

		var payload = {"ownerId":uid, "activityType":1, "startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动发布成功，可以在个人页面中查看活动详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动发布失败。 '+data.message+"。");
		  });
	};
	
	$scope.openStartTimeDatePicker = function() {		  
		$scope.$watch('model.startTimeStr', function(unformattedDate){
			$scope.model.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.startTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {
		$scope.$watch('model.returnTimeStr', function(unformattedDate){
		    $scope.model.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.returnTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 }
	  
})


.controller('PickedCtrl', function($scope, $http, $ionicPopup, $filter) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	
	
	$scope.model = {};
	$scope.publishPickedActivity = function(){

		var validationResult = false;
		var validationMessage ='';
		if ($scope.model.sourceAddress =="" || $scope.model.sourceAddress == undefined){
			validationResult = true;
			validationMessage = "出发地为必填项";
		}
		if ($scope.model.destAddress =="" || $scope.model.destAddress == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "目的地为必填项";
		}
		var startTime = $scope.model.startTime;
		var returnTime = $scope.model.returnTime;
		console.log("returnTime=" + returnTime + "  startTime=" + startTime);
		if (startTime != "" && startTime !=undefined && returnTime !="" && returnTime !=undefined) {
			startTime = startTime.replace(/-/g, "/");
			returnTime = returnTime.replace(/-/g, "/");
			if (Date.parse(returnTime) < Date.parse(startTime)) {
				validationResult = true;
				validationMessage = validationMessage + "<br>"+"返回时间不能早于出发时间";
			}
		}else{
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "日期为必填项";
		}
		if ($scope.model.capacity == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "人数为必填项";
		}
		if ($scope.model.capacity < 1){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "人数不能为0";
		}
		if ($scope.model.phone == undefined){
			validationResult = true;
			validationMessage = validationMessage + "<br>" + "电话为必填项,并且是数字";
		}
		if (validationResult) {
			$scope.showAlert(validationMessage);
			return false;
		}

		var payload = {"ownerId":uid, "activityType":2, "startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动发布成功，可以在个人页面中查看活动详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动发布失败。 '+data.message+"。");
		  });
	};
	
	$scope.openStartTimeDatePicker = function() {		  
		$scope.$watch('model.startTimeStr', function(unformattedDate){
			$scope.model.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.startTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {
		$scope.$watch('model.returnTimeStr', function(unformattedDate){
		    $scope.model.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.returnTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 }
})


.controller('MyCtrl', function($scope, $http, $ionicModal, $ionicPopup, MyActivity, UserService, MyMessage) {
     $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
     };
	
	 $ionicModal.fromTemplateUrl('templates/user-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
		$scope.modal.hide();
	  }; 
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  $scope.$on('modal.hidden', function() {
	  });
	  $scope.$on('modal.removed', function() {
	  });
	  
	  $scope.data = {};
	  $scope.data1 = {};
	  $scope.login = function (data) {
		  if(data.username == undefined || data.username==null || data.username ==""){
			  $scope.showAlert("登录失败。用户名不可为空。");
			  return;
		  }
		  if(data.password == undefined || data.password==null || data.password ==""){
			  $scope.showAlert("登录失败。密码不可为空。");
			  return;
		  }	  
		  $http.get('/icarving.api.pinche/user/login?username='+data.username+'&password='+data.password).
		  success(function(data, status, headers, config) {
			  var userid = data.response.uid;
			  var username = data.response.username;
			  var password = data.response.password;
			  
			  var date=new Date();
			  var expireDays=10;
			  date.setTime(date.getTime()+expireDays*24*3600*1000);
			  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  cookieStr = "username="+username+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  cookieStr = "password="+password+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  
			  uid=userid;		  
			  $scope.closeModal(); 
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('登录失败。 '+data.message+"。");
		 });
	  }; 
		
	   $scope.register = function (data1) { 
		   if(data1.username == undefined || data1.username==null || data1.username ==""){
			   $scope.showAlert("注册失败。用户名不可为空。");
			   return;
		   }
		   if(data1.password == undefined || data1.password==null || data1.password ==""){
			   $scope.showAlert("注册失败。密码不可为空。");
			   return;
		   }
		   if(data1.password != data1.password1){
			   $scope.showAlert("注册失败。密码不匹配，请重试。");
			   return;
		   }
		   var payload = {"username":data1.username,"password":data1.password,"name":"","phone":data1.phone}
		   $http.post('/icarving.api.pinche/user/register', payload).
		   success(function(data, status, headers, config) {
		   var userid = data.response.uid;
		   var username = data.response.username;
		   var password = data.response.password;
		   
		   var date=new Date();
		   var expireDays=10;
		   date.setTime(date.getTime()+expireDays*24*3600*1000);
		   var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		   cookieStr = "username="+username+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		   cookieStr = "password="+password+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		  
		   uid=userid;		  
		   $scope.closeModal(); 
		 }).
		   error(function(data, status, headers, config) {
			   $scope.showAlert('注册失败。 '+data.message+"。");
		   });
	  }; 
	  	   
	  $scope.logoff = function () { 
		  $http.get('/icarving.api.pinche/user/logoff?username='+UserService.getUsername()+'&password='+UserService.getPassword()).
		  success(function(data, status, headers, config) {
			  var userid = UserService.getUid();
			  var username = UserService.getUsername();
			  var password = UserService.getPassword();
			  
			  var date=new Date();
			  date.setTime(date.getTime()-10000);
			  var deleteCookieStr = "uid="+userid+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "username="+username+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "password="+password+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			 
			  uid = 0;
			  $scope.openModal(); 
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('退出登录失败。 '+data.message+"。");
		 });
	 }; 
	 
	 var cookieUid = UserService.getUid();
	 $scope.messages = [];
	 $scope.notifyLength = 0;
	 $scope.notifies = [];
	 $scope.messageLength = 0;
	 $scope.msgs = [];
	 $scope.activities = [];
	 $scope.showActivity = true;
	 $scope.showNotify = false;
	 $scope.showMessage = false;
	 MyActivity.all().success(function(res){
		if(cookieUid != ""){
			uid = cookieUid;
			MyMessage.all().success(function(res){
			 $scope.messages = res.response;
			 MyMessage.save($scope.messages);
			 var msg = {};
			 for(var i =0; i<$scope.messages.length; i++){
				 var msg = $scope.messages[i];
				 if(msg.status==0){
					 msg.isNew = true;
					 msg.isOld = false;
				 } else {
					 msg.isNew = false;
					 msg.isOld = true; 
				 }
				 if(msg.messageType == 1){
					 $scope.notifies[i] = msg;
					 if(msg.status == 0){
						 $scope.notifyLength = $scope.notifyLength + 1;
					 }
				 }
				 if(msg.messageType == 2){
					 $scope.msgs[i] = msg;
					 if(msg.status == 0){
						 $scope.messageLength = $scope.messageLength + 1;
					 }
				 }
			 }
			});
		} else {
			 $scope.openModal();
		}
		$scope.items = res.response;
		MyActivity.save($scope.items);
		 
		for(var i =0;i<$scope.items.length; i++){
			$scope.activities[i] = $scope.items[i];
			
			if($scope.activities[i].ownerId == uid){
				$scope.activities[i].my = true;
			} else {
				$scope.activities[i].my = false;
			}
			$scope.activities[i].applied = false;
			var applies = $scope.activities[i].applies;
			if(applies != null){
				for(var j = 0; j < applies.length; j++){
					if(applies[j].ownerId == uid){
						$scope.activities[i].applied = true;
						$scope.activities[i].myapply = applies[j];
						break;
					}
				}
			}
			if($scope.activities[i].activityType==1){
				$scope.activities[i].type = "捡人";
				$scope.activities[i].pick = true;
				$scope.activities[i].picked = false;
			} else {
				$scope.activities[i].type = "搭车";
				$scope.activities[i].pick = false;
				$scope.activities[i].picked = true;
			}
		}
		 
	 });
	 
	$scope.selectActivity = function(){
		 $scope.showActivity = true;
		 $scope.showNotify = false;
		 $scope.showMessage = false;
	};
	
	$scope.selectNotify = function(){
		 $scope.showActivity = false;
		 $scope.showNotify = true;
		 $scope.showMessage = false;
	};
	
	$scope.selectMessage = function(){
		 $scope.showActivity = false;
		 $scope.showNotify = false;
		 $scope.showMessage = true;
	};	 

	 
	  $scope.doRefresh = function() {
		 $scope.$broadcast('scroll.refreshComplete');
      }
	
})

.controller('MyActivityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, MyActivity) {
    $scope.showAlert = function(templateStr) {
	   var alertPopup = $ionicPopup.alert({
	     title: '<b>温馨提示</b>',
	     template: templateStr
	   });
	   alertPopup.then(function(res) {
	     console.log('');
	   });
    };
	
	$scope.activity = MyActivity.get($stateParams.activityId);
	if($scope.activity.ownerId == uid){
		$scope.activity.my = true;
	} else {
		$scope.activity.my = false;
	}	
	$scope.activity.applied = false;
	var applies = $scope.activity.applies;
	if(applies != null){
		$scope.applies = applies;
		for(var i = 0; i < applies.length; i++){
			if(applies[i].ownerId == uid){
				$scope.activity.applied = true;
				$scope.activity.myapply = applies[i];
				break;
			}
		}
	}
	if($scope.activity.activityType==1){
		$scope.activity.type = "捡人";
		$scope.activity.pick = true;
		$scope.activity.picked = false;
	} else {
		$scope.activity.type = "搭车";
		$scope.activity.pick = false;
		$scope.activity.picked = true;
	}
	
	$scope.applyActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请成功，可以在个人页面中查看申请详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请失败。 '+data.message+"。");
		  });
	};
	
    $scope.updateActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"startTime":$scope.activity.startTime+":00","returnTime":$scope.activity.returnTime+":00","sourceAddress":$scope.activity.sourceAddress,"destAddress":$scope.activity.destAddress,"charge":$scope.activity.charge,"carType":$scope.activity.carType,"note":$scope.activity.note};
		$http.post('/icarving.api.pinche/activity/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新失败。 "+data.message+"。");
		  });
    };
	
    $scope.cancelActivity = function(){
		 $http.get('/icarving.api.pinche/activity/cancel?uid='+uid+'&activityId='+$scope.activity.activityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消失败。 "+data.message+"。");
		  });
    };

	$scope.approveApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/approve?applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApproveApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/unapprove?applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.cancelApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/cancel?uid='+uid+'&applyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("取消申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("取消申请失败。 "+data.message+"。");
		  });
	};
	
    if($stateParams.messageId != undefined){
		$http.get('/icarving.api.pinche/message/read?msgId='+$stateParams.messageId)
	    .success(function(data, status, headers, config) {
	     })
	    .error(function(data, status, headers, config) {
	    });
	}
	
	// date time picker
    $scope.model = {};
    $scope.openStartTimeDatePicker = function() {		  
		$scope.$watch('model.startTimeStr', function(unformattedDate){
			$scope.model.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.startTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {
		$scope.$watch('model.returnTimeStr', function(unformattedDate){
		    $scope.model.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.model.returnTimeStr;	    
	    var birthDatePopup = $ionicPopup.show({
	     template: '<datetimepicker ng-model="tmp.newDate" datetimepicker-config="{startView:\'day\', minView:\'hour\'}"></datetimepicker>',
	     title: "请选择时间",
	     scope: $scope,
	     buttons: [
	       { text: '取消' },
	       {
	         text: '<b>保存</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	        	 $scope.model.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 };
	
})




