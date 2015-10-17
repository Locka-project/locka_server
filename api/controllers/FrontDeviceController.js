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
			Device.create({name:req.allParams().name, state:"closed", connected:"false"}).exec(function createCB(err, device){
				if(err) {
					return res.redirect('/');
				}
				device.userList.add(req.user);
				device.save();
				LogService.create({user: req.user, device: device.id, type: "Create", description: "Device correctly created." });
				Device.publishCreate(device);
				return res.redirect('/');
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
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err, device){
				if(err) {
					return res.json({msg : 'Error'})
				}
				LogService.create({user: req.user, device: device, type: "Delete", description: "Device correctly deleted."});
				Device.publishDestroy(device[0].id,device[0]);
				return res.json({msg : 'success'})
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, device){
				if(err) {
					return res.redirect('/');
				}
				LogService.create({user: req.user, device: device, type: "Update", description: "Device correctly updated."});
				Device.publishUpdate(device[0].id,device[0]);
				return res.redirect('/');
			});
		},
		close:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkCloseCB(errCheck,device){
				if(errCheck) {
					return res.json(errCheck);
				}
				if(device.state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						LogService.create({user: req.user, device: device, type: "Close", description: "Lock closed."});
						Device.publishUpdate(device.id,device);
						return res.json(device);
					});
				} else {
					return res.json({msg : 'Already closed'});
				}
			});
		},
		open:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkOpenCB(errCheck,device){
				if(errCheck) {
					return res.json(errCheck);
				}
				if(device.state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,opened){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						LogService.create({user: req.user, device: device, type: "Open", description: "Lock opened."});
						Device.publishUpdate(device.id,device);
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
		}
	}
}

module.exports = FrontDeviceCtrl();
