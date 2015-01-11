angular.module('icarving.controllers', [])

//View Controller
.controller('ViewCtrl', function($scope, $http, $ionicModal, $ionicPopup, $filter, Activity, UserService) {
	//Pop Up
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
				        var pos = pairs[i].indexOf('=');           // Look for "name=value"
				        if (pos == -1) continue;                   // If not found, skip
				        var argname = pairs[i].substring(0,pos); // Extract the name
				        var value = pairs[i].substring(pos+1);     // Extract the value
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


.controller('ViewActivityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, Activity, ActivityApply) {
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
	if($scope.activity.activityType==1){
		$scope.activity.type = "捡人";
		$scope.activity.pick = true;
		$scope.activity.picked = false;
	} else {
		$scope.activity.type = "搭车";
		$scope.activity.pick = false;
		$scope.activity.picked = true;
	}
	$scope.activity.showApplyPick = !$scope.activity.my && $scope.activity.pick;
	$scope.activity.showApplyPicked = !$scope.activity.my && $scope.activity.picked;
	$scope.activity.showUpdatePick = $scope.activity.my && $scope.activity.pick;
	$scope.activity.showUpdatePicked = $scope.activity.my && $scope.activity.picked;
	
	$scope.applyPickActivity = function(){
		var payload = {"pickActivityId":$scope.activity.activityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/pick/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请成功，可以在个人页面中查看申请详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('捡人活动申请失败。 '+data.message+"。");
		  });
	};
	
	$scope.applyPickedActivity = function(){
		var payload = {"pickedActivityId":$scope.activity.activityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/picked/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动申请成功，可以在个人页面中查看申请详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动申请失败。 '+data.message+"。");
		  });
	};
	
    $scope.updatePickActivity = function(){
		var payload = {"pickActivityId":$scope.activity.activityId,"startTime":$scope.activity.startTime,"returnTime":$scope.activity.returnTime,"sourceAddress":$scope.activity.sourceAddress,"destAddress":$scope.activity.destAddress,"charge":$scope.activity.charge,"carType":$scope.activity.carType,"note":$scope.activity.note};
		$http.post('/icarving.api.pinche/activity/pick/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新失败。 "+data.message+"。");
		  });
    };
    
    $scope.updatePickedActivity = function(){
		var payload = {"pickedActivityId":$scope.activity.activityId,"startTime":$scope.activity.startTime,"returnTime":$scope.activity.returnTime,"sourceAddress":$scope.activity.sourceAddress,"destAddress":$scope.activity.destAddress,"charge":$scope.activity.charge,"carType":$scope.activity.carType,"note":$scope.activity.note};
		$http.post('/icarving.api.pinche/activity/picked/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动更新失败。 "+data.message+"。");
		  });
    };
	
    $scope.cancelPickActivity = function(){
		 $http.get('/icarving.api.pinche/activity/pick/cancel?uid='+uid+'&pickActivityId='+$scope.activity.activityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消失败。 "+data.message+"。");
		  });
    };
     
    $scope.cancelPickedActivity = function(){
		 $http.get('/icarving.api.pinche/activity/picked/cancel?uid='+uid+'&pickedActivityId='+$scope.activity.activityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动取消失败。 "+data.message+"。");
		  });
    };
    
    // activity apply
    $scope.applies = [];
    ActivityApply.all($stateParams.activityId).success(function(res){
		$scope.applies = res.response;
		ActivityApply.save($scope.applies);
	});
    
	$scope.approvePickActivityApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/pick/approve?pickActivityApplyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApprovePickActivityApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/pick/unapprove?pickActivityApplyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.approvePickedActivityApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/picked/approve?pickedActivityApplyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApprovePickedActivityApply = function(applyId){
		 $http.get('/icarving.api.pinche/apply/picked/unapprove?pickedActivityApplyId='+applyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
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

//View Picked Activity Detail Controller
.controller('ViewPickedDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, PickedActivity) {
	//Pop Up
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };
	
	$scope.picked = PickedActivity.get($stateParams.pickedId);
	
	$scope.applyPickedActivity = function(){
		var payload = {"pickedActivityId":$scope.picked.pickedActivityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/picked/create', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动申请成功，可以在个人页面中查看申请详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动申请失败。 '+data.message+"。");
		  });
	};
})

