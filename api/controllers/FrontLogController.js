/**
 * LogsController
 *
 * @description :: Server-side logic for managing Logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function LogCtrl(){

    return{
      getLogByDevice: function(req, res){
        if(!req.isSocket){
          Log.find({id : req.params.id}).exec(function findLog(err, logList){
            if(err) {
              var log = "Error : " + err + " trying to list log by device.";
              return res;
            }
            return res.json(logList);
        });
      }
   }
  }
}
module.exports = LogCtrl();
