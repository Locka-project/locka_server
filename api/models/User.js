/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var User = {

  schema: true,

  attributes: {
    username:{
      type: 'string',
      required: true,
      unique: true,
      minLength: 3
    },
    email : {
      type: 'email',
      unique: true
    },
    passports : {
      collection: 'Passport',
      via: 'user'
    },
    password:{
      type: 'string',
      required: true,
    },
    deviceList:{
      collection: "device",
      via: 'userList'
    }
  }
};

module.exports = User;
