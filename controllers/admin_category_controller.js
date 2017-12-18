var checkLogin = require('../util/checkLogin');
var category_dao = require('../dao/category_dao');
var Category = require('../entities/category');
var time_stamp = require('time-stamp');

module.exports = function(app){

    app.get('/admin/category', checkLogin.ensureAuthenticated, function(req, res){
        var msg = "";
		var st = "";
        if(req.param('msg') !== undefined && req.param('msg') !== ""){
            msg = req.param('msg');
            if(msg == 1){
                msg = "Add success";
                st = "success";
            }else if(msg == 2) {
                msg = "Edit success";
				st = "success";
            }else if(msg == 3){
				msg = "Delete success";
				st = "success";
			}else if(msg == 0){
				msg = "Could not delete category";
				st = "error";
			}else{
				msg = "There is something wrong";
				st = "error";
			}
        }
        category_dao.getCategories(function(results){
            if(results !== undefined && results.length > 0){
                res.render('pages/admin/categories/index', {user:req.user,categories: results, msg: msg, st: st});
            }else{
                res.render('pages/admin/categories/index', {user:req.user,msg: msg, st: st});
            }
        });

    })

    app.get('/admin/category/add', checkLogin.ensureAuthenticated, function(req, res){
        res.render("pages/admin/categories/add",{user:req.user});
    })

    app.get('/admin/category/edit', checkLogin.ensureAuthenticated, function(req, res){
       
        if(req.param('id') !== undefined ){
            var id = req.param('id');
            category_dao.getCategory(id, function(category){
                if(category.getMId() !== null){
                    res.render('pages/admin/categories/edit', {user:req.user,category: category});
                }else{
                    res.redirect("/admin/category");
                }
            });
        }else{
            res.redirect("/admin/category");
        }
    })

    app.get('/admin/category/delete', checkLogin.ensureAuthenticated, function(req, res){
        if( req.param('id') !== undefined){
            var id =  req.param('id');
            category_dao.deleteCategory(id, function(result){
                if(result.affectedRows > 0){
                    res.redirect("/admin/category/?msg=3");
                }else{
                    res.redirect("/admin/category/?msg=0");
                }
            });
        }
    })

    app.post('/admin/category/add', checkLogin.ensureAuthenticated, function(req, res){
        var nameCategory = req.body.name;
        var dateCreat = time_stamp('YYYY-MM-DD HH:mm:ss');
        var category = new Category(0, nameCategory, dateCreat, dateCreat);

        if(nameCategory == ""){
            res.render('pages/admin/categories/add', {user:req.user,category: category, msg: "errnull"});
        }else if( nameCategory.length > 50){
            res.render('pages/admin/categories/add', {user:req.user,category: category, msg: "errlength"});
        }else{
            category_dao.getCategoryByName(nameCategory, function(result){

                if(result > 0){
                    res.render('pages/admin/categories/add', {user:req.user,category: category, msg: "errexists"});
                }else{
                    category_dao.addCategory(category, function(result){
                        var result = result;
                        if(result.affectedRows > 0){
                            res.redirect("/admin/category/?msg=1");
                        }else{
                            res.render('pages/admin/categories/add', {user:req.user,category: category, msg: "erradd"});
                        }
                    });
                }
            });
        }
    })

    app.post('/admin/category/edit', checkLogin.ensureAuthenticated, function(req, res){
        if(req.param('id') !== undefined ){
            var id = req.param('id');
            var name = req.body.name;
            var dateUpdate = time_stamp('YYYY-MM-DD HH:mm:ss');
            var category = new Category(id, name, 0, dateUpdate);

            if(name == ""){
                res.render('pages/admin/categories/edit', {user:req.user,category: category, msg: "errnull"});
            }else {
                category_dao.getCategoryByNameOtherID(category, function(result){

                    if(result > 0){
                        res.render('pages/admin/categories/edit', {user:req.user,category: category, msg: "errexists"});
                    }else{
                        category_dao.editCategory(category, function(result){
                            if(result.affectedRows > 0){
                                res.redirect("/admin/category/?msg=2");
                            }else{
                                res.render('pages/admin/categories/edit', {user:req.user,category: category, msg: "erredit"});
                            }
                        });
                    }
                });

            }
        }
    })

    app.post('/admin/category/delete', checkLogin.ensureAuthenticated, function(req, res){

        var arrid = req.body.item.toString().split(",");
        var check = false;
        for(var i = 0; i < arrid.length; i++){
            if(arrid[i] !== ""){
                category_dao.deleteCategory(arrid[i], function(result){
                    if(result.affectedRows > 0){
                        check = true;
                    }else{
                        check = false;
                        return
                    }
                })
            }
        }
        setTimeout(function(){
            if(check === true){
                res.redirect("/admin/category/?msg=3");
            }else{
                res.redirect("/admin/category/?msg=0");
            }
        }, 1000);
    })
}
