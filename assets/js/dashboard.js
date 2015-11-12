function openEditDevice(deviceId, deviceName) {
		$('#deviceId').val(deviceId);
		$('#deleteButton').attr('meta', deviceId);
		$('#deviceNameEdit').val(deviceName);
		$('#modal1').openModal();
	}

function openCreateDevice() {
	$('#createdEdit').trigger('reset');
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
		$.post('/device/create', 
		{name: deviceName, identifier: identifier}, function (data){
			$('#modal2').closeModal();
			
		});
	} else {
		$('#modal2').closeModal();
		Materialize.toast('Une erreur est survenue : le formulaire est incomplet', 3000);
	}
}

function closeModal() {
	$('#modal1').closeModal();
	$('#modal2').closeModal();
}