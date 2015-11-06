function insertData(data){
	$('table> tbody> tr').remove();
	
	$.each(data,function(){
		if(this['state'] == 'closed'){
			var $lock = '<i onclick="door(\'open\','+ this['id'] + ')" class="small material-icons">lock_open</i>';
		} else {
			var $lock = '<i onclick="door(\'close\','+ this['id'] + ')" class="small material-icons">lock_outline</i>';
		}
	
		 var $row = $('<tr>'+
    '<td>'+this['id']+'</td>'+
    '<td>'+this['name']+'</td>'+
    '<td>'+this['state']+'</td>'+
    '<td><i class="small material-icons">videocam</i>'+$lock+'<i onclick="openEditDevice('+this['id']+')" class="small material-icons">info_outline</i></td>'+
    '<td><div style="width:15px; height:15px; background:#f44336; border-radius:7.5px;"></div></td>'+
    '</tr>');

		$('table> tbody').append($row);
	});
}

function door(action, id) {
	if(action != null || (action == 'open' || action == 'close')) {
		if(id != null){
			$.get('/device/'+action, {id: id}, function(res){
				console.log(res)
			});
			Materialize.toast('Success', 4000)
		} else {
			Materialize.toast('Id inconnu', 4000)
		}
	} else {
		Materialize.toast('Action inconnu ', 4000)
	}
}

io.socket.on('connect', function(){
	console.log("Connected...");
	
	io.socket.get('/socket/devices/subscribe');
	
	io.socket.on("device", function(data){
			
		switch(data.verb) {
	    case 'created':
	        console.log('Switch error')
	        break;
	    case 'destroyed':
	        $.get( "/user/getDevicesByUser", function(data) {
						insertData(data[0].deviceList)
					});
	        break;
	    case 'removedFrom':
	        console.log('Switch error')
	        break;
	    case 'updated':
	        $.get( "/user/getDevicesByUser", function(data) {
						insertData(data[0].deviceList)
					});
	        break;
	    default:
	        console.log('Switch error');
		}
	});
	
	// Get all devices
	$.get( "/user/getDevicesByUser", function(data) {
		insertData(data[0].deviceList);
	});
});
