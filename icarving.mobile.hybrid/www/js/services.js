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

.factory('ActivityApply', function($http) {
  var applies = []; 
  return {
    all: function(activityId) {
      return $http.get('/icarving.api.pinche/apply/findByActivity?activityId='+activityId);
    },
    
    fetch: function(uid) {
        for (var i = 0; i < applies.length; i++) {
            if (applies[i].ownerId === parseInt(uid)) {
              return applies[i];
            }
          }
          return null;
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
});

