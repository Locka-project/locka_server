
function LogSrvc(){

    return{
        create: function(log){
            Log.create({type:log.type, description:log.description}).exec(function createCB(err, created){
                if(err) return;
                return created;
            });
        }
    }
}

module.exports = LogSrvc();