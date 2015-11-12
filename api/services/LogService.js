
function LogSrvc(){

  return{
    create: function(log){
      Log.create({user: log.user, device:log.device, type:log.type, description:log.description}).exec(function createCB(err, created){
        if(err) {
            return res.json(err);
        }
        // Put user and device on response
        Log.findOne({id:created.id}).populate('user').populate('device').exec(function(err, log){
	        if(err) {
            return res.json(err);
        	}
	        Log.publishCreate({id:created.id,log:log});
        });
      });
  	}
	}
}

module.exports = LogSrvc();