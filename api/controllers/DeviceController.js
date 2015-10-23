/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req,res){
		Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
			if(err) {
				res = "Error : " + err + " trying to create device.";
				console.log(res);
				return res;
			}
			console.log(device);
			return device;
		});
	},
    create:function(req,res){
    	Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
    		if(err) {
				res = "Error : " + err + " trying to create device.";
				console.log(res);
				return res;
			}
			res = "Device correctly created."
    		console.log(res);
    		return created;
    	});
    },
    getAllDevices:function(req,res){
    	Device.find({}).exec(function findCB(err, found){
  			if(err) {
				res = "Error : " + err + " trying to list devices.";
				console.log(res);
				return res;
			}
  			console.log(found);
  			return found;
 	 	});
	},
    delete:function(req,res){
    	Device.destroy({id:req.allParams().id}).exec(function destroyCB(err){
    		if(err) {
				res = "Error : " + err + " trying to delete device.";
				console.log(res);
				return res;
			}
    		return;
    	});
    },
    update:function(req,res){
    	Device.update({id:req.allParams().id},{name:req.allParams().name, state:req.allParams().state}).exec(function afterwards(err, updated){
    		if(err) {
				res = "Error : " + err + " trying to update device.";
				console.log(res);
				return res;
			}
    		console.log(updated);
    		return updated;
		});
    },
	checkState:function(req,res){
		Device.find({id:req.allParams().id}).exec(function stateCB(err, found){
			if(err) {
				res = "Error : " + err + " trying to check device state.";
				console.log(res);
				return res;
			}
			res = "Lock " + found[0].name + " is " + found[0].state + "."
			console.log(res)
			return res;
		});
	},
    close:function(req,res){
    	Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
    		if(errCheck) {
				res = "Error : " + err + " trying to find device.";
				console.log(res);
				return res;
			}
    		if(found[0].state == "open"){
    			Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
    				if(errUpdate) {
						res = "Error : " + err + " trying to close device.";
						console.log(res);
						return res;
					}
					res
    				console.log(closed);
    				return closed;
    			});
    		} else {
				res = "Lock " + found[0].name + " already " + found[0].state + ".";
    			console.log(res);
    			return res;
    		}	
    	});
    },
    open:function(req,res){
    	Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
    		if(errCheck) {
				res = "Error : " + err + " trying to find device.";
				console.log(res);
				return res;
			}
    		if(found[0].state == "closed"){
    			Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,openned){
    				if(errUpdate) {
						res = "Error : " + err + " trying to open device.";
						console.log(res);
						return res;
					}
    				console.log(openned);
    				return openned;
    			});
    		} else {
				res = "Lock " + found[0].name + " already " + found[0].state + ".";
				console.log(res);
				return res;
    		}	
    	});
    },
    getUsersByDevice: function(req, res){
        Device.find({id:req.allParams().id}).populate('userList').exec(function founByDeviceCB(err, devices){
        	if(err) {
				res = "Error : " + err + " trying to list device users.";
				console.log(res);
				return res;
			};
        	console.log(devices);
			return devices;
        });
    }
};

