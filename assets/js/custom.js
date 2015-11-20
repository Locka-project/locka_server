function insertDataDashboard(data){
	deviceList.clear();
	deviceList.draw();

	$.each(data,function(){
		if(this['state'] == 'closed'){
			var $lock = '<span title="Open"><i onclick="door(\'open\','+ this['id'] + ')" class="fa fa-unlock-alt"> </i></span>';
		} else {
			var $lock = '<span title="Close"><i onclick="door(\'close\','+ this['id'] + ')" class="fa fa-lock"> </i></span>';
		}

		var actionBar = $lock+'<span title="Informations"> <i onclick="openEditDevice('+this['id']+',\''+this['name']+'\')" class="fa fa-info"></i></span><span title="Share"><i onclick="openShareModal('+this['id']+')" class="fa fa-retweet"></i></span>';
    
    deviceList.row.add([this['id'], this['name'], this['lock']['identifier'], this['state'], actionBar]).draw( false );
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

function insertDataStats(dataToProcess){
	var openLocks = 0;
	var closedLocks = 0;
	var table = [];
	$.each(dataToProcess,function(i){
		if(dataToProcess[i].state=='open') {
			openLocks++;
		}
		if(dataToProcess[i].state=='closed') {
			closedLocks++;
		}
	});
	if(closedLocks + openLocks == 0) {
		$('#opn_clsd_stat').highcharts({
			chart: {
				backgroundColor: 'transparent',
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'No lock to display',
				style: {
					color: "#fff"
				},
			},
			tooltip: {
				pointFormat: '{series.label}: <b>{point.percentage}</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					width: '100%',
					dataLabels: {
						enabled: true
					},
					showInLegend: false
				}
			},
			series: [{
				name: 'Count',
				colorByPoint: true,
				data: []
			}],
			credits: {
				enabled: false
			},
		});
	} else {
		$('#opn_clsd_stat').highcharts({
			chart: {
				style: {
					color: "#fff"
				},
				backgroundColor: 'transparent',
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: ' ',
				style: {
					color: "#fff"
				},
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true
					},
					size: '100%',
					showInLegend: false
				},
				series: {
					dataLabels: {
						color: '#fff'
					},
				},
			},
			series: [{
				name: 'Count',
				colorByPoint: true,
				data: [
					{name: "Open", y: openLocks},
					{name: "Closed", y: closedLocks}
				]
			}],
			credits: {
				enabled: false
			},
		});
	}
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
				Materialize.toast("Error : " + text, 4000);
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

// Get all logs and devices and stats
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
				insertDataDashboard(array);
				getAllDataLogs();
		  });	
		} else {
			insertDataDashboard([]);
			insertDataLog([]);
			getAllDataStats();
		}
	});
}

function getAllDataLogs(){
	$.get( '/device/logs').done(function(logs) {
		insertDataLog(logs);
		getAllDataStats();
	});
}

function getAllDataStats(){
	$.get("/user/getDevicesByUser", function(array) {
		insertDataStats(array);
	});
}

// Socket IO //
io.socket.on('connect', function(){
	console.log("Connected...");

	// Subscribe events
	io.socket.get('/socket/devices/subscribe');

	// Monitor device Model
	io.socket.on("device", function(data){
		switch(data.verb) {
			case 'created':
				getAllDataForDashboard();
				break;
			case 'destroyed':
				getAllDataForDashboard();
				break;
			case 'updated':
				getAllDataForDashboard();
				break;
			default:
				notification('error', 'error switch');
				break;
		}
		
		if(data.data != null){
			if(data.data.logList != null){
				log = data.data.logList;
				log = log.sort(function(a,b) {
								if(a.createdAt > b.createdAt){
									return -1
								}
								if(a.createdAt < b.createdAt){
									return 1
								}
								return 0
							});
			
				switch(log[0].type) {
					case 'Create':
						notification('add', log[0].description);
						break;
					case 'Update':
						notification('update', log[0].description);
						break;
					case 'Delete':
						notification('del', log[0].description);
						break;
					case 'Open':
						notification('update', log[0].description);
						break;
					case 'Close':
						notification('update', log[0].description);
						break;
					default:
						break;
				}	
			}	
		}
	});

	// Get All data
	getAllDataForDashboard();
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
var openChart = $('#opn_clsd_stat').highcharts({
	chart: {
		backgroundColor: 'transparent',
		plotBorderWidth: null,
		plotShadow: false,
		type: 'pie'
	},
	title: {
		text: 'No lock to display',
		style: {
			color: '#fff'
		}
	},
	tooltip: {
		pointFormat: '{series.label}: <b>{point.percentage}</b>'
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			dataLabels: {
				enabled: true
			},
			showInLegend: false
		}
	},
	series: [{
		name: 'Count',
		colorByPoint: true,
		data: []
	}],
	credits: {
		enabled: false
	},
});
