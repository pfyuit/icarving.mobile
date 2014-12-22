angular.module('icarving.services', [])

.factory('PickActivity', function($http) {
	var pickActivities = [];
	
	$http.get('/icarving.api.pinche/activity/pick/findAll')
	.success(function(newItems) {
	  pickActivities = newItems.response;
	});
 
  return {
    all: function() {
      return pickActivities;
    },

    get: function(pickActivityId) {
      for (var i = 0; i < pickActivities.length; i++) {
        if (pickActivities[i].pickActivityId === parseInt(pickActivityId)) {
          return pickActivities[i];
        }
      }
      return null;
    }
    
  }
})

.factory('PickedActivity', function($http) {
	var pickedActivities = [];
	
	$http.get('/icarving.api.pinche/activity/picked/findAll')
	.success(function(newItems) {
	  pickedActivities = newItems.response;
	});
 
  return {
    all: function() {
      return pickedActivities;
    },

    get: function(pickedActivityId) {
      for (var i = 0; i < pickedActivities.length; i++) {
        if (pickedActivities[i].pickedActivityId === parseInt(pickedActivityId)) {
          return pickedActivities[i];
        }
      }
      return null;
    }
    
  }
})

.factory('MyPickActivity', function($http) {
	var pickActivities = [];
	
	$http.get('/icarving.api.pinche/activity/pick/findByUser?uid='+uid)
	.success(function(newItems) {
	  pickActivities = newItems.response;
	});
 
  return {
    all: function() {
      return pickActivities;
    },

    get: function(pickActivityId) {
      for (var i = 0; i < pickActivities.length; i++) {
        if (pickActivities[i].pickActivityId === parseInt(pickActivityId)) {
          return pickActivities[i];
        }
      }
      return null;
    }
    
  }
})

.factory('MyPickedActivity', function($http) {
	var pickedActivities = [];
	
	$http.get('/icarving.api.pinche/activity/picked/findByUser?uid='+uid)
	.success(function(newItems) {
	  pickedActivities = newItems.response;
	});
 
  return {
    all: function() {
      return pickedActivities;
    },

    get: function(pickedActivityId) {
      for (var i = 0; i < pickedActivities.length; i++) {
        if (pickedActivities[i].pickedActivityId === parseInt(pickedActivityId)) {
          return pickedActivities[i];
        }
      }
      return null;
    }
    
  }
})

.factory('MyPickActivityApply', function($http) {
	var pickActivityApply = [];
	
	$http.get('/icarving.api.pinche/apply/pick/findByUser?uid='+uid)
	.success(function(newItems) {
		pickActivityApply = newItems.response;
	});
 
  return {
    all: function() {
      return pickActivityApply;
    },

    get: function(pickActivityApplyId) {
      for (var i = 0; i < pickActivityApply.length; i++) {
        if (pickActivityApply[i].pickActivityApplyId === parseInt(pickActivityApplyId)) {
          return pickActivityApply[i];
        }
      }
      return null;
    }
    
  }
})

.factory('MyPickedActivityApply', function($http) {
	var pickedActivityApply = [];
	
	$http.get('/icarving.api.pinche/apply/picked/findByUser?uid='+uid)
	.success(function(newItems) {
		pickedActivityApply = newItems.response;
	});
 
  return {
    all: function() {
      return pickedActivityApply;
    },

    get: function(pickedActivityApplyId) {
      for (var i = 0; i < pickedActivityApply.length; i++) {
        if (pickedActivityApply[i].pickedActivityApplyId === parseInt(pickedActivityApplyId)) {
          return pickedActivityApply[i];
        }
      }
      return null;
    }
    
  }
});
