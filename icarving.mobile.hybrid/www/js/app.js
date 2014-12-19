var uid = 8;

angular.module('icarving', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


angular.module('icarving', ['ionic'])

//Root Controller
.controller('RootCtrl', function($scope) {
  $scope.onControllerChanged = function(oldController, oldIndex, newController, newIndex) {
    console.log('Controller changed', oldController, oldIndex, newController, newIndex);
    console.log(arguments);
  };
})

//Search Controller
.controller('SearchCtrl', function($scope, $http, $ionicPopover) {
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
.controller('MyCtrl', function($scope, $http) {
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
	
});




