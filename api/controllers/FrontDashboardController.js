/**
 * DashboardControllerFront
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Dashboard = {

	getDashboard:function(req,res){

		Passport.findOne({user:req.user.id, protocol:'local'}).exec(function findCB(err, passport){
      if(err){
        return res.json(err)
      }
			if(!passport[0]){
				Passport.create({ protocol: 'local', user : req.user.id }, function (err, passport) {
					if (err) {
						return res.json(err)
					}
				});
			}
			return res.view('dashboard', {
				user: req.user,
				apiKey: passport.accessToken
			});
		});		
	},

	getMyLock: function(req, res){
		if(!req.isSocket) return res.json({msg: "is not a Socket"});
		if(!req.user) return res.json({msg: "user is not defined"});

		User.findOne({id:req.user.id}).populate('deviceList').exec(function foundByUserCB(err, user){
			if(err) return res.json(err);
			Device.subscribe(req, _.pluck(user.deviceList, 'id'));
			return res.json({msg: "success"});
		});
	},
	
	getSharedDevice: function(req,res){
		var deviceId = req.params.id;
		var user = req.user;
		
		Device.findOne({id: deviceId}).populate('sharedKey').exec(function(err,device){
			if(err){
				return res.json(err)
			}
			if(device){
				if(device.sharedKey.length == 0){
					return res.view('dashboard/share/shareDevice',  {device: device, layout: null})
				} else if(user.id == device.sharedKey[0].owner) {
					ShareLock.find({device:deviceId}).populateAll().exec(function(err,keys){
						if(err){
							return res.json(err)
						} else {
							return res.view('dashboard/share/listAllSharedDevice',  {device: device, shareLock:keys, layout: null})	
						}
					});
				} else if (user.id != device.sharedKey[0].owner) {
					var sharedKey = device.sharedKey.filter(function(e){
						return user.id == e.user && deviceId == e.device 
					})
					return res.view('dashboard/share/stopShareDevice',  {device: device, key: sharedKey[0], layout: null})
				}
			}
		})
	
		
	}
};

module.exports = Dashboard;
