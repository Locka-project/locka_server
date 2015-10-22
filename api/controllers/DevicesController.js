/**
 * DevicesController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getUsersByDivice: function(req, res){
        Devices.findBy({id:req}).populate('userList').exec(function(err, divices){

        })
    },

};

