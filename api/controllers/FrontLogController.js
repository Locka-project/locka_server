/**
 * LogsController
 *
 * @description :: Server-side logic for managing Logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function LogCtrl(){

  return{
    getLogByDevice: function(req, res){
      Log.find({id : req.allParams().id}).exec(function findLog(err, logList){
        if(err) {
          var log = "Error : " + err + " trying to list log by device.";
          console.log(log);
          return res;
        }
        var log = "Log correctly listed."
        console.log(log);
        return res.json(logList);
      });
    },
    getLogsByUser: function(req,res) {
      Log.find({user_id: req.user.id}).exec(function finLogCB(err, logList) {
        if(err) {
          var log = "Error : " + err + " trying to list log by user.";
          console.log(log);
          return err;
        }
        if(!req.isSocket) {
          return res.json(logList);
        } else {
          
        }
      });
    }
  }
}
module.exports = LogCtrl();
