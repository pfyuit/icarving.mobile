angular.module('icarving.pickedcontrollers', [])

.controller('PickedCtrl', function($scope, $http, $ionicPopup, $filter, User, Activity, Apply, Message) {
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
		Activity.createActivity(payload).
		  success(function(data, status, headers, config) {
			  Activity.saveOrUpdate(data.response);
			  $scope.showAlert('搭车活动发布成功，可以在个人页面中查看活动详细信息');
		  }).
		  error(function(data, status, headers, config) {
			  $scope.showAlert('搭车活动发布失败。 '+data.message+"。");
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