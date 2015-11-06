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
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to display device"});
					return err;
				}
				console.log(device);
				return res.json(device);
			});
		},
		creatingPage: function (req, res) {
				return res.view('device/creatingPage');
		},
		create:function(req,res){
			Device.create({name:req.allParams().name, state:"closed", connected:"false"}).exec(function createCB(err, created){
				if(err) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to create device #" + req.allParams().id});
					return res.redirect('/');
				}
				created.userList.add(req.user);
				created.save();
				LogService.create({user: req.user, device: created.id, type: "Create", description: "Device correctly created." });
				return res.redirect('/');
			});
		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, found){
				if(err) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to list devices."});
					return err;
				}
				console.log(found);
				return res.json(found);
			});
		},
		delete:function(req,res){
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, device){
				if(err) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to delete device #" + req.allParams().id});
					return res.json({msg : 'Error'})
				}
				LogService.create({user: req.user, device: device, type: "Delete", description: "Device correctly deleted."});
				Device.publishDestroy(device[0].id,device[0]);
				return res.json({msg : 'Successful'})
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, updated){
				if(err) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to update device."});
					return res.redirect('/');
				}
				LogService.create({user: req.user, device: updated, type: "Update", description: "Device correctly updated."});
				console.log(updated);
				Device.publishUpdate(updated[0].id,updated[0]);
				return res.redirect('/');
			});
		},
		checkState:function(req,res){
			Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
				if(err) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to check device state."});
					return res;
				}
				var log = "Lock " + found[0].name + " is " + found[0].state + "."
				return res.json(log);
			});
		},
		close:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
				if(errCheck) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to find device."});
					return res;
				}
				if(found[0].state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
						if(errUpdate) {
							LogService.create({user: req.user, device: found[0], type: "Error", description: "Error : " + err + " trying to close device."});
							return res;
						}
						LogService.create({user: req.user, device: closed[0], type: "Close", description: "Lock closed."});
						console.log(closed);
						Device.publishUpdate(closed[0].id,closed[0]);
						return res.json(closed);
					});
				} else {
					return res.json({msg : 'Already closed'});
				}
			});
		},
		open:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
				if(errCheck) {
					LogService.create({user: req.user, type: "Error", description: "Error : " + err + " trying to list devices."});
					return res;
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,opened){
						if(errUpdate) {
							LogService.create({user: req.user, device: found[0], type: "Error", description: "Error : " + err + " trying to open device."});
							return res;
						}
						LogService.create({user: req.user, device: opened[0], type: "Open", description: "Lock opened."});
						Device.publishUpdate(opened[0].id,opened[0]);
						console.log(opened);
						return res.json(opened);
					});
				} else {
					return res.json({msg : 'Already opened'});
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.find({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					var log = "Error : " + err + " trying to list device users.";
					return res;
				}
				return res.json(users);
			});
		}
	}
}

module.exports = FrontDeviceCtrl();
