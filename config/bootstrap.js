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
	
	// Create Admin user
	User.create({username: 'admin', firstname: 'Locka', lastname: 'Admin'}).exec(function (err, user){
		if(err){
			console.log(err);
		} else {
			Passport.create({password: 'admin', user: user.id, protocol: 'local'}).exec(function (err, passport){
				if(err){
					console.log(err)
				}
			})
		}
	})

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.services.passport.loadStrategies();
  cb();
};
