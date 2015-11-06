/**
* Devices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type: 'string',
      required: true,
      minLength: 3
    },
    state:{
      type: 'string',
      required: true,
    },
    connected:{
      type: 'boolean',
      required: true,
    },
    identifier: {
      model: 'lock',
    },
    userList:{
      collection: "user",
      via: 'deviceList'
    }
  }
};

