var checkLogin = require('../util/checkLogin');

module.exports = function(app){
	app.get('/admin', checkLogin.ensureAuthenticated, function(req, res){
		res.render("pages/admin/index/index",{user:req.user});
	})
	
}