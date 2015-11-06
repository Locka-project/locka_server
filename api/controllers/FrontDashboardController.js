/**
 * DashboardControllerFront
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Dashboard = {

	getDashboard:function(req,res){

		Passport.find({user:req.user.id, protocol:'local'}).exec(function findCB(err, passport){
      if(err){
        console.log(err);
      }
			if(!passport[0]){
				Passport.create({ protocol: 'local', user : req.user.id }, function (err, passport) {
		      if (err) {
						console.log(err);
					}
		    });
			}
      });
		return res.view('dashboard', {
			user: req.user
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
	}
};

module.exports = Dashboard;
