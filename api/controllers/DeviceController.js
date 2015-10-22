/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req,res){
		Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
			if(err) return;
			console.log(device);
			return device;
		});
	},
    create:function(req,res){
    	Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
    		if(err) return;
    		console.log(created);
    		return created;
    	});
    },
    getAllDevices:function(req,res){
    	Device.find({}).exec(function findCB(err, found){
  			if(err) return;
  			console.log(found);
  			return found;
 	 	});
	},
    delete:function(req,res){
    	Device.destroy({id:req.allParams().id}).exec(function destroyCB(err){
    		if(err) return;
    		return;
    	});
    },
    update:function(req,res){
    	Device.update({id:req.allParams().id},{name:req.allParams().name, state:req.allParams().state}).exec(function afterwards(err, updated){
    		if(err) return;
    		console.log(updated);
    		return updated;
		});
    },
    close:function(req,res){
    	Device.find({id:req.allParams().id}).exec(function checkClosedCB(errCheck,found){
    		if(errCheck) return;
    		if(found[0].state == "open"){
    			Device.update({id:req.allParams().id},{state:"closed"}).exec(function closeCB(errUpdate,closed){
    				if(errUpdate) return;
    				console.log(closed);
    				return closed;
    			});
    		} else {
    			console.log("Lock" + found[0].name + "already " + found[0].state + ".");
    			return;
    		}	
    	});
    },
    open:function(req,res){
    	Device.find({id:req.allParams().id}).exec(function checkOpenCB(errCheck,found){
    		if(errCheck) return;
    		if(found[0].state == "closed"){
    			Device.update({id:req.allParams().id},{state:"open"}).exec(function openCB(errUpdate,openned){
    				if(errUpdate) return;
    				console.log(openned);
    				return openned;
    			});
    		} else {
    			console.log("Lock" + found[0].name + "already " + found[0].state + ".");
    			return;
    		}	
    	});
    },
    getUsersByDevice: function(req, res){
        Device.find({id:req.allParams().id}).populate('userList').exec(function founByDeviceCB(err, devices){
        	if(err) return;
        	console.log(devices);
			return devices;
        });
    }
};

