/**
* Logs.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    //type {Error,Warning,Create,Update,Delete,Open,Close}
    user_id:{
      type: 'number',
      required: true,
    },
    device_id:{
      type: 'number',
    },
    type:{
      type: 'string',
      required: true,
      minLength: 3,
    },
    description:{
      type: 'text',
      required: true,
    }
  }
};

