/**
* ShareLock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	  owner: {
      model: 'user',
      required: true,
    },
    device: {
      model: 'device',
      required: true,
    },
    user: {
      model: 'user',
      required: true,
    },
    sharedKey: {
      type: 'string',
      unique: true,
    },
    activate: {
	    type: 'boolean',
	    defaultsTo: false
    }
  },
};

