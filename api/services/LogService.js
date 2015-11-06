
function LogSrvc(){

    return{
        create: function(log){
            Log.create({user: log.user, device:log.device, type:log.type, description:log.description}).exec(function createCB(err, created){
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