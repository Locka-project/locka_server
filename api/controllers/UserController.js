/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function(){

    },

    getDivicesByUser: function(req, res){
        User.findBy({id:req}).populate('deviceList').exec(function(err, users){

        })
    },

};

