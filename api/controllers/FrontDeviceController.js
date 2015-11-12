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
			
			Device.findOne({name: deviceName}).populate('identifier', {identifier: deviceIdentifier}).exec(function(err, find){
				if(err){
					return res.json(err);
				}
				if(!find){
					Device.create({name:deviceName, state:"closed", connected:"false"}).exec(function createCB(err, device){
						if(err){
							return res.json({msg: 'error'})
						}
						Identifier.create({identifier: req.param('identifier').toUpperCase(), owner: device.id}).exec(function (err, lock){
							if(err) {
								return res.json({msg: 'error'});
							}
							device.userList.add(req.user);
							device.save();		
								
							Device.update({id:device.id},{identifier:lock.id}).exec(function(err){
								LogService.create({user: req.user, device: device.id, type: "Create", description: device.name + " correctly created." });
								Device.publishCreate(device);	
								return res.json({msg: 'success'});
							})
						});
					});
				} else {
					res.json({code: 101, msg: 'user or identifier are already used'});
				}
			})
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
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, device){
				if(err) {
					return res.json({msg : 'Error'})
				}
				Identifier.destroy({id:device[0].identifier}).exec(function destroyCB(err, identifier){
					Device.publishDestroy(device[0].id,device[0]);
					return res.json({msg : 'success'})
				});
				LogService.create({user: req.user, device:null, type: "Delete", description: device[0].name + " correctly deleted."});
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, device){
				if(err) {
					return res.redirect('/');
				}
				LogService.create({user: req.user, device: device, type: "Update", description: device[0].name + " correctly updated."});
				Device.publishUpdate(device[0].id,device[0]);
				return res.redirect('/');
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
						LogService.create({user: req.user, device: deviceOne, type: "Close", description: device[0].name + " is now closed."});
						Device.publishUpdate(device[0].id,device[0]);
						return res.json(device);
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
						LogService.create({user: req.user, device: deviceOne, type: "Open", description: device[0].name + " is now opened."});
						Device.publishUpdate(device[0].id,device[0]);
						return res.json(device);
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
				Log.find().populate('user').populate('device').exec(function(err, devices) {
					if(err) {
						return res.json(err);
					}
					return res.json(devices);
				});
			} else {
				Log.watch(req);
				return res.json({msg: 'success'});
			}	
		}
	}
}

module.exports = FrontDeviceCtrl();
