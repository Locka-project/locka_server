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
		if(req.isSocket){
			if(req.user){
				User.findOne({id:req.user.id}).populate('deviceList').exec(function foundByUserCB(err, user){
					
					if(err) return res.json(err)
					Device.subscribe(req, _.pluck(user.deviceList, 'id'));
					return res.json({msg : 'Successful'})
				});
			}
			return res.json({msg: "Nok User"});
		}
		return res.json({msg: "Nok Socket"});
	}
};

module.exports = Dashboard;
