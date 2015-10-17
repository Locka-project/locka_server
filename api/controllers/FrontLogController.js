/**
 * LogsController
 *
 * @description :: Server-side logic for managing Logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function FrontLogCtrl(){

  return{
    getLogByDevice: function(req, res){
      if(!req.isSocket){
        Log.find({id : req.params.id}).exec(function findLog(err, logList){
          if(err) {
            return res.json(err);
          }
          return res.json(logList);
        });
      }
    },
    /*getLogByDevice: function(req, res){
      if(!req.isSocket){
        Device.findOne({id : req.params.id}).exec(function findLog(errDvc, device){
          if(errDvc) {
            return errDvc;
          }
          Log.find({device: device}).exec(function foundLogCB(errLog, logs) {
            if(errLog) {
              return errLog;
            }
            return res.json(logs);
          });
        });
      }
    },*/
    /*getLogByUserByDevice: function(req, res){
      if(!req.isSocket){
        Device.find({userList : req.user}).exec(function findLog(errDvc, device){
          if(errDvc) {
            return errDvc;
          }
          for(var i=0; i<device.length; i++){
            Log.find({device: device[i]}).exec(function foundLogCB(errLog, logs) {
              if(errLog) {
                return errLog;
              }
              return res.json(logs);
            });
          }
        });
      }
    },*/
    getLogsByUser: function(req,res) {
      Log.find({user: req.user}).exec(function finLogCB(err, logList) {
        if(err) {
          return res.json(err);
        }
        if(!req.isSocket) {
          return res.json(logList);
        }
      });
    }
  }
}
module.exports = FrontLogCtrl();
