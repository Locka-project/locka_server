function openEditDevice(deviceId, deviceName) {
		$('#deviceEditId').val(deviceId);
		$('#deleteButton').attr('meta', deviceId);
		$('#deviceNameEdit').val(deviceName);
		$('#modal1').openModal();
}

function openCreateDevice() {
	$('#createdEdit').trigger('reset');
	$('#identifier').siblings('label, i').removeClass('active');
	$('#deviceName').siblings('label, i').removeClass('active');
	$('#sharedKey').siblings('label, i').removeClass('active');
	$('#passwordMinLength').remove();
	$('#modal2').openModal();
}

function openShareModal(deviceId) {
	$.get('/device/share/status/'+deviceId, function(res){
			$('#modal3').remove();
			$('body').append(res);
		}).done(function(){
			$('#shareDevice').trigger('reset');
			$('#userName').siblings('label, i').removeClass('active');
			$('#modal3').openModal();
		})
}

function shareDevice(deviceId) {
	var userName = $('#userName').val();
	
	$.get('/user/username/' + userName, function(data){
		if(data){
			if((data.msg && data.msg == 'User does not exist') || userName.length == 0){
				$('#passwordMinLength').remove();
				$('#userName').after('<p id="passwordMinLength" >User does not exist');
			}	else {
				id = data.id;
				$.post('/shareKey/create/' + id, {deviceId: deviceId}, function(data){
					$('#modal3').closeModal();
					if (data.code && data.code == 101){
						notification('error', "It's not possible to share this device with you because you are the owner");
					}
				});
			}
		}
	});
}

function deleteDevice(e) {
	$.post('device/delete',{id: e}, function(data){
		$('#modal1').closeModal();
		if(data.msg && data.msg != "success"){
			notification('error', data.msg);
		} else {
			notification('update', 'Your device has been correctly removed');
		}
	});
}

function addDevice() {
	var deviceName = $('#deviceName').val();
	var identifier = $('#identifier').val();
	var sharedKey = $('#sharedKey').val();

	if(deviceName != null && identifier != null && sharedKey == '') {
		if(identifier.length == 8){
			$.post('/device/create', 
			{name: deviceName, identifier: identifier}, function (data){			
				$('#modal2').closeModal();
				if(!data.msg && data.msg != 'success'){
					Materialize.toast(data.invalidAttributes.name[0].message, 4000);
				}
				io.socket.get('/socket/devices/subscribe');
				setTimeout(function(){
					getAllDataForDashboard();
				}	, 1000);
			});
		} else {
			$('#passwordMinLength').remove();
			$('#identifier').after('<p id="passwordMinLength" >Your identifier must be 8 characters');
		}
	} else if(sharedKey != '') {
		if(sharedKey.length == 7){
			$.post('/shareKey/activate/'+sharedKey, 
				function (data){			
					$('#modal2').closeModal();
					if(!data.msg && data.msg != 'success'){
						Materialize.toast(data.invalidAttributes.name[0].message, 4000);
					} else if (data.msg && data.msg == 'invalid key'){
						Materialize.toast("Error your shared key isn't valid", 4000);
					} else {
						// Subscribe new events
						io.socket.get('/socket/devices/subscribe');	
						setTimeout(function(){
							getAllDataForDashboard();
						}	, 1000);
					}
				}
			);
		} else {
			$('#passwordMinLength').remove();
			$('#sharedKey').after('<p id="passwordMinLength" >Your shared key must be 7 characters');
		}
	} else {
		$('#modal2').closeModal();
		Materialize.toast('Une erreur est survenue : le formulaire est incomplet', 4000);
	}
}

function editDevice() {
	var deviceName = $('#deviceNameEdit').val();
	var deviceId = $('#deviceEditId').val();

	if(deviceName != null && deviceId != null) {
		$.post('/device/update', 
		{name: deviceName, id: deviceId}, function (data){			
			$('#modal1').closeModal();
			if(!data.msg && data.msg != 'success'){
				Materialize.toast(data.invalidAttributes.name[0].message, 4000);
			}
		});
	} else {
		$('#modal1').closeModal();
		Materialize.toast('Une erreur est survenue : le formulaire est incomplet', 4000);
	}
}

function unShareDevice(id, key){
	$.post('/shareKey/unshare/'+id+'/'+key, function(res){
		if(res.msg && res.msg != "success"){
			notification('error', res.msg);
		} else {
			io.socket.get('/socket/devices/subscribe');	
			setTimeout(function(){
				getAllDataForDashboard();
			}	, 1000);
			$('#modal3').closeModal();
		}
	});
}

function generateIdentifier(){
	var str = "ABCDEFGHJKLMNOPQRSTUVWXYZ023456789";
	var shuffled = str.split('').sort(function(){return 0.5-Math.random()}).join('');
	
	$('#identifier').val(shuffled.substr(0,8));
	$('#identifier').trigger('change');
}