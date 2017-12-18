var express = require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser');
var app = express();
var port = 8080;
var flash = require('connect-flash');
var cookie= require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multer  = require('multer');
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './util');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage : storage })

app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true,
	cookie: {
		maxAge : 1000 * 3600 * 24 * 30
	}
}));
app.use(flash());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//global vars.
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.message = req.flash('message');
	res.locals.user = req.user || null;
	next();
});


app.use(passport.initialize());
app.use(passport.session());
var adminBookController = require("./controllers/admin_book_controller");
var adminCategoryController = require("./controllers/admin_category_controller");
var adminCommentController = require("./controllers/admin_comment_controller");
var adminSeriesController = require("./controllers/admin_series_controller");
var adminIndexController = require("./controllers/admin_index_controller");
var adminUserController = require("./controllers/admin_user_controller");
var publicBookController = require("./controllers/public_controller");
var authorController = require("./controllers/auth_controller");

app.set("view engine", "ejs");
app.set("views", "./views")
app.use(express.static(__dirname + '/templates'));

adminBookController(app, io, urlencodedParser, upload);
adminCommentController(app, io);
adminUserController(app);
publicBookController(app, urlencodedParser, upload);
authorController(app);
adminCategoryController(app);
adminSeriesController(app);
adminIndexController(app);

server.listen(port, function(){
	console.log("started");
})

app.use(function(req, res, next) {
     var err = new Error('Not Found');
    err.status = 404;
     next(err);
 });

app.use(function(err, req, res, next) {
   res.status(err.status || 500);
    res.render('pages/public/404.ejs');
});
