var socket = io.sails.connect();

socket.on('connect', function(){
	console.log("Connected...");
	
	io.socket.on("device", function(event){console.log(event);});
	
	io.socket.get('/device/subscribe', function (resData) {
 		console.log(resData);

 		$.each(resData[0]['deviceList'],function(){
	 		if(this['state'] == 'closed'){
		 		var $lock = 'lock_outline';
	 		} else {
		 		var $lock = 'lock_open';
	 		}

	 		 var $row = $('<tr>'+
      '<td>'+this['id']+'</td>'+
      '<td>'+this['name']+'</td>'+
      '<td>'+this['state']+'</td>'+
      '<td><i class="small material-icons">videocam</i><i class="small material-icons">'+$lock+'</i><i onclick="openEditDevice('+this['id']+')" class="small material-icons">info_outline</i></td>'+
      '<td><div style="width:15px; height:15px; background:#f44336; border-radius:7.5px;"></div></td>'+
      '</tr>');

			$('table> tbody').append($row);
 		});
	});
});
