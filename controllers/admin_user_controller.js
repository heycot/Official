const user_dao = require("../dao/user_dao");
const role_dao = require("../dao/role_dao");
const User = require("../entities/user");
const hash = require('../util/StringUtil');
var checkLogin = require('../util/checkLogin');
var error = {
    erusername : "",
    erpassword : "",
    eremail : "",
    erfullname : ""
};


module.exports = function(app){
    app.get("/admin/user", checkLogin.ensureAuthenticated, function(req, res){
        if(req.user.mRoleId != 1){
            res.redirect("/admin");
        }
        var msg = req.query.msg;
        user_dao.getUsers(function(result) {
            res.render("pages/admin/users/index", {user:req.user,users : result, msg : msg});
        });
    });

    app.get("/admin/user/add", checkLogin.ensureAuthenticated, function(req, res, next){
        if(req.user.mRoleId != 1){
            res.redirect("/admin");
        }
        role_dao.getRoles(function(result) {
            res.render("pages/admin/users/add", {roles: result, user:req.user});
        }); 
    });

    app.post("/admin/user/add", checkLogin.ensureAuthenticated, function(req, res, next){
        if(req.user.mRoleId != 1){
            res.redirect("/admin");
        }
        var user = new User(0, req.body.username, req.body.fullname, req.body.email, req.body.password, req.body.role_id, "");
        var kt = 0
        if( req.body.username == "") {
            kt = 1;
            error.erusername = "Please enter this field";
        } else if(req.body.username.length < 6){
            kt = 1;
            error.erusername = "The length of username must be longer than 6";
        } 
        if( req.body.password == "") {
            kt = 1;
            error.erpassword = "Please enter this field";
        } else if(req.body.password.length < 6) {
            kt = 1;
            error.erpassword = "The length of fullname must be longer than 6";
        } 
        if( req.body.fullname == "") {
            kt = 1;
            error.erfullname = "Please enter this field"
        }
        if( req.body.email == "") {
            kt = 1;
            error.eremail = "Please enter this field";
        }
        user_dao.getUserByUsername(user.getMUsername(), function(result) {
            if(result != "") {
                kt = 1;
                error.erusername = "Usename is existed";
            }
            if(kt == 1) {
                role_dao.getRoles(function(result1){
                    res.render("pages/admin/users/add", {user:req.user,roles: result1, newuser: user, error: error});
                });
            } else {
                hash.hashPassword(user.getMPassword(), function(result3) {
                    user.setMPassword(result3);
                    user_dao.addUser(user,function(result2){
                        if(result2 != 0) {
                            res.redirect("/admin/user?msg=1");
                        } else {
                            res.redirect("/admin/user?msg=0");
                        }
                    })
                });  
            } 
        });
        
    });

    
    app.get("/admin/user/edit/:id", checkLogin.ensureAuthenticated, function(req, res, next){
        if(req.user.mRoleId == 1 || req.user.mId == req.params.id){
            
            var roles = new Array();
            role_dao.getRoles(function(roles){
                user_dao.getUserById(req.params.id, function(result) {
                    if(result != "") {
                        res.render("pages/admin/users/edit", {user:req.user, edituser : result, roles: roles});
                    } else {
                        res.redirect("/404");
                    }
                });
            })  
        }else{
            res.redirect("/admin");
        }
        
    });

    app.get("/admin/profile", checkLogin.ensureAuthenticated, function(req, res, next){
        role_dao.getRoles(function(roles){
            res.render("pages/admin/users/profile", {user: req.user, roles : roles});
        })
       
    });

    app.post("/admin/user/edit/:id", checkLogin.ensureAuthenticated, function(req, res, next){
        var user = new User(req.params.id, req.body.username, req.body.fullname, req.body.email, req.body.password, req.body.role_id, "");
        var kt = 0;  
        if( req.body.fullname == "") {
            kt = 1;
            error.erfullname = "Please enter this field"
        }
        if( req.body.email == "") {
            kt = 1;
            error.eremail = "Please enter this field";
        }
        user_dao.getUserByUsernameExceptId(user.getMUsername(), user.getMId(), function(result) {
            if(result != "") {
                kt = 1;
                error.erusername = "Username is existed";
            }
            if(kt == 1) {
                role_dao.getRoles(function(result1){
                    res.render("pages/admin/users/edit", {user:req.user,roles: result1, edituser: user, error: error});
                });
            } else {
                if(user.getMPassword() != "") {
                    hash.hashPassword(user.getMPassword(), function(result5){
                        user.setMPassword(result5);
                        user_dao.editUser(user,function(result2){
                            if(result2 != 0) {
                                res.redirect("../../user?msg=2");
                            } else {
                                res.redirect("../../user?msg=0");
                            }
                        }); 
                    });
                } else {
                    user_dao.getUserById(req.params.id, function(result4) {
                        var oldUser = result4;
                        user.setMPassword(oldUser.getMPassword());
                        user_dao.editUser(user,function(result2){
                            if(result2 != 0) {
                                res.redirect("../../user?msg=2");
                            } else {
                                res.redirect("../../user?msg=0");
                            }
                        }); 
                    }); 
                }
                
            } 
        });
        
    });

    app.get("/admin/user/del/:id", checkLogin.ensureAuthenticated, function(req, res, next){
        if((req.user.mRoleId == 1 && req.user.mId == req.params.id) || req.user.mRoleId != 1){
            res.redirect("../../user?msg=4");
        }else{
           user_dao.deleteUser(req.params.id, function(result) {
            if(result != 0) {
                res.redirect("../../user?msg=3");
            } else {
                res.redirect("../../user?msg=0");
            }
        });  
        }
        
    });
}