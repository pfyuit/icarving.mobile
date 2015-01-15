angular.module('icarving.mycontrollers', [])

.controller('MyCtrl', function($scope, $http, $ionicModal, $ionicPopup, User, Activity, Apply, Message) {
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
		  $http.get('/icarving.api.pinche/user/logoff?username='+User.getUsername()+'&password='+User.getPassword()).
		  success(function(data, status, headers, config) {
			  var userid = User.getUid();
			  var username = User.getUsername();
			  var password = User.getPassword();
			  
			  var date=new Date();
			  date.setTime(date.getTime()-10000);
			  var deleteCookieStr = "uid="+userid+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "username="+username+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "password="+password+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			 
			  uid = 0;
			  var userAgent = navigator.userAgent.toLowerCase(); 
			  if(userAgent.indexOf("micromessenger", 0) > -1){
				window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2Fwww.icarving.cn%2Ficarving.api.wechat%2Fuser%2Fauth%2Fcallback&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
			  } else {
				while($scope.modal == undefined){}
				$scope.openModal();
			  }
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('退出登录失败。 '+data.message+"。");
		 });
	 }; 
	 	 
	 var updateModel = function(){
		 //process activities
		 $scope.activities = Activity.getAllByOwnerId(uid);
		 for(var i = 0; i < $scope.activities.length; i++){
				if($scope.activities[i].ownerId == uid){
					$scope.activities[i].my = true;
				} else {
					$scope.activities[i].my = false;
				}
				$scope.activities[i].applied = false;
				var applies = Apply.getAllByActivityId($scope.activities[i].activityId);
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
				
				var messages = Message.getAllMessageByActivityId($scope.activities[i].activityId);
				$scope.activities[i].messages = messages;
		 }
		 		 
		 //process notifies and messages
		 $scope.notifies = [];
		 $scope.msgs = [];
		 $scope.notifyLength = 0;
		 $scope.messageLength = 0;
		 var notifies = Message.getAllNotifyByOwnerId(uid);
		 var msgs = Message.getAllMessageByOwnerId(uid);
		 for(var i =0; i<notifies.length; i++){
			 $scope.notifies[i] = notifies[i];
			 if($scope.notifies[i].status == 0){
				 $scope.notifies[i].isNew = true;
				 $scope.notifies[i].isOld = false;
				 $scope.notifyLength = $scope.notifyLength + 1;
			 } else {
				 $scope.notifies[i].isNew = false;
				 $scope.notifies[i].isOld = true;
			 }
		 }
		 for(var i =0; i<msgs.length; i++){
			 $scope.msgs[i] = msgs[i];
			 if($scope.msgs[i].status == 0){
				 $scope.msgs[i].isNew = true;
				 $scope.msgs[i].isOld = false;
				 $scope.messageLength = $scope.messageLength + 1;
			 } else {
				 $scope.msgs[i].isNew = false;
				 $scope.msgs[i].isOld = true;
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
	 updateModel();
	 
	 //Request network, update cache, and update model 
	 Activity.fetchAllByOwnerId().success(function(res){
		Message.fetchAllByOwnerId()
		.success(function(data, status, headers, config) {
			Message.saveOrUpdateAll(data.response);
			updateModel();
		})
		.error(function(data, status, headers, config) {
			$scope.showAlert("取活动消息失败。 "+data.message+"。");
		});
		
		for(var i = 0; i < res.response.length; i ++){
			Apply.fetchAllByActivityId(res.response[i].activityId)
			.success(function(data, status, headers, config) {
			   Apply.saveOrUpdateAll(data.response);
			   updateModel();
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取申请失败。 '+data.message+"。");
			});
			 
			Message.fetchAllByActivityId(res.response[i].activityId)
			.success(function(data, status, headers, config) {
			   Message.saveOrUpdateAll(data.response);
			   updateModel();
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取消息失败。 '+data.message+"。");
			});
		}
		
		Activity.saveOrUpdateAll(res.response);		
		updateModel();
	 });
	 
	 $scope.user = User.getUser();
	 User.fetchUser()
	 .success(function(data, status, headers, config) {
	     User.saveUser(data.response);
	     $scope.user = User.getUser();
	 })
	 .error(function(data, status, headers, config) {
	 });
	
	//Leave and reply messages
	$scope.leaveMessage = function(activity){
		activity.messagePlaceHolder = "请留言";
		activity.leave = true;
		activity.reply = false;
		activity.showMessageWidget = true;
	};
	$scope.replyMessage = function(activity, fromUid, fromName){
		activity.messagePlaceHolder = "回复"+fromName+":";
		activity.leave = false;
		activity.reply = true;
		activity.showMessageWidget = true;
		activity.toUid = fromUid;
		activity.toName = fromName;
	};
	$scope.sendMessage = function(activity){
		activity.showMessageWidget = false;
		var toUid = 0;
		var toName = "";
		var isReply = 0;
		if(activity.leave == true){
			toUid = activity.ownerId;
		}
		if(activity.reply == true){
			toUid = activity.toUid;
			toName  = activity.toName;
			isReply = 1;
		}
		var payload = {"messageType":2, "activityId":activity.activityId, "activitySourceAddress":activity.sourceAddress,"activityDestAddress":activity.destAddress,"applyId":0, "fromUid":uid, "toUid": toUid, "toName":toName, "content":activity.data.userMessage, "isReply":isReply};
		Message.sendMessage(payload)
		.success(function(data, status, headers, config) {
			Message.fetchAllByActivityId(activity.activityId)
			.success(function(data, status, headers, config) {
				  Message.saveOrUpdateAll(data.response);
				  updateModel();
			})
			.error(function(data, status, headers, config) {
				  $scope.showAlert("取活动消息失败。 "+data.message+"。");
			});
			
			Apply.fetchAllByActivityId(activity.activityId)
			.success(function(data, status, headers, config) {
			   Apply.saveOrUpdateAll(data.response);
			   updateModel();
			})
			.error(function(data, status, headers, config) {
				 $scope.showAlert('获取申请失败。 '+data.message+"。");
			});	
			
			Activity.fetchByActivityId(activity.activityId)
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
		activity.data.userMessage = "";
	};
	
	//Select tab: Activity, Notify, Message
	$scope.showActivity = true;
	$scope.showNotify = false;
	$scope.showMessage = false;
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
		 //Request network, update cache, and update model 
		 Activity.fetchAllByOwnerId().success(function(res){
			if(cookieUid != ""){
				uid = cookieUid;
				Message.fetchAllByOwnerId()
				.success(function(data, status, headers, config) {
					Message.saveOrUpdateAll(data.response);
					updateModel();
				})
				.error(function(data, status, headers, config) {
					$scope.showAlert("取活动消息失败。 "+data.message+"。");
				});
			} else {
				$scope.openModal();
			}
			
			for(var i = 0; i < res.response.length; i ++){
				Apply.fetchAllByActivityId(res.response[i].activityId)
				.success(function(data, status, headers, config) {
				   Apply.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取申请失败。 '+data.message+"。");
				});
				 
				Message.fetchAllByActivityId(res.response[i].activityId)
				.success(function(data, status, headers, config) {
				   Message.saveOrUpdateAll(data.response);
				   updateModel();
				})
				.error(function(data, status, headers, config) {
					 $scope.showAlert('获取消息失败。 '+data.message+"。");
				});
			}
			
			Activity.saveOrUpdateAll(res.response);		
			updateModel();
		 });	
	  $scope.$broadcast('scroll.refreshComplete');
    };
	
})

.controller('MyActivityDetailCtrl', function($scope, $http, $stateParams, $ionicPopup, $filter, User, Activity, Apply, Message) {
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
		
	//Read message if any
    if($stateParams.messageId != undefined){
		Message.readMessage($stateParams.messageId)
	    .success(function(data, status, headers, config) {
	    	Message.saveOrUpdate(data.response);
	    	updateModel();
	    })
	    .error(function(data, status, headers, config) {
	    });
	}	
	
})