/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    index: function(req, res){
        User.find({id:req}).exec(function findCB(err, found){
            if(err)return;
            return found;
        });
    },

    create: function(req, res){
        User.create({email:req.allParams().emails, username:req.allParams().username, password:req.allParams().password }).exec(function createCB(err, created){
            if(err)return;
            return created;
        });
    },

    update: function(req, res){
        User.update({email:req.allParams().emails, username:req.allParams().username, password:req.allParams().password}).exec(function afterwards(err, updated){
            if(err)return;
            return updated;
        });
    },

    delete: function(req, res){
        User.destroy({id: req}).exec(function deleteCB(err){
            if(err)return;
        });
    },

    getAllUsers: function(req, res){
        User.find({}).exec(function findCB(err, found){
            if(err)return;
            return found;
        });
    },

    getDevicesByUser: function(req, res){
        User.findBy({id:req}).populate('deviceList').exec(function(err, users){
            if(err)return;
            return users;
        })
    },

};