//Pick Activity Controller
.controller('PickCtrl', function($scope, $http, $ionicPopup, $filter) {
	//Pop Up
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

		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/pick/create', payload).
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

//Picked Activity Controller
.controller('PickedCtrl', function($scope, $http, $ionicPopup, $filter) {
	//Pop Up
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

		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/picked/create', payload).
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

//My Activity/Apply Controller
.controller('MyCtrl', function($scope, $http, $ionicModal, $ionicPopup, MyPickActivity, MyPickedActivity, MyPickActivityApply, MyPickedActivityApply, UserService, MyMessage) {
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
	 
	 $scope.messageLength = 0;
	
	 var cookieUid = UserService.getUid();
	 
	 MyPickActivity.all().success(function(res){
		if(cookieUid != ""){
			uid = cookieUid;
			MyMessage.all().success(function(res){
			 $scope.messages = res.response;
			 MyMessage.save($scope.messages);
			 if($scope.messages != null && $scope.messages != undefined){
				 for(var i = 0; i < $scope.messages.length; i++){
					 if($scope.messages[i].status == 0){
						 $scope.messageLength =  $scope.messageLength +1; 
					 }
				 }
			 }
			});
		} else {
			 $scope.openModal();
		}
		 $scope.items = res.response;
		 MyPickActivity.save($scope.items);
	 });
	 MyPickedActivity.all().success(function(res){
		 $scope.items1 = res.response;
		 MyPickedActivity.save($scope.items1);
	 });
	 MyPickActivityApply.all().success(function(res){
		 $scope.items2 = res.response;
		 MyPickActivityApply.save($scope.items2);
	 });
	 MyPickedActivityApply.all().success(function(res){
		 $scope.items3 = res.response;
		 MyPickedActivityApply.save($scope.items3);
	 });
	 
	  $scope.doRefresh = function() {
		 MyPickActivity.all().success(function(res){
			 $scope.items = res.response;
			 MyPickActivity.save($scope.items);
		 });
		 MyPickedActivity.all().success(function(res){
			 $scope.items1 = res.response;
			 MyPickedActivity.save($scope.items1);
		 });
		 MyPickActivityApply.all().success(function(res){
			 $scope.items2 = res.response;
			 MyPickActivityApply.save($scope.items2);
		 });
		 MyPickedActivityApply.all().success(function(res){
			 $scope.items3 = res.response;
			 MyPickedActivityApply.save($scope.items3);
		 });
		 $scope.$broadcast('scroll.refreshComplete');
      }
	
})

//My Message List Controller
.controller('MyMessageListCtrl', function($scope, MyMessage) {
	$scope.msgs = [];
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
			 $scope.msgs[i] = msg;
		 }
	});
		
	$scope.doRefresh = function() {
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
				 $scope.msgs[i] = msg;
			 }
		});
		$scope.$broadcast('scroll.refreshComplete');
	 };
})

//My Message Detail Controller
.controller('MyMessageDetailCtrl', function($scope, $http, $stateParams, MyMessage) {
	$scope.message = MyMessage.get($stateParams.userMessageId);
	
	$http.get('/icarving.api.pinche/message/read?msgId='+$stateParams.userMessageId)
	.success(function(data, status, headers, config) {
	 })
	.error(function(data, status, headers, config) {
	 });
})

