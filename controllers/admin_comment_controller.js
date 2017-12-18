var checkLogin = require('../util/checkLogin');
var comment_dao = require('../dao/comment_dao');
var Comment = require('../entities/comment');
var fs = require('fs-extra');

module.exports = function(app, io){

	app.get('/admin/comment', checkLogin.ensureAuthenticated, function(req, res){
		var msg = "";
		var st = "";
		if(req.param('msg') !== undefined){
			msg = req.param('msg');
			if(msg == 3){
				msg = "Delete success";
				st = "success";
			}else if(msg == 0){
				msg = "Could not delete comment";
				st = "error";
			}else{
				msg = "There is something wrong";
				st = "error";
			}
		}
		comment_dao.getCommentsAdmin(function(results){
			if( results !== undefined && results.length !== "" ){
				res.render('pages/admin/comment/index', {user:req.user,comments: results, msg: msg, st: st});
			}else{
				res.render('pages/admin/comment/index', {user:req.user,msg: msg, st: st});
			}

		});
	})

    app.get('/admin/comment/delete', checkLogin.ensureAuthenticated, function(req, res){
		if(req.param('id') !== undefined){
			var id = req.param('id');
			comment_dao.deleteComment(id, function(result){
				if(result.affectedRows > 0){
                    res.redirect("/admin/comment/?msg=3");
                }else{
                    res.redirect("/admin/comment/?msg=0");
                }
			})
		}
	})

	app.post('/admin/comment/delete', checkLogin.ensureAuthenticated, function(req, res){

		var arrid = req.body.item.toString().split(",");
		var check = false;
		for(var i = 0; i < arrid.length; i++){
			if(arrid[i] !== ""){
				comment_dao.deleteComment(arrid[i], function(result){
					if(result.affectedRows > 0){
	                    check = true;
	                }else{
	                    check = false;
						return;
	                }
				})
			}
		}
		setTimeout(function(){
			if(check === true){
				res.redirect("/admin/comment/?msg=3");
			}else{
				res.redirect("/admin/comment/?msg=0");
			}
		}, 1000);
	})

	var namespace = io.of("/admin/comment");
	namespace.on("connection", function(socket){
	
	socket.on("index", function(data){
	var path;
	var id = data.id;
	var status;
	if(data.message == "1") {
			path = "/admin/images/deactive.gif";
			status = 0;
	}
	else {
			path = "/admin/images/active.gif";
			status = 1;
	}
			comment_dao.updateCommentStatus(id, status, function(result) {
					if(result.affectedRows > 0) {
							namespace.emit("index", {path : path, id : id});
					}
			});
		});
	});
}
