angular.module('icarving.viewcontrollers', [])

.controller('ViewCtrl', function($scope, $http, $ionicModal, $ionicPopup, $filter, User, Activity, Apply, Message) {
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
	
    var filter = 0;	
    
    var updateModelAll = function(){
    	$scope.activities = [];
		var items = Activity.getAllValid();
		for(var i =0;i<items.length; i++){
			$scope.activities[i] = items[i];
			if(items[i].activityType==1){
				$scope.activities[i].type = "捡人";
				$scope.activities[i].pick = true;
				$scope.activities[i].picked = false;
			} else {
				$scope.activities[i].type = "搭车";
				$scope.activities[i].pick = false;
				$scope.activities[i].picked = true;
			}
		}
    };   
    var updateModelPick = function(){
		$scope.activities = [];
		var items = Activity.getAllValid();
		for(var i =0;i<items.length; i++){
			if(items[i].activityType==1){
				var temp = items[i];
				temp.type = "捡人";
				temp.pick = true;
				temp.picked = false;
				$scope.activities.push(temp);
			}
		}
    };    
    var updateModelPicked = function(){
		$scope.activities = [];
		var items = Activity.getAllValid();
		for(var i =0;i<items.length; i++){
			if(items[i].activityType==2){
				var temp = items[i];
				temp.type = "搭车";
				temp.pick = false;
				temp.picked = true;
				$scope.activities.push(temp);
			}
		}
    };
    
    //Check authentication
	var cookieUid = User.getUid();
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
			    if(args["uid"] != undefined){
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
			    } else {
					var userAgent = navigator.userAgent.toLowerCase(); 
					if(userAgent.indexOf("micromessenger", 0) > -1){
						window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2Fwww.icarving.cn%2Ficarving.api.wechat%2Fuser%2Fauth%2Fcallback&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
					} else {
						if($scope.modal != undefined){
							$scope.openModal();
						} else {
							  $ionicModal.fromTemplateUrl('templates/user-modal.html', {
							    scope: $scope,
							    animation: 'slide-in-up'
							  }).then(function(modal) {
							    $scope.modal = modal;
							    $scope.openModal();
							  });
						}				
					}
			    }
			}			
		} else {
			var userAgent = navigator.userAgent.toLowerCase(); 
			if(userAgent.indexOf("micromessenger", 0) > -1){
				window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2Fwww.icarving.cn%2Ficarving.api.wechat%2Fuser%2Fauth%2Fcallback&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
			} else {
				if($scope.modal != undefined){
					$scope.openModal();
				} else {
					  $ionicModal.fromTemplateUrl('templates/user-modal.html', {
					    scope: $scope,
					    animation: 'slide-in-up'
					  }).then(function(modal) {
					    $scope.modal = modal;
					    $scope.openModal();
					  });
				}				
			}
		}
	}	 		
       
    //Read cache and update model
    updateModelAll();
    
    //Request network, update cache, and update model
	Activity.fetchAllValid().success(function(res){
		for(var i = 0; i < res.response.length; i ++){
			Apply.fetchAllByActivityId(res.response[i].activityId)
			.success(function(data, status, headers, config) {
			   Apply.saveOrUpdateAll(data.response);
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取申请失败。 '+data.message+"。");
			});
			 
			Message.fetchAllByActivityId(res.response[i].activityId)
			.success(function(data, status, headers, config) {
			   Message.saveOrUpdateAll(data.response);
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取消息失败。 '+data.message+"。");
			});
		}
		
		Activity.saveOrUpdateAll(res.response);
		updateModelAll();
	});
	
	//Select tab: All, Pick, Picked
	$scope.selectAll = function(){
		updateModelAll();
		filter = 0;
	};	
	$scope.selectPick = function(){
		updateModelPick();
		filter = 1;
	};	
	$scope.selectPicked = function(){
		updateModelPicked();
		filter = 2;
	};

	//Refresh the home page
	$scope.doRefresh = function() {
		//Request network, update cache, and update model
		Activity.fetchAllValid().success(function(res){
			for(var i = 0; i < res.response.length; i ++){
				Apply.fetchAllByActivityId(res.response[i].activityId)
				.success(function(data, status, headers, config) {
				   Apply.saveOrUpdateAll(data.response);
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取申请失败。 '+data.message+"。");
				});
				 
				Message.fetchAllByActivityId(res.response[i].activityId)
				.success(function(data, status, headers, config) {
				   Message.saveOrUpdateAll(data.response);
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取消息失败。 '+data.message+"。");
				});
			}
			
			Activity.saveOrUpdateAll(res.response);
		    if(filter == 0){
		    	updateModelAll();
		    }
		    if(filter == 1){
		    	updateModelPick();
		    }
		    if(filter == 2){
		    	updateModelPicked();
		    }
		});
		$scope.$broadcast('scroll.refreshComplete');
    };
})

