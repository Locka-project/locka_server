/**
 * authSocket Policy
 * 
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

module.exports = function (req, res, next) {
	
	if(req.param('access_token')){
		Passport.findOne({accessToken: req.param('access_token')}).populate('user', {email: req.param('email')}).exec(function findOneCB(err, passport){
			if(err) return res.json(err)
			if(passport) {
				req.user = passport.user;
				return next()
			} else {
				return res.json({msg: 'your token is invalid'})
			}
		});
	} else {
		return res.json({msg: 'Error access_token is not defined'})
	}
};
