/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /*TODO: give/remove authorization to an user*/

function DeviceCtrl(){

	return{
		_config: { actions: false, rest: false, shortcuts: false },
		
		index:function(req,res){
			Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
				if(err) {
					LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to display device."});
					return res;
				}
				console.log(device);
				return res.json(device);
			});
		},
		create:function(req,res){
			Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
				if(err) {
					LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to create device."});
					return res;
				}
				created.userList.add(req.user);
				created.save();
				LogService.create({user_id: req.user.id, device_id: created.id, type: "Create", description: "Device correctly created."});
				return res.json(created);
			});
		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, found){
				if(err) {
					LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to list devices."});
					return res;
				}
				console.log(found);
				return res.json(found);
			});
		},
		delete:function(req,res){
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, device){
				if(err) {
					LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + err + " trying to delete device."});
					return res;
				}
				LogService.create({type: "Delete", description: "Device " + req.allParams().id + " correctly deleted by user " + req.user.id});
				Device.publishDestroy(device[0].id,device[0]);
				return res.json(device);
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, updated){
				if(err) {
					LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + err + " trying to update device."});
					return res;
				}
				LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Update", description: "Device correctly updated."});
				console.log(updated);
				Device.publishUpdate(updated[0].id,updated[0]);
				return res.json(updated);
			});
		},
		checkState:function(req,res){
			Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
				if(err) {
					LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + err + " trying to check device state."});
					return res;
				}
				return res.json("Lock " + found[0].name + " is " + found[0].state + ".");
			});
		},
		close:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
				if(errCheck) {
					LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + errCheck + " trying to find device."});
					return res;
				}
				if(found[0].state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
						if(errUpdate) {
							LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + errUpdate + " trying to close device."});
							return res;
						}
						LogService.create({user_id: req.user.id, device_id: closed.id, type: "Close", description: "Device " + req.allParams().id + " correctly closed by user " + req.user.id});
						console.log(closed);
						Device.publishUpdate(closed[0].id,closed[0]);
						return res.json(closed);
					});
				} else {
					return res.json("Lock " + found[0].name + " already " + found[0].state + ".");
				}
			});
		},
		open:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
				if(errCheck) {
					LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + errCheck + " trying to find device."});
					return res;
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,opened){
						if(errUpdate) {
							LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + errUpdate + " trying to open device."});
							return res;
						}
						LogService.create({user_id: req.user.id, device_id: opened.id,  type: "Open", description: "Device correctly opened."});
						Device.publishUpdate(opened[0].id,opened[0]);
						console.log(opened);
						return res.json(opened);
					});
				} else {
					return res.json("Lock " + found[0].name + " already " + found[0].state + ".");
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.findOne({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					LogService.create({user_id: req.user.id, device_id: req.allParams().id, type: "Error", description: "Error : " + err + " trying to list device users."});
					return res;
				}
				console.log(users);
				return res.json(users.deviseList);
			});
		},
		subscribe: function(req, res){
			if(!req.isSocket) return res.json({msg: "is not a Socket"});
			if(!req.user) return res.json({msg: "user is not defined"});
			return res.json({msg: "success...",id: req.params.id, token: req.param('access_token')});
		}
	}
}

module.exports = DeviceCtrl();
