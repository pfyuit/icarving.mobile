angular.module('icarving.services', [])

.factory('PickActivity', function($http) { 
  var pickActivities = [];
  return {	  
    all: function() {
    	return $http.get('/icarving.api.pinche/activity/pick/findAll');
    },
    
  	get: function(pickActivityId) {
      for (var i = 0; i < pickActivities.length; i++) {
        if (pickActivities[i].pickActivityId === parseInt(pickActivityId)) {
          return pickActivities[i];
        }
      }
      return null;
   },
   
   save: function(data){
	   pickActivities = data;
   }
    
  }
})

.factory('PickedActivity', function($http) { 
  var pickedActivities = [];
  return {
    all: function() {    	
      return $http.get('/icarving.api.pinche/activity/picked/findAll');
    },

  	get: function(pickedActivityId) {
        for (var i = 0; i < pickedActivities.length; i++) {
          if (pickedActivities[i].pickedActivityId === parseInt(pickedActivityId)) {
            return pickedActivities[i];
          }
        }
        return null;
     },
     
     save: function(data){
    	 pickedActivities = data;
     }
    
  }
})

.factory('MyPickActivity', function($http) {
  var pickActivities = [];
  return {
    all: function() {
      return $http.get('/icarving.api.pinche/activity/pick/findByUser?uid='+uid);
    },

    get: function(pickActivityId) {
      for (var i = 0; i < pickActivities.length; i++) {
        if (pickActivities[i].pickActivityId === parseInt(pickActivityId)) {
          return pickActivities[i];
        }
      }
      return null;
    },
    
    save: function(data){
       pickActivities = data;
    }
    
  }
})

.factory('MyPickedActivity', function($http) {
  var pickedActivities = []; 
  return {
    all: function() {
      return $http.get('/icarving.api.pinche/activity/picked/findByUser?uid='+uid);
    },

    get: function(pickedActivityId) {
      for (var i = 0; i < pickedActivities.length; i++) {
        if (pickedActivities[i].pickedActivityId === parseInt(pickedActivityId)) {
          return pickedActivities[i];
        }
      }
      return null;
    },
    
    save: function(data){
    	pickedActivities = data;
    } 
    
  }
})

.factory('MyPickActivityApply', function($http) {
  var pickActivityApply = [];
  return {
    all: function() {
      return $http.get('/icarving.api.pinche/apply/pick/findByUser?uid='+uid);
    },

    get: function(pickActivityApplyId) {
      for (var i = 0; i < pickActivityApply.length; i++) {
        if (pickActivityApply[i].pickActivityApplyId === parseInt(pickActivityApplyId)) {
          return pickActivityApply[i];
        }
      }
      return null;
    },
    
    save: function(data){
    	pickActivityApply = data;
    } 
    
  }
})

.factory('MyPickedActivityApply', function($http) {
  var pickedActivityApply = []; 
  return {
    all: function() {
      return $http.get('/icarving.api.pinche/apply/picked/findByUser?uid='+uid);
    },

    get: function(pickedActivityApplyId) {
      for (var i = 0; i < pickedActivityApply.length; i++) {
        if (pickedActivityApply[i].pickedActivityApplyId === parseInt(pickedActivityApplyId)) {
          return pickedActivityApply[i];
        }
      }
      return null;
    },
    
    save: function(data){
    	pickedActivityApply = data;
    } 
    
  }
});
