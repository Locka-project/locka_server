/**
 * IdentifierController
 *
 * @description :: Server-side logic for managing locks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getLock: function(req, res) {
		Identifier.findOne({id: req.params.id}).exec(function(err, lock){
			if(err) return res.json({msg: 'error'})
			return res.json(lock)
		})
	}
};

