/**
 * DashboardControllerFront
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Dashboard = {

	getDashboard:function(req,res){
		return res.view('dashboard', {
			user: req.user
		});
	},

	getMyLock: function(req, res){
		if(!req.isSocket) return res.json({msg: "Nok User"});
		if(!req.user) return res.json({msg: "Nok Socket"});

		User.findOne({id:req.user.id}).populate('deviceList').exec(function foundByUserCB(err, user){
			if(err) return res.json(err);
			Device.subscribe(req, _.pluck(user.deviceList, 'id'));
			return res.json({msg: "Successful"});
		});
	}
};

module.exports = Dashboard;
