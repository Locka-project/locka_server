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
					LogService.create({type: "Error", description: "Error : " + err + " trying to display device with id " + req.allParams().id});
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
					LogService.create({type: "Error", description: "Error : " + err + " trying to create device " + req.allParams().name});
					return res;
				}
				created.userList.add(req.user);
				created.save();
				LogService.create({type: "Create", description: "Device " + created.id + " correctly created by user " + req.user.username});
				return res.redirect('/');
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
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, device){
				if(err) {
					var log = "Error : " + err + " trying to delete device.";
					console.log(log);
					return res.json({msg: err});
				}
				var log = "Device correctly deleted.";
				console.log(log);
				Device.publishDestroy(device[0].id,device[0]);
				return res.json({msg : 'Successful'})
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, updated){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to update device with id " + req.allParams().id});
					return res;
				}
				LogService.create({type: "Update", description: "Device with id " + req.allParams().id + " correctly updated by user " + req.user.username});
				console.log(updated);
				Device.publishUpdate(updated[0].id,updated[0]);
				return res.redirect('/');
			});
		},
		checkState:function(req,res){
			Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to check device with id " + req.allParams().id + "state"});
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
						Device.publishUpdate(closed[0].id,closed[0]);
						return res.json(closed);
					});
				} else {
					var log = "Lock " + found[0].name + " already " + found[0].state + ".";
					console.log(log);
					return res.json({msg : 'Already closed'});
				}
			});
		},
		open:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
				if(errCheck) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to list devices."});
					return res;
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,opened){
						if(errUpdate) {
							LogService.create({type: "Error", description: "Error : " + err + " trying to open device with id " + req.allParams().id});
							return res;
						}
						LogService.create({type: "Open", description: "Lock " + opened.name + " opened by user " + req.user.username});
						console.log(openned);
						Device.publishUpdate(opened[0].id,opened[0]);
						return res.json(opened);
					});
				} else {
					LogService.create({type: "Error", description: "Error : " + err + " trying to list devices."});
					return res.json({msg : 'Already opened'});
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
