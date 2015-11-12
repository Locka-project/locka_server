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
    '<td>'+this['lock']['identifier']+'</td>'+
    '<td>'+this['state']+'</td>'+
    '<td><i class="small material-icons">videocam</i>'+$lock+'<i onclick="openEditDevice('+this['id']+',\''+this['name']+'\')" class="small material-icons">info_outline</i></td>'+
    '<td><div style="width:15px; height:15px; background:#f44336; border-radius:7.5px;"></div></td>'+
    '</tr>');

		$('.dashboard> tbody').append($row);
	});
$('#deviceListData').DataTable();
}

function insertDataLog(data){
	$('.logs > tbody> tr').remove();

	$.each(data,function(i){
		// Format Date
		var date = moment(data[i]['updatedAt']).format("DD/MM/YYYY HH:mm"); ;

		var $row = $('<tr>'+
			'<td>'+data[i]['user']['username']+'</td>'+
			'<td>'+data[i]['device']['name']+'</td>'+
			'<td>'+data[i]['type']+'</td>'+
			'<td>'+data[i]['description']+'</td>'+
			'<td>'+date+'</td>'+
			'</tr>');

		$('.logs > tbody').append($row);
	});
	$('#logListData').DataTable();
}

function door(action, id) {
	if(action != null || (action == 'open' || action == 'close')) {
		if(id != null){
			$.get('/device/'+action, {id: id});
		} else {
			Materialize.toast('Id inconnu', 4000)
		}
	} else {
		Materialize.toast('Action inconnu ', 4000)
	}
}

// Get all logs and devices
function getAllDataForDashboard(){
	$.get("/user/getDevicesByUser", function(data) {

		var promises = [];
		var array = data;

		$.each(data,function(i){
			var promise = $.get( "/lock/"+data[i]['identifier']).done(function(lock){array[i]['lock'] = lock});
			promises.push(promise);
		});

		$.when.apply($, promises).done(function() {
			insertDataDashboard(array.sort(function(a,b) {
				if(a.createdAt > b.createdAt){
					return -1
				}
				if(a.createdAt < b.createdAt){
					return 1
				}
				return 0
				})
			);
	  });
	});
}

function getAllDataLogs(){
	$.get( '/device/logs').done(function(logs) {
		insertDataLog(logs.sort(function(a,b) {
			if(a.createdAt > b.createdAt){
				return -1
			}
			if(a.createdAt < b.createdAt){
				return 1
			}
			return 0
			})
		);
	});
}

// Socket IO //
io.socket.on('connect', function(){
	console.log("Connected...");

	io.socket.get('/socket/devices/subscribe');
	io.socket.get('/socket/users/logs');

	io.socket.on("device", function(data){
		switch(data.verb) {
	    case 'created':
	        getAllDataForDashboard();
	        break;
	    case 'destroyed':
	       	getAllDataForDashboard();
	        break;
	    case 'removedFrom':
	        console.log('Switch error')
	        break;
	    case 'updated':
	        getAllDataForDashboard();
	        break;
	    default:
	        console.log('Switch error');
		}
	});
	// Get All data
	getAllDataForDashboard();
	getAllDataLogs();

});
