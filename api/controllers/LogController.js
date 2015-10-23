/**
 * LogsController
 *
 * @description :: Server-side logic for managing Logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function LogCtrl(){

    return{
        create:function(req,res){
            Log.create({type:req.allParams().type, description:req.allParams().description}).exec(function createCB(err, created){
                if(err) return;
                var log = "Log correctly created."
                console.log(log);
                return created;
            });
        }
    }
}
module.exports = LogCtrl();