//My Pick Activity Detail Controller
.controller('MyPickDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, MyPickActivity) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	
	
	$scope.pick = MyPickActivity.get($stateParams.pickId);

    $scope.updatePickActivity = function(){
		var payload = {"pickActivityId":$scope.pick.pickActivityId,"startTime":$scope.pick.startTime,"returnTime":$scope.pick.returnTime,"sourceAddress":$scope.pick.sourceAddress,"destAddress":$scope.pick.destAddress,"charge":$scope.pick.charge,"carType":$scope.pick.carType,"note":$scope.pick.note};
		$http.post('/icarving.api.pinche/activity/pick/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新失败。 "+data.message+"。");
		  });
    };
    
    $scope.cancelPickActivity = function(){
		 $http.get('/icarving.api.pinche/activity/pick/cancel?uid='+uid+'&pickActivityId='+$scope.pick.pickActivityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消失败。 "+data.message+"。");
		  });
    };
    
	$scope.openStartTimeDatePicker = function() {
		  
		$scope.$watch('pick.startTimeStr', function(unformattedDate){
			$scope.pick.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});
		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.pick.startTimeStr;
	    
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
	        	 $scope.pick.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {

		$scope.$watch('pick.returnTimeStr', function(unformattedDate){
		    $scope.pick.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});
		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.pick.returnTimeStr;
	    
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
	        	 $scope.pick.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 }
    
})

//My Picked Activity Detail Controller
.controller('MyPickedDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, MyPickedActivity) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	
 
	$scope.picked = MyPickedActivity.get($stateParams.pickedId);
	
    $scope.updatePickedActivity = function(){
		var payload = {"pickedActivityId":$scope.picked.pickedActivityId,"startTime":$scope.picked.startTime,"returnTime":$scope.picked.returnTime,"sourceAddress":$scope.picked.sourceAddress,"destAddress":$scope.picked.destAddress,"charge":$scope.picked.charge,"carType":$scope.picked.carType,"note":$scope.picked.note};
		$http.post('/icarving.api.pinche/activity/picked/update', payload).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动更新失败。 "+data.message+"。");
		  });
    };
    
    $scope.cancelPickedActivity = function(){
		 $http.get('/icarving.api.pinche/activity/picked/cancel?uid='+uid+'&pickedActivityId='+$scope.picked.pickedActivityId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动取消失败。 "+data.message+"。");
		  });
   };
   
	$scope.openStartTimeDatePicker = function() {
		  
		$scope.$watch('picked.startTimeStr', function(unformattedDate){
			$scope.picked.startTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});
		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.picked.startTimeStr;
	    
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
	        	 $scope.picked.startTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	};
	  
	$scope.openReturnTimeDatePicker = function() {

		$scope.$watch('picked.returnTimeStr', function(unformattedDate){
		    $scope.picked.returnTime = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm:ss');
		});
		  
	    $scope.tmp = {};
	    $scope.tmp.newDate = $scope.picked.returnTimeStr;
	    
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
	        	 $scope.picked.returnTimeStr = $scope.tmp.newDate;
	         }
	       }
	     ]
	    });
	 }
	
})

//My Pick Activity Apply Detail Controller
.controller('MyPickApplyDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, MyPickActivityApply) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	
 
	$scope.pickApply = MyPickActivityApply.get($stateParams.pickApplyId);
	
	$scope.cancelPickActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/pick/cancel?uid='+uid+'&pickActivityApplyId='+$scope.pickApply.pickActivityApplyId).
		  success(function(data, status, headers, config) {
			 MyPickActivityApply.all().success(function(res){
				 $scope.items = res.response;
				 MyPickActivityApply.save($scope.items);
				 $scope.pickApply = MyPickActivityApply.get($stateParams.pickApplyId);
			  });
			  $scope.showAlert("捡人活动申请取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动申请取消失败。 "+data.message+"。");
		  });
	};
})

//My Picked Activity Apply Detail Controller
.controller('MyPickedApplyDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, MyPickedActivityApply) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	
 
	$scope.pickedApply = MyPickedActivityApply.get($stateParams.pickedApplyId);
	
	$scope.cancelPickedActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/picked/cancel?uid='+uid+'&pickedActivityApplyId='+$scope.pickedApply.pickedActivityApplyId).
		  success(function(data, status, headers, config) {
			 MyPickedActivityApply.all().success(function(res){
				 $scope.items = res.response;
				 MyPickedActivityApply.save($scope.items);
				 $scope.pickedApply = MyPickedActivityApply.get($stateParams.pickedApplyId);
			  });
			  $scope.showAlert("搭车活动申请取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("搭车活动申请取消失败。 "+data.message+"。");
		  });
	};
})

