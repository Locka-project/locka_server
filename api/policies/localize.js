module.exports = function(req, res, next) {
  req.setLocale(req.param('lang'));
  next();
}; 
