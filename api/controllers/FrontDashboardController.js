/**
 * DashboardControllerFront
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
  
var Dashboard = {
		
	getDashboard:function(req,res){
		return res.view('dashboard', {
			user: req.user,
			device: req.user.deviceList
		});
	}
};

module.exports = Dashboard;

