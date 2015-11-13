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
	$('#passwordMinLength').remove();
	$('#modal2').openModal();
}

function deleteDevice(e) {
	$.ajax({
		url: 'device/delete',
		type: 'POST',
		data: {
			 'id' : e
		 }
  }).done(this.closeModal());
}

function addDevice() {
	var deviceName = $('#deviceName').val();
	var identifier = $('#identifier').val();

	if(deviceName != null && identifier != null) {
		if(identifier.length == 8){
			$.post('/device/create', 
			{name: deviceName, identifier: identifier}, function (data){			
				$('#modal2').closeModal();
				if(!data.msg && data.msg != 'success'){
					Materialize.toast(data.invalidAttributes.name[0].message, 4000);
				}
			});
		} else {
			$('#identifier').after('<p id="passwordMinLength" >Your identifier must be 8 characters');
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

function generateIdentifier(){
	var str = "ABCDEFGHJKLMNOPQRSTUVWXYZ023456789";
	var shuffled = str.split('').sort(function(){return 0.5-Math.random()}).join('');
	
	$('#identifier').val(shuffled.substr(0,8));
	$('#identifier').trigger('change');
}