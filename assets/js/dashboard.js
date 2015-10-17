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

function closeModal() {
	$('#modal1').closeModal();
	$('#modal2').closeModal();
}