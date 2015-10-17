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
            return res.json(err);
          }
          return res.json(logList);
        });
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
      getLogsByUser: function(req,res) {
        Log.find({user_id: req.user.id}).exec(function finLogCB(err, logList) {
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
module.exports = LogCtrl();
