angular.module('myapp')
.component('entry',{
	controller:function(){
		var session=undefined;
		this.favorite=function(id,title,poster_path){
			//prepare object to send it to node server
			var obj={id:id,title:title,poster_path:poster_path};
			//checking for username
		    $.ajax({
              		async:false,
              		url: "http://127.0.0.1:8080/session",
              		cache: false,
              		dataType: 'json',
              		success: function(user){
              			session=user;
              		}
           	});
			console.log(session)
			if(session===undefined || session===null){
				alert('you are not allowed to add favorite')
			}else{
			  //make ajax request to server to add it to database 
			  $.ajax({
              url: "http://127.0.0.1:8080/add",
              type: "POST",
              data: obj,
              dataType: "html"
             });
             alert('added to favorite')
			}
			}
			
	},
    bindings:{
    	movie:'<'
    },
	templateUrl:'public/templates/entry.html'
});