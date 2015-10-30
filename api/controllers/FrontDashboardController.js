/**
 * DashboardControllerFront
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
  
var Dashboard = {
		
	getDashboard:function(req,res){
		
 		function getDevices(callback){
	 		Device.find({}).exec(function findCB(err, found){
				if(err) {
					return err;
				}
				callback(found);
			});
		};	
		
		getDevices(function(devices){
			
			return res.view('dashboard', {
				user: req.user,
				device: devices
			});
		});		
	}
};

module.exports = Dashboard;

