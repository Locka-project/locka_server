/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function UserCtrl(){
  function generatePassword(req, res){
    var newPassword = "";
    var generator = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789"
    for (var i = 0; i < 8; i++)
      newPassword += generator.charAt(Math.floor(Math.random() * generator.length));
    return newPassword;
  }

  return {
    show: function (req, res) {
      User.findOne({id: req.allParams().id}).exec(function (err, user) {
        if (err) {
          return res.json(err);
        }
        res.json(user);
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
        User.publishUpdate(updated[0].id,{ name:updated[0].username });
        res.json({msg: "success"});
      });
    },

    changePassword: function (req, res) {
      User.update({id: req.allParams().id}, {password: req.allParams().password}).exec(function pwdUpdateCB(err, updated) {
        if (err) {
          return res.json(err);
        }
        return res.json(updated);
      });
    },

    delete: function (req, res) {
      User.find({id: req.allParams().id}).exec(function foundCB(err, found) {
        if (err) {
          return res.json(err);
        }
        if (found[0].id == null) {
          return res.json({msg : 'id not found'});
        }
        User.destroy({id: req.allParams().id}).exec(function deleteCB(err) {
          if (err) {
            return res.json(err);
          }
          return res.json({msg: 'success'});
        });
      });
    },

    forgetPassword: function (req, res) {
      return res.view('user/forgetPassword');
    },

    sendNewPassword: function(req, res){
      User.find({email:req.allParams().email}).exec(function findCB(err, found){
        if(err){
          return res.json(err);
        }
        var newPassword = generatePassword();

        User.update({id:found[0].id}, {password:newPassword}).exec(function pwdUpdateCB(err,updated){
          if(err){
            return res.json(err);
          }
          var response = EmailService.forgetPassword(updated[0], newPassword);
          if(!response){
            return res.json({msg: 'email not sent'});
          }
        });
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

    getMyLock: function(req, res){
			if(!req.isSocket) return res.json({msg: "is not a Socket"});
			if(!req.user) return res.json({msg: "user is not defined"});

			User.findOne({id:req.user.id}).populate('deviceList').exec(function findOneCB(err, user){
				if(err) return res.json(err)
				Device.subscribe(req, _.pluck(user.deviceList, 'id'));
				return res.json({msg: "success"});
			});
		}
  }
}

module.exports = UserCtrl();
