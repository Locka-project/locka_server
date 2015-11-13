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

  function findPassport(req, res, callback){
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
          apiKey: passport.accessToken,
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
          return res.json(err);
        }
        return res.redirect('/user');
      });
    },
    changePassword: function (req, res) {
      if(req.allParams().password != req.allParams().confirm){
        return res.redirect('/user');
      }
      findPassport(req.user, res, function(err, passport){
        if(err){
          return res.json(err);
        }
        passport.password = req.allParams().password;
        passport.save();
      });
      return res.redirect('/user');
    },

    forgetPassword: function (req, res) {
      return res.view('user/forgetPassword');
    },

    delete: function (req, res) {
      User.find({id: req.allParams().id}).exec(function foundCB(err, found) {
        if (err) {
          return res.json(err);
        }
        if (found[0].id == null) {
          return err;
        }
        User.destroy({id: req.allParams().id}).exec(function deleteCB(err) {
          if (err) {
            return res.json(err);
          }
          return res.redirect('/');
        });
      });
    },

    sendNewPassword: function(req, res){
      User.find({email:req.allParams().email}).exec(function findCB(err, found){
        if(err){
          return res.json(err);
        }

        var newPassword = generatePassword();
        findPassport(found[0], res, function(err, passport){
          if(err){
            return res.json(err);
          }
          passport.password = newPassword;
          passport.save();
        });

        var response = EmailService.forgetPassword(found[0], newPassword);
        if(response != true){
          return res.json(err);
        }
        return res.redirect('/login');
      });
    },

    getAllUsers: function (req, res) {
      User.find({}).exec(function findCB(err, found) {
        if (err) {
          return res.json(err);
        }
        return res.json(found);
      });
    },

    getDevicesByUser: function (req, res) {
      User.findOne({id: req.user.id}).populate('deviceList').exec(function (err, user) {
        if (err) {
          return res.json(err);
        }
				return res.json(user.deviceList);
      });
    },

    getUserById: function (req, res) {
      User.findOne({id: req.params.id}).exec(function (err, user) {
        if (err) {
          return res.json(err);
        }
        return res.json(user);
      });
    },
    
    getUserByUsername: function (req, res) {
	    var userName = req.params.username.toLowerCase();
      User.findOne({username: userName}).exec(function (err, user) {
        if (err) {
          return res.json(err);
        }
        return res.json(user);
      });
    },

    getUserLogs: function(req, res) {
      if(!req.isSocket){
        Device.find().populate('userList', {id: req.user.id}).exec(function (errDvc, devices) {
          if (errDvc) {
            return res.json(errDvc);
          }
          Log.find().populate('user').populate('device', {id: _.pluck(devices, 'id')}).exec(function (errLog, logs) {
            if (errLog) {
              return res.json(errLog);
            }
            return res.json(logs);
          });
        });
      } else {
        Log.watch(req);
        return res.json({msg: 'success'});
      }
    }
  }
}
module.exports = FrontUserCtrl();
