
function LogSrvc(){

  return{
    create: function(log){
      Log.create({user: log.user, deviceId:log.deviceId, type:log.type, description:log.description}).exec(function createCB(err, created){
        if(err) {
          return console.log(err);
        }
        // Put user and device on response
        Log.findOne({id:created.id}).populate('user').populate('device').exec(function(err, found){
	        if(err) {
            return res.json(err);
        	}
        	Device.findOne({id: log.deviceId}).exec(function(err,deviceFound){
	        	if(err){
		        	return console.log(err);
	        	}
	        	if(deviceFound != null){
		        	deviceFound.logList.add(found);
							deviceFound.save(function(err, last){
								Device.publishUpdate(last.id,last);
							});
	        	}
        	});  
        });
      });
  	}
	}
}

module.exports = LogSrvc();