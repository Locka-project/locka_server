/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function FrontUserCtrl(){

  function generatePassword(req, res){
    var newPassword = "";
    var generator = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789"
    for (var i = 0; i < 8; i++)
      newPassword += generator.charAt(Math.floor(Math.random() * generator.length));
    return newPassword;
  }

  function findPassport(req,res, callback){
    Passport.find({user:req.id, protocol:'local'}).exec(function findCB(err, passport){
      if(err){
        callback(err);
      }
      callback(err, passport[0]);
    });
  }

  return {
    //controller actions
    myAccount: function (req, res) {
      findPassport(req.user, res, function(err, passport){
        return res.view('user/myAccount', {
          user: req.user,
          passport: passport,
        });
      });
    },

    update: function (req, res) {
      User.update({id: req.allParams().id}, {
        email: req.allParams().email,
        username: req.allParams().username,
        lastname: req.allParams().lastname,
        firstname: req.allParams().firstname
      }).exec(function afterwards(err, updated) {
        if (err) {
          var log = "Error : " + err + " trying to update user.";
          console.log(log);
          return res;
        }
        var log = "User correctly updated."
        console.log(log);
        res.redirect('/user');
      });
    },
    changePassword: function (req, res) {
      if(req.allParams().password != req.allParams().confirm){
        return res.redirect('/user');
      }
      findPassport(req.user, res, function(err, passport){
        if(err){
          res = "Error : " + err + " trying to find user.";
          console.log(res);
          return res;
        }
        passport.password = req.allParams().password;
        passport.save();
      });
      res.redirect('/user');
    },

    forgetPassword: function (req, res) {
      return res.view('user/forgetPassword');
    },

    sendNewPassword: function(req, res){
      User.find({email:req.allParams().email}).exec(function findCB(err, found){
        if(err){
          res = "Error : " + err + " trying to find user.";
          console.log(res);
          return res;
        }

        var newPassword = generatePassword();
        findPassport(found[0], res, function(err, passport){
          if(err){
            res = "Error : " + err + " trying to find user.";
            console.log(res);
            return res;
          }
          passport.password = newPassword;
          passport.save();
        });
        res.redirect('/user');
      });
		},
		
		delete: function (req, res) {
			User.find({id: req.allParams().id}).exec(function foundCB(err, found) {
				if (err) {
						var log = "Error : " + err + " trying to find user with id " + req.allParams().id;
						console.log(log);
						return res;
				}
				if (found[0].id == null) {
						var log = "No user with id " + req.allParams().id + ".";
						console.log(log);
						return res;
				}
				User.destroy({id: req.allParams().id}).exec(function deleteCB(err) {
						if (err) {
								var log = "Error : " + err + " trying to delete user " + found[0].name;
								console.log(log);
								return res;
				}
						var log = "User " + found[0].name + " correctly deleted.";
						console.log(log);
						return res;
				});
			});
		},

		forgetPassword: function (req, res) {
				return res.view('user/forgetPassword');
		},

		sendNewPassword: function(req, res){
			User.find({email:req.allParams().email}).exec(function findCB(err, found){
				if(err){
					res = "Error : " + err + " trying to find user.";
					console.log(res);
					return res;
				}
	
				var newPassword = generatePassword();
	      findPassport(found[0], res, function(err, passport){
	        if(err){
	          res = "Error : " + err + " trying to find user.";
	          console.log(res);
	          return res;
	        }
	        passport.password = newPassword;
	        passport.save();
	      });
	
	      var response = EmailService.forgetPassword(found[0], newPassword);
	      if(response != true){
	        res = "Error : " + err + " trying to send mail.";
	        console.log(res);
	        return res;
	      }
	
				return res.redirect('/login');
			});
		},

    getAllUsers: function (req, res) {
      User.find({}).exec(function findCB(err, found) {
        if (err) {
          var log = "Error : " + err + " trying to list all users.";
          console.log(log);
          return res;
        }
        var log = "Users correctly listed.";
        console.log(log);
        return res.json(found);
      });
    },

    getDevicesByUser: function (req, res) {
      User.find({id: req.allParams().id}).populate('deviceList').exec(function (err, devices) {
        if (err) {
          var log = "Error : " + err + " trying to list all users.";
          console.log(log);
          return res;
        }
        var log = "Users correctly deleted.";
        console.log(log);
        return res.json(devices);
      })
    },
    
    subscribe: function(req,res){
			if(req.req.isSocket){
				var deviceList = getDevicesByUser(req.user.id);
				
				sails.log(deviceList);
			}
		},
  }
}
module.exports = FrontUserCtrl();
