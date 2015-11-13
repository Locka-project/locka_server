function insertDataDashboard(data){
	deviceList.clear();
	deviceList.draw();

	$.each(data,function(){
		if(this['state'] == 'closed'){
			var $lock = '<span title="Open"><i onclick="door(\'open\','+ this['id'] + ')" class="fa fa-unlock-alt"> </i></span>';
		} else {
			var $lock = '<span title="Close"><i onclick="door(\'close\','+ this['id'] + ')" class="fa fa-lock"> </i></span>';
		}
		
		var actionBar = '<span title="Video"><i class="fa fa-camera"></i></span>'+$lock+'<span title="Informations"> <i onclick="openEditDevice('+this['id']+',\''+this['name']+'\')" class="fa fa-info"></i></span><span title="Share"><i onclick="openShareModal('+this['id']+')" class="fa fa-retweet"></i></span>';
		var connected = '<div style="width:15px; height:15px; background:#f44336; border-radius:7.5px;"></div>';
    
    deviceList.row.add([this['id'], this['name'], this['lock']['identifier'], this['state'], actionBar, connected]).draw( false );
	});
}

function insertDataLog(data){
	logList.clear();
	logList.draw();
	
	$.each(data,function(i){
		// Format Date
		var date = moment(data[i]['updatedAt']).format("DD/MM/YYYY HH:mm");

		if(!data[i]['device']){
			var name = "deleted";
		} else {
			var name = data[i]['device']['name'];
		}
		
		logList.row.add([data[i]['user']['username'], name, data[i]['type'], data[i]['description'], date]).draw( false );
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
		
		if(data.length != 0){
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
		} else {
			insertDataDashboard([]);
		}
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


// Init
// Device table
var deviceList = $('#deviceListData').DataTable();
// Remove show entries
$('#deviceListData_length').remove();
// Log table
var logList = $('#logListData').DataTable();
// Remove show entries
$('#logListData_length').remove();
