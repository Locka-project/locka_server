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
			User.findOne({id: req.user.id}).populate('deviceList').exec(function (err, user) {
				if (err) {
					return res.json(err);
				}
				return res.json(user.deviceList);
			});
		},
		create:function(req,res){
			function capitalize(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}

			var deviceName = capitalize(req.param('name'));
			var deviceIdentifier = req.param('identifier').toUpperCase();

			Device.create({name:deviceName, state:"closed", connected:"false"}).exec(function createCB(err, device){
				if(err){
					return res.json(err)
				}
				Identifier.create({identifier: req.param('identifier').toUpperCase(), owner: device.id}).exec(function (err, lock){
					if(err) {
						return res.json(err);
					}
					device.userList.add(req.user);
					device.save();
					Device.update({id:device.id},{identifier:lock.id}).exec(function(err){
						LogService.create({user: req.user, device: device.id, type: "Create", description: device.name + " correctly created." });
						return res.json(device);
					})
				});
			});

		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, devices){
				if(err) {
					return res.json(err);
				}
				return res.json(devices);
			});
		},
		delete:function(req,res){
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, devices){
				if(err) {
					return res.json(err);
				}
				LogService.create({user: req.user, device: devices[0], type: "Delete", description: "Device correctly deleted."});
				Device.publishDestroy(devices[0].id,devices[0]);
				return res.json({msg: 'success'});
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, devices){
				if(err) {
					return res.json(err);
				}
				LogService.create({user: req.user, device: devices[0], type: "Update", description: "Device correctly updated."});
				return res.json(devices[0]);
			});
		},
		close:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkClosedCB(err,device){
				if(err) {
					return res.json(err);
				}
				if(device.state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,devices){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						LogService.create({user: req.user, device: devices[0], type: "Close", description: "Lock closed."});
						return res.json(devices[0]);
					});
				} else {
					return res.json("Lock " + device.name + " already " + device.state + ".");
				}
			});
		},
		open:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkOpenCB(err,device){
				if(err || !device) {
					return res.json(err);
				}
				if(device.state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(err,devices){
						if(err) {
							return res.json(err);
						}
						LogService.create({user: req.user, device: devices[0], type: "Open", description: "Lock opened."});
						return res.json(devices[0]);
					});
				} else {
					return res.json("Lock " + device.name + " already " + device.state + ".");
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.findOne({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					return res.json(err);
				}
				return res.json(users.deviseList);
			});
		},
		getDeviceLogs: function(req, res) {
			Log.find({device : req.allParams().id}).exec(function findLog(err, logList){
				if(err) {
					return res.json(err);
				}
				return res.json(logList);
			});
		},
		getLogs: function(req, res){
			if(!req.isSocket){
				User.findOne({id:req.user.id}).populate('deviceList').exec(function(err, user){
					if(err){
						return res.json(err)
					}
					if(user.deviceList.length != 0){
						var ids = _.pluck(user.deviceList, 'id');
						Log.find({device: ids}).populate('user').populate('device').exec(function(err, devices) {
							if(err) {
								return res.json(err);
							}
							return res.json(devices);
						});
					}
				});
			} else {
				return res.json({msg: 'success'});
			}
		},
		// Virtual lock
		subscribe: function(req, res){
			if(!req.isSocket) return res.json({msg: "is not a Socket"});
			if(!req.user) return res.json({msg: "user is not defined"});
			if(!req.params.identifier) return res.json({msg: "identifier not found"});

			Device.find().populate('identifier').exec(function (err, device) {
				if(err){
					return res.json(err)
				}
				Device.subscribe(req, _.pluck(device, 'id'))
				return res.json({msg: 'success'})
			});
		}
	}
}

module.exports = DeviceCtrl();
