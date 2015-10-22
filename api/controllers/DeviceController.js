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
			return device;
		});
	},
    create:function(req,res){
    	Device.create({name:req.allParams().name, state:"closed"}).exec(function createCB(err, created){
    		if(err) return;
    		return created;
    	});
    },
    getAllDevices:function(req,res){
    	Device.find({}).exec(function findCB(err, found){
  			if(err) return;
  			return found;
 	 	});
	},
    delete:function(req,res){
    	Device.destroy({id:req.allParams().id});
    	if(err) return;
    	return;
    },
    update:function(req,res){
    	Device.find({id:req.allParams().id}).exec(function indexCB(err, device){
			if(err) return;
			device.update({name:req.allParams().name, state:req.allParams().state}).exec(function afterwards(err, updated){
    			if(err) return;
    			return updated;
    		});
		});
    },
    getUsersByDevice: function(req, res){
        Device.findBy({id:req.allParams().id}).populate('userList').exec(function founByDeviceCB(err, devices){
        	if(err) return;
			return devices;
        });
    }
};

