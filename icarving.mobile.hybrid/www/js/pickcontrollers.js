angular.module('icarving.pickcontrollers', [])

.controller('PickCtrl', function($scope, $http, $ionicModal, $ionicPopup, $filter, $ionicLoading, User, Activity, Apply, Message) {
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
      
      //Check invitation code
      $scope.invitation = {};
      var cookieInvitationStatus = User.getInvitationStatus();
      if(cookieInvitationStatus == ""){
         	var myPopup = $ionicPopup.show({
        	    template: '<input type="text" ng-model="invitation.code">',
        	    title: '请输入邀请码：',
        	    scope: $scope,
         	    buttons: [
          	      {
            	        text: '确定',
            	        type: 'button-positive',
            	        onTap: function(e) {
            	          if (!$scope.invitation.code) {
            	            e.preventDefault();
            	          } else {
           	            return $scope.invitation.code;
            	          }
            	        }
            	      }
          	    ]
          	  });
          	  myPopup.then(function(res) {		  
          		  User.verifyInvitation(parseInt(res))
        			  .success(function(data, status, headers, config) {
       					var date=new Date();
      					var expireDays=100;
       					date.setTime(date.getTime()+expireDays*24*3600*1000);
      					var cookieStr = "invitation=verified; expires="+date.toUTCString();
       					document.cookie=cookieStr;
       					invitation = "verified";
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

       					    $ionicLoading.show({
       					        template: '发布中...'
       					    });
       						var payload = {"ownerId":uid, "activityType":1, "startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
       						Activity.createActivity(payload).
       						  success(function(data, status, headers, config) {
       							  Activity.saveOrUpdate(data.response);
       							  $ionicLoading.hide();
       							  $scope.showAlert('捡人活动发布成功，可以在个人页面中查看活动详细信息');
       						  }).
       						  error(function(data, status, headers, config) {
       							  $ionicLoading.hide();
       							  $scope.showAlert('捡人活动发布失败。 '+data.message+"。");
       						  });
       					};
       					
       					//Date time picker
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
        			  .error(function(data, status, headers, config) {
 	 				     $scope.showAlert('校验邀请码失败。'+data.message+"。请联系微信小冰(welikesnow)获取邀请码。");
  			      });
          	  });		  
         }  else {
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

        		    $ionicLoading.show({
        		        template: '发布中...'
        		    });
        			var payload = {"ownerId":uid, "activityType":1, "startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"venue":$scope.model.venue,"phone":$scope.model.phone,"note":$scope.model.note};
        			Activity.createActivity(payload).
        			  success(function(data, status, headers, config) {
        				  Activity.saveOrUpdate(data.response);
        				  $ionicLoading.hide();
        				  $scope.showAlert('捡人活动发布成功，可以在个人页面中查看活动详细信息');
        			  }).
        			  error(function(data, status, headers, config) {
        				  $ionicLoading.hide();
        				  $scope.showAlert('捡人活动发布失败。 '+data.message+"。");
        			  });
        		};
        		
        		//Date time picker
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
         }
      
 
	  
})