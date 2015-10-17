
function LogSrvc(){

    return{
        create: function(log){
            Log.create({user_id:log.user_id, device_id:(log.device_id ? log.device_id : 0), type:log.type, description:log.description}).exec(function createCB(err, created){
                if(err) {
                    console.log(err);
                    return err;
                }
                console.log(created);
            });
        }
    }
}

module.exports = LogSrvc();