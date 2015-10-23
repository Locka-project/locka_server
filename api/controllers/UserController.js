/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    myAccount: function(req, res){
        return res.view('user/myAccount', {
            user: req.user
        });
    },

    update: function(req, res){
        User.update({id:req.allParams().id}, {email:req.allParams().email, username:req.allParams().username, lastname:req.allParams().lastname, firstname:req.allParams().firstname}).exec(function afterwards(err, updated){
            if (err) {
                res = "Error : " + err + " trying to update user.";
                console.log(res);
                return res;
            }
            res = "User correctly updated."
            console.log(res);
            res.redirect('/user');
        });
    },
    changePassword: function(req,res){
            User.update({id: req.allParams().id}, {password: req.allParams().password}).exec(function pwdUpdateCB(err, updated) {
                if (err) {
                    res = "Error : " + err + " trying to change user password.";
                    console.log(res);
                    return res;
                }
                res = "User password correctly updated."
                console.log(res);
                return updated;
            });
    },
    delete: function(req, res){
        User.find({id: req.allParams().id}).exec(function foundCB(err,found){
            if(err){
                res = "Error : " + err + " trying to find user with id " + req.allParams().id;
                console.log(res);
                return res;
            }
            if(found[0].id == null){
                res = "No user with id " + req.allParams().id + ".";
                console.log(res);
                return res;
            }
            User.destroy({id: req.allParams().id}).exec(function deleteCB(err){
                if(err){
                    res = "Error : " + err + " trying to delete user " + found[0].name;
                    console.log(res);
                    return res;
                }
                res = "User " + found[0].name + " correctly deleted.";
                console.log(res);
                return res;
            });
        });
    },

    getAllUsers: function(req, res){
        User.find({}).exec(function findCB(err, found){
            if(err){
                res = "Error : " + err + " trying to list all users.";
                console.log(res);
                return res;
            }
            res = "Users correctly deleted.";
            console.log(res);
            return found;
        });
    },

    getDevicesByUser: function(req, res){
        User.find({id:req.allParams().id}).populate('deviceList').exec(function(err, devices){
            if(err){
                res = "Error : " + err + " trying to list all users.";
                console.log(res);
                return res;
            }
            res = "Users correctly deleted.";
            console.log(res);
            return devices;
        })
    },

};

