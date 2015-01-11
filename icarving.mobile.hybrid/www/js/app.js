var uid = 0; // Initialize to 0, it means no body registered/logged in.
var appid = "wxe0a065ca64369148"; // Initialize to 0, it means no app id set up.

angular.module('icarving', ['ionic', 'icarving.controllers', 'icarving.services', 'ui.bootstrap.datetimepicker'])

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
    templateUrl: "templates/tabs.html"
  })

   // View Tab
  .state('tab.view', {
    url: '/view',
    views: {
      'tab-view': {
        templateUrl: 'templates/tab-view.html',
        controller: 'ViewCtrl'
      }
    }
   })
   
    //  View Tab - Search
   .state('tab.view-search-form', {
    url: '/view/searchform',
    views: {
      'tab-view': {
        templateUrl: 'templates/view-search-form.html',
        controller: 'ViewSearchFormCtrl'
      }
    }
   })
   
   .state('tab.view-search-activity-list', {
    url: '/view/searchactivitylist/:sourceAddress/:destAddress/:startTime/:returnTime',
    views: {
      'tab-view': {
        templateUrl: 'templates/view-search-activity-list.html',
        controller: 'ViewSearchActivityListCtrl'
      }
    }
   })
   

   //  View Tab - Activity Detail
  .state('tab.view-activity-detail', {
      url: '/view/activitydetail/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail.html',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })
    
   //  View Tab - Activity Applies
  .state('tab.view-activity-detail-apply', {
      url: '/view/activitydetailapply/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail-apply.html',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })
    
   //  View Tab - Activity Detail Update
  .state('tab.view-activity-detail-update', {
      url: '/view/activitydetailupdate/:activityId',
      views: {
        'tab-view': {
          templateUrl: 'templates/view-activity-detail-update.html',
          controller: 'ViewActivityDetailCtrl'
        }
      }
    })

    
  // Pick Tab
  .state('tab.pick', {
      url: '/pick',
      views: {
        'tab-pick': {
          templateUrl: 'templates/tab-pick.html',
          controller: 'PickCtrl'
        }
      }
    })

    
  // Picked Tab  
  .state('tab.picked', {
      url: '/picked',
      views: {
        'tab-picked': {
          templateUrl: 'templates/tab-picked.html',
          controller: 'PickedCtrl'
        }
      }
    })

    
   // My Tab
   .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'templates/tab-my.html',
        controller: 'MyCtrl'
      }
    }
   })
   
   .state('tab.my-message-list', {
    url: '/my/messagelist',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-message-list.html',
        controller: 'MyMessageListCtrl'
      }
    }
   })
   
   .state('tab.my-message-detail', {
    url: '/my/messagedetail/:userMessageId',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-message-detail.html',
        controller: 'MyMessageDetailCtrl'
      }
    }
   })
   
  .state('tab.my-pick-list', {
    url: '/my/picklist',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-pick-list.html',
        controller: 'MyCtrl'
      }
    }
   })
   
   .state('tab.my-picked-list', {
    url: '/my/pickedlist',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-picked-list.html',
        controller: 'MyCtrl'
      }
    }
   })
   
   .state('tab.my-pick-apply-list', {
    url: '/my/pickapplylist',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-pick-apply-list.html',
        controller: 'MyCtrl'
      }
    }
   })
   
   .state('tab.my-picked-apply-list', {
    url: '/my/pickedapplylist',
    views: {
      'tab-my': {
        templateUrl: 'templates/my-picked-apply-list.html',
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
    })
    
    .state('tab.my-pick-people-apply-list', {
      url: '/my/pickpeopleapplylist/:pickActivityId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-pick-people-apply-list.html',
          controller: 'MyPickPeopleApplyListCtrl'
        }
      }
    })
    
    .state('tab.my-pick-people-apply-detail', {
      url: '/my/pickpeopleapplydetail/:pickActivityApplyId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-pick-people-apply-detail.html',
          controller: 'MyPickPeopleApplyDetailCtrl'
        }
      }
    })
    
    .state('tab.my-picked-people-apply-list', {
      url: '/my/pickedpeopleapplylist/:pickedActivityId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-picked-people-apply-list.html',
          controller: 'MyPickedPeopleApplyListCtrl'
        }
      }
    })
    
    .state('tab.my-picked-people-apply-detail', {
      url: '/my/pickedpeopleapplydetail/:pickedActivityApplyId',
      views: {
        'tab-my': {
          templateUrl: 'templates/my-picked-people-apply-detail.html',
          controller: 'MyPickedPeopleApplyDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/view');

});






