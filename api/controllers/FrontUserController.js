/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function FrontUserCtrl(){

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
            User.update({id: req.allParams().id}, {password: req.allParams().password}).exec(function pwdUpdateCB(err, updated) {
                if (err) {
                    var log = "Error : " + err + " trying to change user password.";
                    console.log(log);
                    return res;
                }
                var log = "User password correctly updated."
                console.log(log);
                return res.json(updated);
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
            User.find({email: req.allParams().email}).exec(function findCB(err, found) {
                if (err) {
                    var log = "Error : " + err + " trying to find user.";
                    console.log(log);
                    return res;
                }
                var newPassword = "";
                var generator = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789"
                for (var i = 0; i < 8; i++)
                    newPassword += generator.charAt(Math.floor(Math.random() * generator.length));
                User.update({id: found[0].id}, {password: newPassword}).exec(function pwdUpdateCB(err, updated) {
                    if (err) {
                        var log = "Error : " + err + " trying to update user.";
                        console.log(log);
                        return res;
                    }
                });
                EmailService.forgetPassword({email: 'test@test.com', name: 'test'});
                var log = "New password generated for user of id " + found[0].id + " : " + newPassword/*.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)*/;
                console.log(log);
                return res;
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
    }
}
module.exports = FrontUserCtrl();
