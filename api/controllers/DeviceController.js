/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /*TODO: give/remove authorization to an user*/

function DeviceCtrl(){

	return{
		index:function(req,res){
			Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to display device."});
					return res;
				}
				console.log(device);
				return res.json(device);
			});
		},
		create:function(req,res){
			Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to create device."});
					return res;
				}
				created.userList.add(req.user);
				created.save();
				LogService.create({type: "Create", description: "Device " + created.id + " correctly created by user " + req.user.username});
				return res.json(created);
			});
		},
		getAllDevices:function(req,res){
			Device.find({}).exec(function findCB(err, found){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to list devices."});
					return res;
				}
				console.log(found);
				return res.json(found);
			});
		},
		delete:function(req,res){
			Device.destroy({id:req.allParams().id}).exec(function destroyCB(err){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to delete device."});
					return res;
				}
				LogService.create({type: "Delete", description: "Device " + req.allParams().id + " correctly deleted by user " + req.user.id});
				return res;
			})
		},
		update:function(req,res){
			Device.update({id:req.allParams().id},{name:req.allParams().name, state:req.allParams().state}).exec(function afterwards(err, updated){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to update device."});
					return res;
				}
				LogService.create({type: "Update", description: "Device " + req.allParams().id + " correctly updated by user " + req.user.id});
				console.log(updated);
				return res.json(updated);
			});
		},
		checkState:function(req,res){
			Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to check device state."});
					return res;
				}
				return res.json("Lock " + found[0].name + " is " + found[0].state + ".");
			});
		},
		close:function(req,res){
			Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
				if(errCheck) {
					LogService.create({type: "Error", description: "Error : " + errCheck + " trying to find device."});
					return res;
				}
				if(found[0].state == "open"){
					Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
						if(errUpdate) {
							LogService.create({type: "Error", description: "Error : " + errUpdate + " trying to close device."});
							return res;
						}
						LogService.create({type: "Close", description: "Device " + req.allParams().id + " correctly closed by user " + req.user.id});
						console.log(closed);
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
					LogService.create({type: "Error", description: "Error : " + errCheck + " trying to find device."});
					return res;
				}
				if(found[0].state == "closed"){
					Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,openned){
						if(errUpdate) {
							LogService.create({type: "Error", description: "Error : " + errUpdate + " trying to open device."});
							return res;
						}
						LogService.create({type: "Open", description: "Device " + req.allParams().id + " correctly opened by user " + req.user.id});
						console.log(openned);
						return res.json(openned);
					});
				} else {
					return res.json("Lock " + found[0].name + " already " + found[0].state + ".");
				}
			});
		},
		getUsersByDevice: function(req, res){
			Device.find({id:req.allParams().id}).populate('userList').exec(function foundByDeviceCB(err, users){
				if(err) {
					LogService.create({type: "Error", description: "Error : " + err + " trying to list device users."});
					return res;
				}
				console.log(users);
				return res.json(users);
			});
		},
		getAllRooms: function(req,res){
			
		},
		createRooms: function(req,res){
			if(req.req.isSocket){
				if(req.param('id')){
					sails.sockets.join(req.socket, req.param('id'));
					res.json({
						message: 'Subscribed to a fun room called '+req.param('id')+'!'
					})
				} else {
					res.json({
						message: 'id parameter is not defined'
					});
				}
			} else {
				res.json({
						message: 'you don\'t have a valid socket'
					});
			}
		}
	}
}

module.exports = DeviceCtrl();
