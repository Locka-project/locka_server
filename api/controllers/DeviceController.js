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
    createDevice:function(req,res){
    	Device.create({name:req.allParams().name, state:"closed", id:req.allParams().id, }).exec(function createCB(err, created){
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
    deleteDevice:function(req,res){
    	Device.destroy({id:req.allParams().id});
    	if(err) return;
    	return;
    },
    updateDevice:function(req,res){
    	Device.update({name:req.allParams().name, state:req.allParams().state, id:req.allParams().id, }).exec(function afterwards(err, updated){
    		if(err) return;
    		return updated;
    	})
    },
    getUsersByDevice: function(req, res){
        Device.findBy({id:req.allParams().id}).populate('userList').exec(function founByDeviceCB(err, devices){
        	if(err) return;
			return devices;
        });
    }
};

