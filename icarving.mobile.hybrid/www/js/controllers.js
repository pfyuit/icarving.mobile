angular.module('icarving.controllers', [])

//View Controller
.controller('ViewCtrl', function($scope, $http, PickActivity, PickedActivity) {
	 $scope.items = [];
	 $scope.items1 = [];
	 $http.get('/icarving.api.pinche/activity/pick/findAll')
	 .success(function(newItems) {
		 $scope.items = newItems.response;
	 });
	 $http.get('/icarving.api.pinche/activity/picked/findAll')
	 .success(function(newItems) {
		 $scope.items1 = newItems.response;
	 });

	 $scope.doRefresh = function() {
		 $http.get('/icarving.api.pinche/activity/pick/findAll')
		 .success(function(newItems) {
			 $scope.items = newItems.response;
		 });
		  $http.get('/icarving.api.pinche/activity/picked/findAll')
		 .success(function(newItems) {
			 $scope.items1 = newItems.response;
		 })		  
		 .finally(function() {
		       $scope.$broadcast('scroll.refreshComplete');
		});
     }
})

//View Pick Activity Detail Controller
.controller('ViewPickDetailCtrl', function($scope, $stateParams, PickActivity) {
	$scope.pick = PickActivity.get($stateParams.pickId);
})

//View Picked Activity Detail Controller
.controller('ViewPickedDetailCtrl', function($scope, $stateParams, PickedActivity) {
	$scope.picked = PickedActivity.get($stateParams.pickedId);
})

//Pick Activity Controller
.controller('PickCtrl', function($scope, $http) {
	$scope.model = {};
	$scope.publishPickActivity = function(){
		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/pick/create', payload).
		  success(function(data, status, headers, config) {
			  alert("捡人活动发布成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动发布失败");
		  });
	}
})

//Picked Activity Controller
.controller('PickedCtrl', function($scope, $http) {
	$scope.model = {};
	$scope.publishPickedActivity = function(){
		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/picked/create', payload).
		  success(function(data, status, headers, config) {
			  alert("求捡活动发布成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动发布失败");
		  });
	}
})

//My Activity/Apply Controller
.controller('MyCtrl', function($scope, $http, MyPickActivity, MyPickedActivity, MyPickActivityApply, MyPickedActivityApply) {
	 $scope.items = [];
	 $scope.items1 = [];
	 $scope.items2 = [];
	 $scope.items3 = [];
	 $http.get('/icarving.api.pinche/activity/pick/findByUser?uid='+uid)
	 .success(function(newItems) {
		 $scope.items = newItems.response;
	 });
	 $http.get('/icarving.api.pinche/activity/picked/findByUser?uid='+uid)
	 .success(function(newItems) {
		 $scope.items1 = newItems.response;
	 });
	 $http.get('/icarving.api.pinche/apply/pick/findByUser?uid='+uid)
	 .success(function(newItems) {
		 $scope.items2 = newItems.response;
	 });
	 $http.get('/icarving.api.pinche/apply/picked/findByUser?uid='+uid)
	 .success(function(newItems) {
		 $scope.items3 = newItems.response;
	 });
	 
	  $scope.doRefresh = function() {
			 $http.get('/icarving.api.pinche/activity/pick/findByUser?uid='+uid)
			 .success(function(newItems) {
				 $scope.items = newItems.response;
			 });
			  $http.get('/icarving.api.pinche/activity/picked/findByUser?uid='+uid)
			 .success(function(newItems) {
				 $scope.items1 = newItems.response;
			 });
			 $http.get('/icarving.api.pinche/apply/pick/findByUser?uid='+uid)
			 .success(function(newItems) {
				 $scope.items2 = newItems.response;
			 });
			 $http.get('/icarving.api.pinche/apply/picked/findByUser?uid='+uid)
			 .success(function(newItems) {
				 $scope.items3 = newItems.response;
			 })			  
			 .finally(function() {
			       $scope.$broadcast('scroll.refreshComplete');
			});
      }
	
})

//My Pick Activity Detail Controller
.controller('MyPickDetailCtrl', function($scope, $http, $stateParams, MyPickActivity) {
	$scope.pick = MyPickActivity.get($stateParams.pickId);

    $scope.updatePickActivity = function(){
		var payload = {"pickActivityId":$scope.pick.pickActivityId,"startTime":$scope.pick.startTime,"returnTime":$scope.pick.returnTime,"sourceAddress":$scope.pick.sourceAddress,"destAddress":$scope.pick.destAddress,"charge":$scope.pick.charge,"carType":$scope.pick.carType,"note":$scope.pick.note};
		$http.post('/icarving.api.pinche/activity/pick/update', payload).
		  success(function(data, status, headers, config) {
			  alert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动更新失败");
		  });
    }
    
})

//My Picked Activity Detail Controller
.controller('MyPickedDetailCtrl', function($scope, $http, $stateParams, MyPickedActivity) {
	$scope.picked = MyPickedActivity.get($stateParams.pickedId);
	
    $scope.updatePickedActivity = function(){
		var payload = {"pickedActivityId":$scope.picked.pickedActivityId,"startTime":$scope.picked.startTime,"returnTime":$scope.picked.returnTime,"sourceAddress":$scope.picked.sourceAddress,"destAddress":$scope.picked.destAddress,"charge":$scope.picked.charge,"carType":$scope.picked.carType,"note":$scope.picked.note};
		$http.post('/icarving.api.pinche/activity/picked/update', payload).
		  success(function(data, status, headers, config) {
			  alert("求捡活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动更新失败");
		  });
    }
})

//My Pick Activity Apply Detail Controller
.controller('MyPickApplyDetailCtrl', function($scope, $stateParams, MyPickActivityApply) {
	$scope.pickApply = MyPickActivityApply.get($stateParams.pickApplyId);
})

//My Picked Activity Apply Detail Controller
.controller('MyPickedApplyDetailCtrl', function($scope, $stateParams, MyPickedActivityApply) {
	$scope.pickedApply = MyPickedActivityApply.get($stateParams.pickedApplyId);
});