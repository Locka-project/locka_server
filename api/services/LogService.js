
function LogSrvc(){

    return{
        create: function(log){
            Log.create({user_id:log.user_id, device_id:log.device_id, type:log.type, description:log.description}).exec(function createCB(err, created){
                if(err) return;
            });
        }
    }
}

module.exports = LogSrvc();