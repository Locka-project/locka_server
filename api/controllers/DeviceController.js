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
			if(!req.isSocket){
				Device.create({name:req.allParams().name, state:"closed", connected:"false"}).exec(function createCB(err, device){
					if(err) {
						return res.json(err);
					}
					created.userList.add(req.user);
					created.save();
					LogService.create({user: req.user, device: device.id, type: "Create", description: "Device correctly created." });
					Device.publishCreate(device);
					return res.json({msg: 'success'});
				});
			}
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
					return res.json(err);
				}
				LogService.create({user: req.user, device: device, type: "Delete", description: "Device correctly deleted."});
				Device.publishDestroy(device[0].id,device[0]);
				return res.json({msg: 'success'});
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name}).exec(function afterwards(err, device){
				if(err) {
					return res.json(err);
				}
				LogService.create({user: req.user, device: device, type: "Update", description: "Device correctly updated."});				
				Device.publishUpdate(device[0].id,device[0]);
				return res.json({msg: 'success'});
			});
		},
		close:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkClosedCB(err,device){
				if(err) {
					return res.json(err);
				}
				if(device.state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,device){
						if(errUpdate) {
							return res.json(errUpdate);
						}
						LogService.create({user: req.user, device: device, type: "Close", description: "Lock closed."});
						Device.publishUpdate(device.id,device);
						return res.json({msg: 'success'});
					});
				} else {
					return res.json("Lock " + found[0].name + " already " + found[0].state + ".");
				}
			});
		},
		open:function(req,res){
			Device.findOne({id:req.allParams().id}).exec(function checkOpenCB(err,device){
				if(err) {
					return res.json(err);
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(err,device){
						if(err) {
							return res.json(err);
						}
						LogService.create({user: req.user, device: device, type: "Open", description: "Lock opened."});
						Device.publishUpdate(device.id,device);
						return res.json({msg: 'success'});
					});
				} else {
					return res.json("Lock " + found[0].name + " already " + found[0].state + ".");
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
		// Virtual lock
		subscribe: function(req, res){
			if(!req.isSocket) return res.json({msg: "is not a Socket"});
			if(!req.user) return res.json({msg: "user is not defined"});
			return res.json({msg: "success...",id: req.params.id, token: req.param('access_token')});
		}
	}
}

module.exports = DeviceCtrl();
