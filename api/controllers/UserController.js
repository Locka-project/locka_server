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
//controller actions
    myAccount: function (req, res) {
      return res.view('user/myAccount', {
        user: req.user
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
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to update user with id " + req.allParams().id});
          return res;
        }
        LogService.create({user_id: req.user.id, type: "Update", description: "User " + updated.username + " correctly updated."});
        User.publishUpdate(updated[0].id,{ name:updated[0].username });
        res.json({msg: "Successful..."});
      });
    },

    changePassword: function (req, res) {
      User.update({id: req.allParams().id}, {password: req.allParams().password}).exec(function pwdUpdateCB(err, updated) {
        if (err) {
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to change password of user with id " + req.allParams().id});
          console.log(log);
          return res;
        }
        LogService.create({user_id: req.user.id, type: "Update", description: "User " + updated.username + " password correctly updated."});
        return res.json(updated);
      });
    },

    delete: function (req, res) {
      User.find({id: req.allParams().id}).exec(function foundCB(err, found) {
        if (err) {
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to find user with id " + req.allParams().id});
          return res;
        }
        if (found[0].id == null) {
          LogService.create({user_id: req.user.id, type: "Error", description: "No user with id " + req.allParams().id + "."});
          return res;
        }
        User.destroy({id: req.allParams().id}).exec(function deleteCB(err) {
          if (err) {
            LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to delete user " + found[0].username});
            return res;
          }
          LogService.create({user_id: req.user.id, type: "Delete", description: "User " + found[0].username + " correctly deleted."});
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
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to find user with id " + req.allParams().id});
          return res;
        }
        var newPassword = generatePassword();

        User.update({id:found[0].id}, {password:newPassword}).exec(function pwdUpdateCB(err,updated){
          if(err){
            LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to update user " + found[0].username});
            return res;
          }
          LogService.create({user_id: req.user.id, type: "Update", description: "User " + updated.username + " correctly updated with a random password."});
          var response = EmailService.forgetPassword(updated[0], newPassword);
          if(!response){
            LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to send mail."});
            return res;
          }
          console.log(response);
          /*EmailService.forgetPassword(updated[0], newPassword).then(function emailCB(err, response){
           if(!response){
           res = "Error : " + err + " trying to send mail.";
           console.log(res);
           return res;
           }
           });*/
        });
        /* Password à hasher */
        /*res = "New password generated for user of id " + found[0].id + " : " + newPassword/!*.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)*!/;
         console.log(res);*/
        return res.redirect('/login');
      });
    },

    getAllUsers: function (req, res) {
      User.find({}).exec(function findCB(err, found) {
        if (err) {
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to list all users."});
          return res;
        }
        return res.json(found);
      });
    },

    getDevicesByUser: function (req, res) {
      User.find({id: req.user.id}).populate('deviceList').exec(function (err, devices) {
        if (err) {
          LogService.create({user_id: req.user.id, type: "Error", description: "Error : " + err + " trying to list user" + req.user.id + "devices."});
          return res;
        }
        return res.json(devices);
      })
    },

    getMyLock: function(req, res){
      if(!req.isSocket) return res.json({msg: "Nok User"});
      if(!req.user) return res.json({msg: "Nok Socket"});
      User.findOne({id:req.param('id')}).populate('deviceList').exec(function foundByUserCB(err, user){

        if(err) return res.json(err)
        Device.subscribe(req, _.pluck(user.deviceList, 'id'));
        res.json({msg: "sucess"});
      });
    }
  }
}

module.exports = UserCtrl();
