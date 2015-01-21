angular.module('icarving.services', [])

.factory('User', function($http) {
  var user = {};
  var getCookie =  function(name) {
  	var cookie = "";	    	
	var strcookie = document.cookie;
	var arrcookie = strcookie.split("; ");
	for(var i = 0; i < arrcookie.length; i++){
		var arr = arrcookie[i].split("=");
		if(arr[0] == name){
			cookie =  arr[1];
		}
	}	    	
	return cookie;
  };
  
  return {
	fetchUser: function(){
		return $http.get('/icarving.api.pinche/user/info?uid='+uid);
	},
	updateUser: function(payload){
		return $http.post('/icarving.api.pinche/user/update', payload);
	},
	verifyInvitation: function(code){
		return $http.get('/icarving.api.pinche/invitation/verify?code='+code);
	},
    getUid: function() {
    	if(uid != 0){
    		return uid;
    	}
    	return getCookie("uid");
    },    
    getUsername: function() {
    	return getCookie("username");
    },    
    getPassword: function() {	
    	return getCookie("password");
    },
    getUser: function(){
    	return user;
    },
    getInvitationStatus: function(){
    	if(invitation == "verified"){
    		return invitation;
    	}
    	var result = getCookie("invitation");
    	if(result != ""){
    		invitation = result;
    	}
    	return result;
    },
    saveUser: function(_user){
    	user = _user;
    }
   }
 })

.factory('Activity', function($http, Apply) { 
  var activities = [];  
  return {	  
    fetchAllValid: function() {
    	return $http.get('/icarving.api.pinche/activity/findAllValid');
    },   
    fetchAllByOwnerId: function() {
        return $http.get('/icarving.api.pinche/activity/findAllMy?uid='+uid);
    }, 
    fetchByActivityId: function(activityId){
    	return $http.get('/icarving.api.pinche/activity/findByActivityId?activityId='+activityId);
    },
    createActivity: function(payload){
    	return $http.post('/icarving.api.pinche/activity/create', payload);
    },
    updateActivity: function(payload){
    	return $http.post('/icarving.api.pinche/activity/update', payload);
    },
    cancelActivity: function(activityId){
    	return $http.get('/icarving.api.pinche/activity/cancel?uid='+uid+'&activityId='+activityId);
    },
    getByActivityId: function(activityId) {
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].activityId === parseInt(activityId)) {
              return activities[i];
            }
        }
        return null;
    },  
    getAllValid: function() {
    	var result = [];
    	for(var i = 0; i < activities.length; i++ ){
    		if(activities[i].status == '有效'){
    			result.push(activities[i]);
    		}
    	}
    	return result;
    },   
    getAllByOwnerId: function(ownerId) {
    	var result = [];
    	for(var i = 0; i < activities.length; i++ ){
			var hasApplied = false;
    		var applies = Apply.getAllByActivityId(activities[i].activityId);
			for (var j = 0; j < applies.length; j ++) {
				if (applies[j].ownerId == ownerId) {
					hasApplied = true;
					break;
				}
			}	
    		if(activities[i].ownerId == parseInt(ownerId) || hasApplied){
    			result.push(activities[i]);
    		}
    	}
    	return result;
    },   
    saveOrUpdate: function(_activity){ 	   
 	   var temp = null;
       for (var j = 0; j < activities.length; j++) {
          if (activities[j].activityId == _activity.activityId) {
        	  	temp = activities[j];
				activities[j] =  _activity;
          }
	   }	   
	   if(temp == null){
		   activities.push(_activity);
	   }
    },    
    saveOrUpdateAll: function(_activities){
	   for(var i = 0; i < _activities.length; i++){
		   var temp = null;		   
	       for (var j = 0; j < activities.length; j++) {
	          if (activities[j].activityId == _activities[i].activityId) {
	        	  	temp = activities[j];
					activities[j] =  _activities[i];
	          }
	       }	       
		   if(temp == null){
			   activities.push( _activities[i]);
		   }		   
	   }
    }    
  }
})

.factory('Search', function($http) {
  var activities = []; 
  return {
    search: function(sourceAddress, destAddress, startTime, returnTime) {
      var payload = {"startTime":startTime,"returnTime":returnTime,"sourceAddress":sourceAddress,"destAddress":destAddress};	
      return $http.post('/icarving.api.pinche/search/activity', payload);
    },    
    save: function(data){
    	activities = data;
    }     
  }
})

