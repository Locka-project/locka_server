/**
 * WishController
 *
 * @description :: Server-side logic for managing wishes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	countWish: function (req, res) {
		widh.count({name:'iphone'}).exec(function(err, count){
			if(err)return;
			return res.send(count);
		});
	},

	addWish: function (req, res) {
			var owner = req.query.user;
			var name = req.param('name');
			Wish.create({name:name, owner:owner}).exec(function(err, wish){
				
			})
	}

};
