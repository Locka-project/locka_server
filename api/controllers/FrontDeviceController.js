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
					return res.json(err);
				}
				return res.json(device);
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
						if(err){
							return res.json(err);
						}
						LogService.create({user: req.user, deviceId: device.id, type: "Create", description: device.name + " correctly created." });
						return res.json({msg: 'success', device: device});
					})
				});
			});
		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, found){
				if(err) {
					return res.json(err);
				}
				return res.json(found);
			});
		},
		delete:function(req,res){
			ShareLock.findOne({user: req.user.id, device: req.param('id')}).exec(function(err, find){
				if(err){
					return res.json(err)
				}
				if(find != null){
					return res.json({msg : 'error this device is currently shared with you !'})						
				} else {
					ShareLock.destroy({owner: req.user.id, device: req.param('id')}).exec(function destroyCB(err, shareLock){
						if(err) {
							return res.json(err)
						}	
						Device.destroy({id:req.param('id')}).exec(function destroyCB(err, device){
							if(err) {
								return res.json(err)
							}
							Identifier.destroy({id: device[0].identifier}).exec(function destroyCB(err, identifier){
								if(err) {
									return res.json(err)
								}
								Device.publishDestroy(device[0].id);
								Log.destroy({device: device[0].id}).exec(function(err){
									if(err){
										return res.json(err)
									}
									return res.json({msg : 'success'})
								});
							});
						});
					});
				}
			});
		},
		update:function(req,res){
			Device.update({id:req.param('id')},{name:req.param('name')}).exec(function afterwards(err, device){
				if(err) {
					return res.json(err);
				}
				LogService.create({user: req.user, deviceId: device[0].id, type: "Update", description: device[0].name + " correctly updated."});
				return res.json({msg: 'success', device: device[0]});
			});
		},
		close:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkCloseCB(errCheck,deviceOne){
				if(errCheck) {
					return res.json(errCheck);
				}
				if(deviceOne.state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,device){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						Device.findOne({id:device[0].id}).populateAll().exec(function(err,goodDevice){
							if(err){
								return res.json(err)
							}
							LogService.create({user: req.user, deviceId: deviceOne.id, type: "Close", description: device[0].name + " is now closed."});
							return res.json(goodDevice);
						});
					});
				} else {
					return res.json({msg : 'Already closed'});
				}
			});
		},
		open:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkOpenCB(errCheck,deviceOne){
				if(errCheck) {
					return res.json(errCheck);
				}
				if(deviceOne.state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,device){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						Device.findOne({id:device[0].id}).populateAll().exec(function(err,goodDevice){
							if(err){
								return res.json(err)
							}
							LogService.create({user: req.user, deviceId: deviceOne.id, type: "Open", description: device[0].name + " is now opened."});
							return res.json(goodDevice);
						});
					});
				} else {
					return res.json({msg : 'Already opened'});
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.find({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					return res.json(err);
				}
				return res.json(users);
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
		}
	}
}

module.exports = FrontDeviceCtrl();
