var uid = 0; // Initialize to 0, it means no body registered/logged in.

angular.module('icarving', ['ionic', 'icarving.controllers', 'icarving.services'])

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
})

.config(function($ionicConfigProvider) {
	$ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
	$ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.view', {
    url: '/view',
    views: {
      'tab-view': {
        templateUrl: 'templates/tab-view.html',
        controller: 'ViewCtrl'
      }
    }
   })
  
  .state('tab.view-pick-detail', {
      url: '/view/pickdetail/:pickId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-pick-detail.html',
          controller: 'ViewPickDetailCtrl'
        }
      }
    })
    
   .state('tab.view-picked-detail', {
      url: '/view/pickeddetail/:pickedId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-picked-detail.html',
          controller: 'ViewPickedDetailCtrl'
        }
      }
    })

  .state('tab.pick', {
      url: '/pick',
      views: {
        'tab-pick': {
          templateUrl: 'templates/tab-pick.html',
          controller: 'PickCtrl'
        }
      }
    })

  .state('tab.picked', {
      url: '/picked',
      views: {
        'tab-picked': {
          templateUrl: 'templates/tab-picked.html',
          controller: 'PickedCtrl'
        }
      }
    })

   .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'templates/tab-my.html',
        controller: 'MyCtrl'
      }
    }
   })
  
   .state('tab.my-pick-detail', {
      url: '/my/pickdetail/:pickId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-pick-detail.html',
          controller: 'MyPickDetailCtrl'
        }
      }
    })
    
   .state('tab.my-picked-detail', {
      url: '/my/pickeddetail/:pickedId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-picked-detail.html',
          controller: 'MyPickedDetailCtrl'
        }
      }
    })
    
   .state('tab.my-pick-apply-detail', {
      url: '/my/pickapplydetail/:pickApplyId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-pick-apply-detail.html',
          controller: 'MyPickApplyDetailCtrl'
        }
      }
    })
    
   .state('tab.my-picked-apply-detail', {
      url: '/my/pickedapplydetail/:pickedApplyId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-picked-apply-detail.html',
          controller: 'MyPickedApplyDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/view');

});






