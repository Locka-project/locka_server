/**
 * ShareLockController
 *
 * @description :: Server-side logic for managing sharelocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res){
		var owner = req.user.id;
		var device = req.param('deviceId');
		var user = req.params.userId ;
		
		function makeid()
		{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	    for( var i=0; i < 7; i++ )
	      text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	    return text;
		}
		
		var sharedKey = makeid();
		
		
		ShareLock.findOne({owner: owner, device: device, user: user}).exec(function(err,find){
			if(err){
				return res.json(err)
			}
			if(!find){
				ShareLock.create({owner:owner, device:device, user:user, sharedKey: sharedKey}).exec(function(err, shareKey){
					if(err){
						return res.json(err)
					}
					ShareLock.findOne({id: shareKey.id}).populateAll().exec(function(err,shareLock){
						if(err){
							return res.json(err)
						}
						LogService.create({user: owner, device: device, type: "Update", description: shareLock.device.name + " is now shared with " + shareLock.user.username + "."});
						return res.json(shareLock)
					});
				});
			} else {
				return res.json({msg: 'error, id / device / user is already shared'})
			}
		});
	},
	
	update: function(req, res){
		return res.ok();
	},
	
	delete: function(req, res){
		ShareLock.destroy({id: req.params.id}).exec(function(err, shareKey){
			if(err){
				return res.json(err)
			}
			User.findOne({id: req.params.userId}).exec(function(err,user){
				if(err){
					return res.json(err)
				}
				return res.json({msg: 'success'})
			});
		});
	},
	
	activateSharing: function(req, res){
		var key = req.params.key;
		ShareLock.findOne({sharedKey: key}).exec(function(err, find){
			if(err){
				return res.json(err)
			}
			if(find){
				ShareLock.update({id: find.id},{activate: true}).exec(function(err,shareLock){
					if(err){
						return res.json(err)
					}
					Device.findOne({id: shareLock[0].device}).exec(function(err,device){
						if(err){
							return res.json(err)
						}
						device.userList.add(shareLock[0].user);
						device.save();
						return res.json({msg: 'success'})
					});
				});
			} else {
				return res.json({msg:'invalid key'})
			}
		})
	}
};

