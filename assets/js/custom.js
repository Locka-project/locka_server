function insertDataDashboard(data){
	$('.dashboard tbody> tr').remove();

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

		$('.dashboard> tbody').append($row);
	});
}

function insertDataLog(data){
	$('.logs > tbody> tr').remove();

	$.each(data,function(i){
		$.get( "/user/"+this[0]["user_id"],function(userFound){
			var $row = $('<tr>'+
		 '<td>'+userFound[0]['username']+'</td>'+
		 '<td>'+data[i][0]['device_id']+'</td>'+
		 '<td>'+data[i][0]['type']+'</td>'+
		'<td>'+data[i][0]['description']+'</td>'+
		'<td>'+data[i][0]['updatedAt']+'</td>'+
		 '</tr>');

		$('.logs > tbody').append($row);
		});
	});
}

function door(action, id) {
	if(action != null || (action == 'open' || action == 'close')) {
		if(id != null){
			$.get('/device/'+action, {id: id}, function(res){
				console.log('res', res)
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
						insertDataDashboard(data[0].deviceList)
					});
	        break;
	    case 'removedFrom':
	        console.log('Switch error')
	        break;
	    case 'updated':
	        $.get( "/user/getDevicesByUser", function(data) {
						insertDataDashboard(data[0].deviceList)
					});
	        break;
	    default:
	        console.log('Switch error');
		}
	});

	// Get all devices
	$.get( "/user/getDevicesByUser", function(data) {
		insertDataDashboard(data[0].deviceList);
	});
	// Get all logs
	$.get( "/user/getDevicesByUser", function(data) {
		var logList = [];
		var promises = [];
		$.each(data[0].deviceList,function(){
			var promise = $.get( "/user/logs/device/"+this['id']).done(function(log) {
				logList.push(log);
			});
			promises.push(promise);
		});

		$.when.apply($, promises).done(function() {
			insertDataLog(logList);
	  });
	});
});
