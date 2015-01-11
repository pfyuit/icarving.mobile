angular.module('icarving.services', [])

.factory('UserService', function() { 
	  return {	  
	    getUid: function() {
	    	var cookieUid = "";
	    	
	    	var strcookie=document.cookie;
	    	var arrcookie=strcookie.split("; ");
	    	for(var i=0;i<arrcookie.length;i++){
	    		var arr=arrcookie[i].split("=");
	    		if(arr[0]=='uid'){
	    			cookieUid =  arr[1];
	    		}
	    	}
	    	
	    	return cookieUid;
	    },
	    
	    getUsername: function() {
	    	var username = "";
	    	
	    	var strcookie=document.cookie;
	    	var arrcookie=strcookie.split("; ");
	    	for(var i=0;i<arrcookie.length;i++){
	    		var arr=arrcookie[i].split("=");
	    		if(arr[0]=='username'){
	    			username =  arr[1];
	    		}
	    	}
	    	
	    	return username;
	    },
	    
	    getPassword: function(modal) {
	    	var password = "";
	    	
	    	var strcookie=document.cookie;
	    	var arrcookie=strcookie.split("; ");
	    	for(var i=0;i<arrcookie.length;i++){
	    		var arr=arrcookie[i].split("=");
	    		if(arr[0]=='password'){
	    			password =  arr[1];
	    		}
	    	}
	    	
	    	return password;
	    }
	    
	  }
  })
  
.factory('Activity', function($http) { 
  var activities = [];
  return {	  
    all: function() {
    	return $http.get('/icarving.api.pinche/activity/findAll');
    },
    
  	get: function(activityId) {
      for (var i = 0; i < activities.length; i++) {
        if (activities[i].activityId === parseInt(activityId)) {
          return activities[i];
        }
      }
      return null;
   },
   
   save: function(data){
	   activities = data;
   }
    
  }
})

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

.factory('MyMessage', function($http) { 
  var myMessages = [];
  return {	  
    all: function() {
    	return $http.get('/icarving.api.pinche/message/'+uid+'/all');
    },
    
  	get: function(msgId) {
      for (var i = 0; i < myMessages.length; i++) {
        if (myMessages[i].userMessageId === parseInt(msgId)) {
          return myMessages[i];
        }
      }
      return null;
   },
   
   save: function(data){
	   myMessages = data;
   }
    
  }
})

.factory('MyActivity', function($http) {
  var activities = [];
  return {
    all: function() {
      return $http.get('/icarving.api.pinche/activity/findMy?uid='+uid);
    },

    get: function(activityId) {
      for (var i = 0; i < activities.length; i++) {
        if (activities[i].activityId === parseInt(activityId)) {
          return activities[i];
        }
      }
      return null;
    },
    
    save: function(data){
    	activities = data;
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
})

.factory('ActivityApply', function($http) {
  var applies = []; 
  return {
    all: function(activityId) {
      return $http.get('/icarving.api.pinche/apply/findByActivity?activityId='+activityId);
    },

    get: function(applyId) {
      for (var i = 0; i < applies.length; i++) {
        if (applies[i].applyId === parseInt(applyId)) {
          return applies[i];
        }
      }
      return null;
    },
    
    save: function(data){
    	applies = data;
    } 
    
  }
})

.factory('MyPickActivityPeopleApply', function($http) {
  var pickActivityApply = []; 
  return {
    all: function(pickActivityId) {
      return $http.get('/icarving.api.pinche/apply/pick/findByPickActivity?pickActivityId='+pickActivityId);
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

.factory('MyPickedActivityPeopleApply', function($http) {
  var pickedActivityApply = []; 
  return {
    all: function(pickedActivityId) {
      return $http.get('/icarving.api.pinche/apply/picked/findByPickedActivity?pickedActivityId='+pickedActivityId);
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
})

.factory('SearchActivity', function($http) {
  var activities = []; 
  return {
    all: function(sourceAddress, destAddress, startTime, returnTime) {
      var payload = {"startTime":startTime,"returnTime":returnTime,"sourceAddress":sourceAddress,"destAddress":destAddress};	
      return $http.post('/icarving.api.pinche/search/activity', payload);
    },
    
    save: function(data){
    	activities = data;
    }     
  }
})

.factory('SearchPickedActivity', function($http) {
  var pickedActivities = []; 
  return {
    all: function(sourceAddress, destAddress, startTime, returnTime) {
      var payload = {"startTime":startTime,"returnTime":returnTime,"sourceAddress":sourceAddress,"destAddress":destAddress};	
      return $http.post('/icarving.api.pinche/search/pickedActivity', payload);
    },
    
    save: function(data){
    	pickedActivities = data;
    } 
    
  }
});
