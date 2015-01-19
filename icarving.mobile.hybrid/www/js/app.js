var uid = 0; // Initialize to 0, it means no body registered/logged in.
var appid = "wxe0a065ca64369148";

// Change them in online environment
var admin_uid = 1;
var admin_name = "小冰";
var admin_feedback_activity_id = 1;
var admin_feedback_activity_source_address = "";
var admin_feedback_activity_dest_address = "";

angular.module('icarving', ['ionic', 'icarving.viewcontrollers', 'icarving.pickcontrollers', 'icarving.pickedcontrollers', 'icarving.mycontrollers', 'icarving.services', 'ui.bootstrap.datetimepicker'])

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
	$ionicConfigProvider.views.maxCache(0);//Disable navigation cache to make the data refresh real-time
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html?v=1.6"
  })

   // View Tab
  .state('tab.view', {
    url: '/view',
    views: {
      'tab-view': {
        templateUrl: 'templates/tab-view.html?v=1.6',
        controller: 'ViewCtrl'
      }
    }
   })
   
    //  View Tab - Search Form
   .state('tab.view-search-form', {
    url: '/view/searchform',
    views: {
      'tab-view': {
        templateUrl: 'templates/view-search-form.html?v=1.6',
        controller: 'ViewSearchFormCtrl'
      }
    }
   })
   
    //  View Tab - Search Activity List 
   .state('tab.view-search-activity-list', {
    url: '/view/searchactivitylist/:sourceAddress/:destAddress/:startTime/:returnTime',
    views: {
      'tab-view': {
        templateUrl: 'templates/view-search-activity-list.html?v=1.6',
        controller: 'ViewSearchActivityListCtrl'
      }
    }
   })
   
   //  View Tab - Activity Detail
  .state('tab.view-activity-detail', {
      url: '/view/activitydetail/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail.html?v=1.6',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })
       
   //  View Tab - Activity Detail Update
  .state('tab.view-activity-detail-update', {
      url: '/view/activitydetailupdate/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail-update.html?v=1.6',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })
    
   //  View Tab - Activity Detail Apply
  .state('tab.view-activity-detail-apply', {
      url: '/view/activitydetailapply/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail-apply.html?v=1.6',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })
  
  // Pick Tab
  .state('tab.pick', {
      url: '/pick',
      views: {
        'tab-pick': {
          templateUrl: 'templates/tab-pick.html?v=1.6',
          controller: 'PickCtrl'
        }
      }
    })

    
  // Picked Tab  
  .state('tab.picked', {
      url: '/picked',
      views: {
        'tab-picked': {
          templateUrl: 'templates/tab-picked.html?v=1.6',
          controller: 'PickedCtrl'
        }
      }
    })

    
   // My Tab
   .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'templates/tab-my.html?v=1.6',
        controller: 'MyCtrl'
      }
    }
   })
   
   //  My Tab - Activity Detail    
  .state('tab.my-activity-detail', {
      url: '/my/activitydetail/:activityId/:messageId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-activity-detail.html?v=1.6',
          controller: 'MyActivityDetailCtrl'
        }
      }
    })
        
   //  My Tab - Activity Detail Update
  .state('tab.my-activity-detail-update', {
      url: '/my/activitydetailupdate/:activityId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-activity-detail-update.html?v=1.6',
          controller: 'MyActivityDetailCtrl'
        }
      }
    })
    
   //  My Tab - Activity Detail Apply
  .state('tab.my-activity-detail-apply', {
      url: '/my/activitydetailapply/:activityId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-activity-detail-apply.html?v=1.6',
          controller: 'MyActivityDetailCtrl'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/view');

});






