/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /*TODO: give/remove authorization to an user*/

function FrontDeviceCtrl(){

	return{
		index:function(req,res){
			Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
				if(err) {
					var log = "Error : " + err + " trying to create device.";
					console.log(log);
					return res;
				}
				console.log(device);
				return res.json(device);
			});
		},
		creatingPage: function (req, res) {
				return res.view('device/creatingPage');
		},
		create:function(req,res){
			Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
				if(err) {
					var log = "Error : " + err + " trying to create device.";
					console.log(log);
					return res;
				}
				var log = "Device correctly created."
				var lastId = created.id;
				console.log(lastId);
				Device.findOne({id:lastId}).exec(function findCB(err, found) {
					if (err) return err;
					console.log(found);
					console.log(req.user);
					found.userList.add(req.user);
				});
				console.log(log);
				res.redirect('/');
			});
		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, found){
				if(err) {
					var log = "Error : " + err + " trying to list devices.";
					console.log(log);
					return res;
				}
				var log = "Devices correctly listed."
				console.log(log);
				console.log(found);
				return res.json(found);
			});
		},
		delete:function(req,res){
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err){
				if(err) {
					var log = "Error : " + err + " trying to delete device.";
					console.log(log);
					return res;
				}
				var log = "Device correctly deleted.";
				console.log(log);
				return res;
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name, state:req.allParams().state}).exec(function afterwards(err, updated){
				if(err) {
					var log = "Error : " + err + " trying to update device.";
					console.log(log);
					return res;
				}
				var log = "Device correctly updated."
				console.log(log);
				console.log(updated);
				return res.json(updated);
			});
		},
		checkState:function(req,res){
			Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
				if(err) {
					var log = "Error : " + err + " trying to check device state.";
					console.log(log);
					return res;
				}
				var log = "Lock " + found[0].name + " is " + found[0].state + "."
				console.log(log)
				return res.json(log);
			});
		},
		close:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
				if(errCheck) {
					var log = "Error : " + err + " trying to find device.";
					console.log(log);
					return res;
				}
				if(found[0].state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
						if(errUpdate) {
							var log = "Error : " + err + " trying to close device.";
							console.log(log);
							return res;
						}
						res
						console.log(closed);
						return res.json(closed);
					});
				} else {
					var log = "Lock " + found[0].name + " already " + found[0].state + ".";
					console.log(log);
					return res;
				}
			});
		},
		open:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
				if(errCheck) {
					var log = "Error : " + err + " trying to find device.";
					console.log(log);
					return res;
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,openned){
						if(errUpdate) {
							var log = "Error : " + err + " trying to open device.";
							console.log(log);
							return res;
						}
						console.log(openned);
						return res.json(openned);
					});
				} else {
					var log = "Lock " + found[0].name + " already " + found[0].state + ".";
					console.log(log);
					return res;
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.find({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					var log = "Error : " + err + " trying to list device users.";
					console.log(log);
					return res;
				}
				var log = "Device users correctly listed."
				console.log(log);
				console.log(users);
				return res.json(users);
			});
		}
	}
}

module.exports = FrontDeviceCtrl();