.factory('Apply', function($http) {
  var applies = []; 
  return {
    fetchAllByActivityId: function(activityId) {
        return $http.get('/icarving.api.pinche/apply/findByActivityId?activityId='+activityId);
    },
    fetchByApplyId: function(applyId){
    	return $http.get('/icarving.api.pinche/apply/findByApplyId?applyId='+applyId);
    },
    createApply: function(payload) {
    	return $http.post('/icarving.api.pinche/apply/create', payload);
    }, 
    approveApply: function(applyId){
    	return $http.get('/icarving.api.pinche/apply/approve?applyId='+applyId);
    },
    unapproveApply: function(applyId){
    	return $http.get('/icarving.api.pinche/apply/unapprove?applyId='+applyId);
    },
    cancelApply: function(applyId){
    	return $http.get('/icarving.api.pinche/apply/cancel?uid='+uid+'&applyId='+applyId);
    },
    renewApply: function(applyId){
    	return $http.get('/icarving.api.pinche/apply/renew?applyId='+applyId);	
    },
    getByApplyId: function(applyId) {
        for (var i = 0; i < applies.length; i++) {
            if (applies[i].applyId === parseInt(applyId)) {
              return applies[i];
            }
        }
        return null;
    },    
    getAllByActivityId: function(activityId) {
    	var result = [];
        for (var i = 0; i < applies.length; i++) {
            if (applies[i].activityId === parseInt(activityId)) {
            	result.push(applies[i]);
            }
          }
        return result;
    },    
    getAllByOwnerId: function(ownerId) {
    	var result = [];
        for (var i = 0; i < applies.length; i++) {
            if (applies[i].ownerId === parseInt(ownerId)) {
            	result.push(applies[i]);
            }
          }
        return result;
    },   
    saveOrUpdate: function(_apply){
 	   var temp = null;
       for (var j = 0; j < applies.length; j++) {
           if (applies[j].applyId == _apply.applyId) {
         	  	temp = applies[j];
         	  	applies[j] =  _apply;
           }
 	   }	   
 	   if(temp == null){
 		  applies.push(_apply);
 	   }
    },      
    saveOrUpdateAll: function(_applies){
 	   for(var i = 0; i < _applies.length; i++){
 	 	   var temp = null;
 	       for (var j = 0; j < applies.length; j++) {
 	           if (applies[j].applyId == _applies[i].applyId) {
 	         	  	temp = applies[j];
 	         	  	applies[j] =  _applies[i];
 	           }
 	 	   }	   
 	 	   if(temp == null){
 	 		  applies.push(_applies[i]);
 	 	   }
 	   }
    } 
  }
})

.factory('Message', function($http) { 
  var messages = [];  
  return {	  
	fetchAllByActivityId: function(activityId){
		return $http.get('/icarving.api.pinche/message/'+activityId+'/allmessage');
	},  	  
    fetchAllByOwnerId: function() {
    	return $http.get('/icarving.api.pinche/message/'+uid+'/all');
    }, 
    sendMessage: function(payload){
    	return $http.post('/icarving.api.pinche/message/send', payload);
    },
    readMessage: function(messageId){
    	return $http.get('/icarving.api.pinche/message/read?msgId='+messageId);
    },
  	getByMessageId: function(messageId) {
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].messageId === parseInt(messageId)) {
              return messages[i];
            }
          }
        return null;
    },
  	getAllMessageByActivityId: function(activityId){
  		var result = [];
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].activityId === parseInt(activityId) && messages[i].messageType == 2) {
            	result.push(messages[i]);
            }
          }
        return result;
  	},
  	getAllNotifyByOwnerId: function(ownerId){
  		var result = [];
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].toUid === parseInt(ownerId) && messages[i].messageType == 1) {
            	result.push(messages[i]);
            }
          }
        return result;
  	},
  	getAllMessageByOwnerId: function(ownerId){
  		var result = [];
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].toUid === parseInt(ownerId) && messages[i].messageType == 2) {
            	result.push(messages[i]);
            }
          }
        return result;
  	},
    saveOrUpdate:  function(_message){
 	   var temp = null;
       for (var j = 0; j < messages.length; j++) {
           if (messages[j].messageId == _message.messageId) {
         	  	temp = messages[j];
         	  	messages[j] =  _message;
           }
 	   }	   
 	   if(temp == null){
 		  messages.push(_message);
 	   }
    },      
    saveOrUpdateAll: function(_messages){
 	   for(var i = 0; i < _messages.length; i++){
 	 	   var temp = null;
 	       for (var j = 0; j < messages.length; j++) {
 	           if (messages[j].messageId == _messages[i].messageId) {
 	         	  	temp = messages[j];
 	         	  	messages[j] =  _messages[i];
 	           }
 	 	   }	   
 	 	   if(temp == null){
 	 		  messages.push(_messages[i]);
 	 	   }
 	   }
    } 
  }
});

