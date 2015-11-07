/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
	// Import crypto for accessToken
	var crypto    = require('crypto');
	// It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.services.passport.loadStrategies();
  
  // Create Admin user is not exist
  User.findOne({username: 'admin'}).exec(function(err, found){
	  if(err) {
		  console.log(err)
	  } else {
		  if(!found){
				User.create({username: 'admin', firstname: 'Locka', lastname: 'Admin', email: 'contact@locka.com'}).exec(function (err, user){
					if(err){
						console.log(err);
					} else {
						var token = crypto.randomBytes(48).toString('base64');
						
						Passport.create({protocol: 'local', password: 'admin', user: user.id, accessToken: token}).exec(function (err, passport){
							if(err){
								console.log(err)
							}
						});
					}
				});
		  }
	  }
  })
  
  cb();
};