.controller('ViewSearchFormCtrl', function($scope, $ionicPopup, $stateParams, User, Activity, Apply, Message) {
	//TODO
})

.controller('ViewSearchActivityListCtrl', function($scope, $ionicPopup, $stateParams, Search) {
    $scope.showAlert = function(templateStr) {
	   var alertPopup = $ionicPopup.alert({
	     title: '<b>温馨提示</b>',
	     template: templateStr
	   });
	   alertPopup.then(function(res) {
	     console.log('');
	   });
    };
	
	$scope.acts = [];
	Search.search($stateParams.sourceAddress, $stateParams.destAddress,$stateParams.startTime, $stateParams.returnTime).success(function(res){	
		Search.save(res.response);
		
		for(var i = 0; i < res.response.length; i++){
			$scope.acts[i] = res.response[i];
			if($scope.acts[i].activityType==1){
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
})


.controller('ViewActivityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, User, Activity, Apply, Message) {
    $scope.showAlert = function(templateStr) {
	   var alertPopup = $ionicPopup.alert({
	     title: '<b>温馨提示</b>',
	     template: templateStr
	   });
	   alertPopup.then(function(res) {
	     console.log('');
	   });
    };
    
    var updateModel = function(){
    	//process activity
    	$scope.activity = Activity.getByActivityId($stateParams.activityId);
    	if($scope.activity.ownerId == uid){
    		$scope.activity.my = true;
    	} else {
    		$scope.activity.my = false;
    	}	
    	$scope.activity.applied = false;
    	var applies = Apply.getAllByActivityId($scope.activity.activityId);
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
    	
    	//process messages
    	$scope.messages = Message.getAllMessageByActivityId($scope.activity.activityId);
    };
    	
	//Read cache and update model
	updateModel();
	
	//Request network, update cache, and update model
	Activity.fetchByActivityId($scope.activity.activityId)
	.success(function(data, status, headers, config) {
		Apply.fetchAllByActivityId(data.response.activityId)
		.success(function(data, status, headers, config) {
		   Apply.saveOrUpdateAll(data.response);
		   updateModel();
		})
		.error(function(data, status, headers, config) {
			 $scope.showAlert('获取申请失败。 '+data.message+"。");
		});	
		
		Message.fetchAllByActivityId(data.response.activityId)
		.success(function(data, status, headers, config) {
		   Message.saveOrUpdateAll(data.response);
		   updateModel();
		})
		.error(function(data, status, headers, config) {
			 $scope.showAlert('获取消息失败。 '+data.message+"。");
		});
		
		Activity.saveOrUpdate(data.response);		
		updateModel();
	})
	.error(function(data, status, headers, config) {
		 $scope.showAlert('获取活动失败。 '+data.message+"。");
	});
	
	$scope.applyActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"applyUserId":uid};
		Apply.createApply(payload)
		.success(function(data, status, headers, config) {			  
			  Activity.fetchByActivityId($scope.activity.activityId)
			  .success(function(data, status, headers, config) {
				  Activity.saveOrUpdate(data.response);
				  updateModel();
			  })
			  .error(function(data, status, headers, config) {
				  $scope.showAlert('获取活动失败。 '+data.message+"。");
			  });	
			  
			  Message.fetchAllByActivityId(data.response.activityId)
			  .success(function(data, status, headers, config) {
				  Message.saveOrUpdateAll(data.response);
				  updateModel();
			  })
			  .error(function(data, status, headers, config) {
				  $scope.showAlert('获取消息失败。 '+data.message+"。");
			  });
			   
			  Apply.saveOrUpdate(data.response);
			  updateModel();
			  
			  $scope.showAlert('活动申请成功，可以在个人页面中查看申请详细信息');
		 })
		.error(function(data, status, headers, config) {
			  $scope.showAlert('活动申请失败。 '+data.message+"。");
		 });
	};
	
    $scope.updateActivity = function(){
		var payload = {"activityId":$scope.activity.activityId,"startTime":$scope.activity.startTime+":00","returnTime":$scope.activity.returnTime+":00","sourceAddress":$scope.activity.sourceAddress,"destAddress":$scope.activity.destAddress,"charge":$scope.activity.charge,"carType":$scope.activity.carType,"note":$scope.activity.note};
		Activity.updateActivity(payload)
		.success(function(data, status, headers, config) { 
				Apply.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
				   Apply.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取申请失败。 '+data.message+"。");
				});	
				
				Message.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
				   Message.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取消息失败。 '+data.message+"。");
				});
				
				Activity.saveOrUpdate(data.response);
				updateModel();
				  
			   $scope.showAlert("捡人活动更新成功");
		 })
		.error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动更新失败。 "+data.message+"。");
		 });
    };
	
    $scope.cancelActivity = function(){
		 Activity.cancelActivity($scope.activity.activityId)
		 .success(function(data, status, headers, config) {
				Apply.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
				   Apply.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取申请失败。 '+data.message+"。");
				});	
				
				Message.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
				   Message.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取消息失败。 '+data.message+"。");
				});
				
				Activity.saveOrUpdate(data.response);
				updateModel();
				  
			  $scope.showAlert("捡人活动取消成功");
		  })
		  .error(function(data, status, headers, config) {
			  $scope.showAlert("捡人活动取消失败。 "+data.message+"。");
		  });
    };
    
	$scope.approveApply = function(applyId){
		Apply.approveApply(applyId)
		.success(function(data, status, headers, config) {
			Activity.fetchByActivityId($scope.activity.activityId)
			.success(function(data, status, headers, config) {
				Activity.saveOrUpdate(data.response);
				updateModel();
			})
			.error(function(data, status, headers, config) {
				$scope.showAlert('获取活动失败。 '+data.message+"。");
			});
			
			Message.fetchAllByActivityId(data.response.activityId)
			.success(function(data, status, headers, config) {
				Message.saveOrUpdateAll(data.response);
				updateModel();
			})
			.error(function(data, status, headers, config) {
				$scope.showAlert('获取消息失败。 '+data.message+"。");
			});
			
			Apply.saveOrUpdate(data.response);
			updateModel();
			
			$scope.showAlert("批准申请成功");		
		})
		.error(function(data, status, headers, config) {
			$scope.showAlert("批准申请失败。 "+data.message+"。");
		});
	};
	
	$scope.unApproveApply = function(applyId){
		Apply.unapproveApply(applyId)
		.success(function(data, status, headers, config) {
			Activity.fetchByActivityId($scope.activity.activityId)
			.success(function(data, status, headers, config) {
				Activity.saveOrUpdate(data.response);
				updateModel();
			})
			.error(function(data, status, headers, config) {
				$scope.showAlert('获取活动失败。 '+data.message+"。");
			});		
			
			Message.fetchAllByActivityId(data.response.activityId)
			.success(function(data, status, headers, config) {
				Message.saveOrUpdateAll(data.response);
				updateModel();
			})
			.error(function(data, status, headers, config) {
				$scope.showAlert('获取消息失败。 '+data.message+"。");
			});
			
		 	Apply.saveOrUpdate(data.response);
		 	updateModel();
		   
			$scope.showAlert("拒绝申请成功");
		})
		.error(function(data, status, headers, config) {
				$scope.showAlert("拒绝申请失败。 "+data.message+"。");
		});
	};
	
	$scope.cancelApply = function(applyId){
		Apply.cancelApply(applyId)
		.success(function(data, status, headers, config) {
				Activity.fetchByActivityId($scope.activity.activityId)
				.success(function(data, status, headers, config) {
					Activity.saveOrUpdate(data.response);
				 	updateModel();
				})
				.error(function(data, status, headers, config) {
					$scope.showAlert('获取活动失败。 '+data.message+"。");
				});	
				
				Message.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
					Message.saveOrUpdateAll(data.response);
				 	updateModel();
				})
				.error(function(data, status, headers, config) {
					$scope.showAlert('获取消息失败。 '+data.message+"。");
				});
				
				Apply.saveOrUpdate(data.response);
			 	updateModel();
			 	
			 	$scope.showAlert("取消申请成功");				
		})
		.error(function(data, status, headers, config) {
				$scope.showAlert("取消申请失败。 "+data.message+"。");
		});
	};
	
	$scope.renewApply = function(applyId){
		Apply.renewApply(applyId)
		.success(function(data, status, headers, config) {
				Activity.fetchByActivityId($scope.activity.activityId)
				.success(function(data, status, headers, config) {
					Activity.saveOrUpdate(data.response);
				 	updateModel();
				})
				.error(function(data, status, headers, config) {
					$scope.showAlert('获取活动失败。 '+data.message+"。");
				});	
				
				Message.fetchAllByActivityId(data.response.activityId)
				.success(function(data, status, headers, config) {
					Message.saveOrUpdateAll(data.response);
				 	updateModel();
				})
				.error(function(data, status, headers, config) {
					$scope.showAlert('获取消息失败。 '+data.message+"。");
				});
				
				Apply.saveOrUpdate(data.response);
			 	updateModel();
			 	
			 	$scope.showAlert("再次申请成功");				
		})
		.error(function(data, status, headers, config) {
				$scope.showAlert("再次申请失败。 "+data.message+"。");
		});
	};

	
	$scope.messagePlaceHolder = "请留言";
	$scope.showMessageWidget = false;
	$scope.leave = false;
	$scope.reply = false;
	$scope.data = {};
	$scope.leaveMessage = function(){
		$scope.messagePlaceHolder = "请留言";
		$scope.leave = true;
		$scope.reply = false;
		$scope.showMessageWidget = true;
	};
	$scope.replyMessage = function(fromUid, fromName){
		$scope.messagePlaceHolder = "回复"+fromName+":";
		$scope.leave = false;
		$scope.reply = true;
		$scope.showMessageWidget = true;
		$scope.toUid = fromUid;
		$scope.toName = fromName;
	};
	$scope.sendMessage = function(){
		$scope.showMessageWidget = false;
		var toUid = 0;
		var toName = "";
		var isReply = 0;
		if($scope.leave == true){
			toUid = $scope.activity.ownerId;
		}
		if($scope.reply == true){
			toUid = $scope.toUid;
			toName  = $scope.toName;
			isReply = 1;
		}
		var payload = {"messageType":2, "activityId":$scope.activity.activityId, "activitySourceAddress":$scope.activity.sourceAddress,"activityDestAddress":$scope.activity.destAddress,"applyId":0, "fromUid":uid, "toUid": toUid, "toName":toName, "content":$scope.data.userMessage, "isReply":isReply};
		Message.sendMessage(payload)
		.success(function(data, status, headers, config) {
			Message.fetchAllByActivityId($scope.activity.activityId)
			.success(function(data, status, headers, config) {
				  Message.saveOrUpdateAll(data.response);
				  updateModel();
			})
			.error(function(data, status, headers, config) {
				  $scope.showAlert("取活动消息失败。 "+data.message+"。");
			});
			
			Apply.fetchAllByActivityId($scope.activity.activityId)
			.success(function(data, status, headers, config) {
			   Apply.saveOrUpdateAll(data.response);
			   updateModel();
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取申请失败。 '+data.message+"。");
			});	
			
			Activity.fetchByActivityId($scope.activity.activityId)
			.success(function(data, status, headers, config) {
				Activity.saveOrUpdate(data.response);
			 	updateModel();
			})
			.error(function(data, status, headers, config) {
				$scope.showAlert('获取活动失败。 '+data.message+"。");
			});
			
			Message.saveOrUpdate(data.response);
			updateModel();
		})
		.error(function(data, status, headers, config) {
			  $scope.showAlert('消息发布失败。 '+data.message+"。");
		});
		$scope.data.userMessage = "";
	};
	
})