//My Pick Activity People Apply List Controller
.controller('MyPickPeopleApplyListCtrl', function($scope, $http, $stateParams, MyPickActivityPeopleApply) {	
	MyPickActivityPeopleApply.all($stateParams.pickActivityId).success(function(res){
		$scope.applies = res.response;
		MyPickActivityPeopleApply.save($scope.applies);
	});
		
	$scope.doRefresh = function() {
		MyPickActivityPeopleApply.all($stateParams.pickActivityId).success(function(res){
			$scope.applies = res.response;
			MyPickActivityPeopleApply.save($scope.applies);
		});
		$scope.$broadcast('scroll.refreshComplete');
	 };
})

//My Pick Activity People Apply Detail Controller
.controller('MyPickPeopleApplyDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, MyPickActivityPeopleApply) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	

	$scope.pickApply = MyPickActivityPeopleApply.get($stateParams.pickActivityApplyId);
	
	$scope.approvePickActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/pick/approve?pickActivityApplyId='+$scope.pickApply.pickActivityApplyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApprovePickActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/pick/unapprove?pickActivityApplyId='+$scope.pickApply.pickActivityApplyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
		  });
	};

})

//My Picked Activity People Apply List Controller
.controller('MyPickedPeopleApplyListCtrl', function($scope, $http, $stateParams, MyPickedActivityPeopleApply) {	
	MyPickedActivityPeopleApply.all($stateParams.pickedActivityId).success(function(res){
		$scope.applies = res.response;
		MyPickedActivityPeopleApply.save($scope.applies);
	});
		
	$scope.doRefresh = function() {
		MyPickedActivityPeopleApply.all($stateParams.pickedActivityId).success(function(res){
			$scope.applies = res.response;
			MyPickedActivityPeopleApply.save($scope.applies);
		});
		$scope.$broadcast('scroll.refreshComplete');
	 };
})

//My Picked Activity People Apply Detail Controller
.controller('MyPickedPeopleApplyDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, MyPickedActivityPeopleApply) {
    $scope.showAlert = function(templateStr) {
		   var alertPopup = $ionicPopup.alert({
		     title: '<b>温馨提示</b>',
		     template: templateStr
		   });
		   alertPopup.then(function(res) {
		     console.log('');
		   });
    };	

	$scope.pickedApply = MyPickedActivityPeopleApply.get($stateParams.pickedActivityApplyId);
	
	$scope.approvePickedActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/picked/approve?pickedActivityApplyId='+$scope.pickedApply.pickedActivityApplyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("批准申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("批准申请失败。 "+data.message+"。");
		  });
	};
	
	$scope.unApprovePickedActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/picked/unapprove?pickedActivityApplyId='+$scope.pickedApply.pickedActivityApplyId).
		  success(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert("拒绝申请失败。 "+data.message+"。");
		  });
	};

})


.controller('ViewSearchFormCtrl', function($scope, $ionicPopup, $stateParams, SearchActivity) {
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

//Search Picked Activity List Controller
.controller('SearchPickedListCtrl', function($scope, $ionicPopup, $stateParams, SearchPickedActivity) {
	//Pop Up
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
	SearchPickedActivity.all($stateParams.sourceAddress, $stateParams.destAddress,$stateParams.startTime, $stateParams.returnTime).success(function(res){
		$scope.items = res.response;
		SearchPickedActivity.save($scope.items);
	}).error(function(res) {
		  $scope.showAlert("搜索失败。 "+res.message+"。");
	});
	 
	$scope.doRefresh = function(){
		SearchPickedActivity.all($stateParams.sourceAddress, $stateParams.destAddress,$stateParams.startTime, $stateParams.returnTime).success(function(res){
			$scope.items = res.response;
			SearchPickedActivity.save($scope.items);
		}).error(function(res) {
			  $scope.showAlert("搜索失败。 "+res.message+"。");
		});
	 }
	  
});

