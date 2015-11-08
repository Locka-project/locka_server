/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  } else {
	  // Fix warnings
	  if(req.route.path != '/user/getDevicesByUser' && req.route.path != '/socket/devices/subscribe' && req.route.path != '/device/logs' && req.route.path != '/socket/users/logs/subscribe') {
		  res.redirect('/login')
	  }
// 	  return res.redirect('/login');
  }
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
	//  return res.forbidden('You are not permitted to perform this action.');
};
