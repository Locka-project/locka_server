function insertData(resData){
	$.each(resData[0]['deviceList'],function(){
		if(this['state'] == 'closed'){
			var $lock = 'lock_open';
		} else {
			var $lock = 'lock_outline';
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
}

io.socket.on('connect', function(){
	console.log("Connected...");
	
	io.socket.get('/socket/devices/subscribe');
	
	io.socket.on("device", function(resData){
		console.log(resData);
		
	});
	
	io.socket.get('/user/getDevicesByUser', function (resData) {
		insertData(resData);
	});
});
