const hash = require('../util/StringUtil');
const user_dao = require("../dao/user_dao");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require("../entities/user");
const url = require("url");

passport.use(new LocalStrategy({
    usernameField : 'username',
    passReqToCallback : true 
},
function(req, username, password, done) {
    process.nextTick(function() {
        req.flash('error', '');
        user_dao.getUserByUsername(username, function(user){
            if (user == "")
                return done(null, false, {message : 'User does not exist.'});

            hash.checkCorrectPassword(password, user.mPassword, function(isMatch){
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message : 'Enter incorrect password'});
                }
            });
        });
    });
}));


passport.serializeUser(function(user, done){
    done(null, user.mId);
});

passport.deserializeUser(function(id, done){
    user_dao.getUserById(id, function(user){
        done(null, user);
    })
})

module.exports = function(app){

    app.get('/login', function(req, res){
        res.render("author/admin_login");
    })

    app.post('/login', 
        passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), 
        function(req, res){
            var roleId = req.user.mRoleId;
            if (roleId == 1)
                res.redirect('/admin');
            else 
                res.redirect('/');
        })

    app.get('/admin/logout', function(req, res) {
        req.logout();
        req.flash('success_msg', "You are logged out");
        res.redirect('/login');
    })

    app.post('/logout', function(req, res) {
        req.session.destroy(function(err) {
          res.redirect("/");
      })
        
    })

    app.get("/signup", function(req, res){
      res.render("author/public_signup.ejs");
  })

    app.post("/signup", function(req, res, next){
        var user = new User(0, req.body.username, req.body.fullname, req.body.email, req.body.password, "3", "");
        var kt = 0
        user_dao.getUserByUsername(req.body.username, function(result) {
            if(result != "") {
                kt = 1;
            }
            if(kt == 1) {
                res.render("author/public_signup", {user: user, error_msg : "Usename is existed"});
            } else {
                hash.hashPassword(user.getMPassword(), function(result3) {
                    user.setMPassword(result3);
                    user_dao.addUser(user,function(result2){
                        if(result2 == 0) {
                            req.flash('error_msg', "Your register is fail");
                            res.redirect("/signup");
                        } else {
                            req.flash('success_msg', 'You are registered and can now login');
                            res.redirect('/login');
                        }
                    })
                });  
            } 
        });
        
    });
}