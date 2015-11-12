function insertDataDashboard(data){
	$('.dashboard tbody> tr').remove();

	$.each(data,function(){
		if(this['state'] == 'closed'){
			var $lock = '<span title = "Open"><i onclick="door(\'open\','+ this['id'] + ')" class="small material-icons">lock_open</i></span>';
		} else {
			var $lock = '<span title = "Close"><i onclick="door(\'close\','+ this['id'] + ')" class="small material-icons">lock_outline</i></span>';
		}
		
		 var $row = $('<tr>'+
    '<td>'+this['id']+'</td>'+
    '<td>'+this['name']+'</td>'+
    '<td>'+this['lock']['identifier']+'</td>'+
    '<td>'+this['state']+'</td>'+
    '<td><span title = "Video"><i class="small material-icons">videocam</i></span>'+$lock+'<span title = "Informations"><i onclick="openEditDevice('+this['id']+',\''+this['name']+'\')" class="small material-icons">info_outline</i></span></td>'+
    '<td><div style="width:15px; height:15px; background:#f44336; border-radius:7.5px;"></div></td>'+
    '</tr>');

		$('.dashboard> tbody').append($row);
	});
}

function insertDataLog(data){
	$('.logs > tbody> tr').remove();

	$.each(data,function(i){
		// Format Date
		var date = moment(data[i]['updatedAt']).format("DD/MM/YYYY HH:mm");
		
		if(!data[i]['device']){
			var name = "deleted";		
		} else {
			var name = data[i]['device']['name'];
		}
		
		var $row = $('<tr>'+
			'<td>'+data[i]['user']['username']+'</td>'+
			'<td>'+name+'</td>'+
			'<td>'+data[i]['type']+'</td>'+
			'<td>'+data[i]['description']+'</td>'+
			'<td>'+date+'</td>'+
			'</tr>');
		
		$('.logs > tbody').append($row);
	});
}

// Notification center
function notification(type, text) {
	if(type != null && text != null){
		switch(type){
			case 'add':
				Materialize.toast('Add : ' + text, 4000);
				break;
			case 'update':
				Materialize.toast('Update : ' + text, 4000);
				break;
			case 'del':
				Materialize.toast('Delete : ' + text, 4000);
				break;
			case 'open':
				Materialize.toast(text, 4000);
				break;
			case 'close':
				Materialize.toast(text, 4000);
				break;
			default:
				Materialize.toast("Error : type isn't defined => " + type, 4000);
				break;
		}
	} else {
		Materialize.toast("Error, your notification is unkonwn by system", 4000)
	}
}

// Lock function
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

	// Subscribe events
	io.socket.get('/socket/devices/subscribe');
	io.socket.get('/socket/users/logs/subscribe');
	
	// Monitor device Model
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
	        notification('error', 'error switch');
		    	break;
		}
	});
	// Monitor log Model
	io.socket.on("log", function(data){
		log = data.data.log;
		switch(data.verb) {
	    case 'created':
	    		switch(log.type){
		    		case 'Create':
		    			notification('add', log.description);
		    			break;   
		    		case 'Update':
		    			notification('update', log.description);
		    			break;
		    		case 'Delete':
		    			notification('del', log.description);
		    			break;   
		    		case 'Open':
		    			notification('open', log.description);
		    			break;   
		    		case 'Close':
		    			notification('close', log.description);
		    			break;
		    		default:
		    			notification('error', 'error log type');
		    			break;	
		    	}
	        getAllDataLogs();
	        break;
	    default:
	      	notification('error', 'error verb socket');
	      	break;
		}
	});
	// Get All data
	getAllDataForDashboard();
	getAllDataLogs();
});