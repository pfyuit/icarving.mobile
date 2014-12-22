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
.controller('PickCtrl', function($scope) {
	$scope.publishPickActivity = function(){
		alert("pick");
	}
})

//Picked Activity Controller
.controller('PickedCtrl', function($scope) {
	$scope.publishPickedActivity = function(){
		alert("picked");
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
.controller('MyPickDetailCtrl', function($scope, $stateParams, MyPickActivity) {
	$scope.pick = MyPickActivity.get($stateParams.pickId);
})

//My Picked Activity Detail Controller
.controller('MyPickedDetailCtrl', function($scope, $stateParams, MyPickedActivity) {
	$scope.picked = MyPickedActivity.get($stateParams.pickedId);
})

//My Pick Activity Apply Detail Controller
.controller('MyPickApplyDetailCtrl', function($scope, $stateParams, MyPickActivityApply) {
	$scope.pickApply = MyPickActivityApply.get($stateParams.pickApplyId);
})

//My Picked Activity Apply Detail Controller
.controller('MyPickedApplyDetailCtrl', function($scope, $stateParams, MyPickedActivityApply) {
	$scope.pickedApply = MyPickedActivityApply.get($stateParams.pickedApplyId);
});