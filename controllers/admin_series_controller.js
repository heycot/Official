var checkLogin = require('../util/checkLogin');
var series_dao = require('../dao/series_dao');
var Series = require('../entities/series');
var time_stamp = require('time-stamp');
var stringUtil = require('../util/StringUtil');

module.exports = function(app){
	app.get('/admin/series', checkLogin.ensureAuthenticated, function(req, res){
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
				msg = "Could not delete Series";
				st = "error";
			}else{
				msg = "There is something wrong";
				st = "error";
			}
        }
		series_dao.getListSeries(function(results){
			if( results !== undefined && results.length !== "" ){
				res.render('pages/admin/series/index', {stringUtil : stringUtil, user:req.user,listSeries: results, msg: msg, st: st});
            }else{
                res.render('pages/admin/series/index', {stringUtil : stringUtil, user:req.user,msg: msg, st: st});
            }

		});
	})

	app.get('/admin/series/add', checkLogin.ensureAuthenticated, function(req, res){
		res.render("pages/admin/series/add",{user:req.user});
	})

	app.get('/admin/series/edit', checkLogin.ensureAuthenticated, function(req, res){
		if(req.param('id') !== undefined ){
			var id = req.param('id');
			series_dao.getSeries(id, function(series){
				if(series.getMId() !== null){
					res.render('pages/admin/series/edit', {user:req.user,series: series});
				}else{
					res.redirect("/admin/series");
				}
			});
		}else{
			res.redirect("/admin/category");
		}
	})

    app.get('/admin/series/delete', checkLogin.ensureAuthenticated, function(req, res){
		if( req.param('id') !== undefined){
            var id =  req.param('id');
            series_dao.deleteSeries(id, function(result){
                if(result.affectedRows > 0){
                    res.redirect("/admin/series/?msg=3");
                }else{
                    res.redirect("/admin/series/?msg=0");
                }
            });
        }
	})

	app.post('/admin/series/add', checkLogin.ensureAuthenticated, function(req, res){
        var nameSeries = req.body.name;
		var summary = req.body.summary;
        var dateCreat = time_stamp('YYYY-MM-DD HH:mm:ss');
        var series = new Series(0, nameSeries, summary, dateCreat, dateCreat);

        if(nameSeries == "" || summary == ""){
            res.render('pages/admin/series/add', {user:req.user,series: series, msg: "errnull"});
        }else if( nameSeries.length > 50){
            res.render('pages/admin/series/add', {user:req.user,series: series, msg: "errnamelength"});
        }else if( summary.length > 1000){
            res.render('pages/admin/series/add', {user:req.user,series: series, msg: "errsummarylength"});
        }else{
            series_dao.getSeriesByName(nameSeries, function(result){
                if(result > 0){
                    res.render('pages/admin/series/add', {user:req.user,series: series, msg: "errexists"});
                }else{
	                series_dao.addSeries(series, function(result){
	                    var result = result;
	                    if(result.affectedRows > 0){
	                        res.redirect("/admin/series/?msg=1");
	                    }else{
	                        res.render('pages/admin/series/add', {user:req.user,series: series, msg: "erradd"});
	                    }
	                });
                }
            });

        }
    })

    app.post('/admin/series/edit', checkLogin.ensureAuthenticated, function(req, res){
        if(req.param('id') !== undefined ){
            var id = req.param('id');
            var name = req.body.name;
			var summary = req.body.summary;
            var dateUpdate = time_stamp('YYYY-MM-DD HH:mm:ss');
            var series = new Series(id, name, summary, 0, dateUpdate);

            if(name == "" || summary == ""){
                res.render('pages/admin/series/edit', {user:req.user,series: series, msg: "errnull"});
            }else {
				series_dao.getSeriesByNameOtherID(series, function(result){
	                if(result > 0){
	                    res.render('pages/admin/series/edit', {user:req.user,series: series, msg: "errexists"});
	                }else{
						series_dao.editSeries(series, function(result){
		                    if(result.affectedRows > 0){
		                        res.redirect("/admin/series/?msg=2");
		                    }else{
		                        res.render('pages/admin/series/edit', {user:req.user,series: series, msg: "erredit"});
		                    }
		                });
	                }
	            });

            }
        }
    })

    app.post('/admin/series/delete', checkLogin.ensureAuthenticated, function(req, res){
        var arrid = req.body.item.toString().split(",");
        var check = false;
        for(var i = 0; i < arrid.length; i++){
            if(arrid[i] !== ""){
                series_dao.deleteSeries(arrid[i], function(result){
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
                res.redirect("/admin/series/?msg=3");
            }else{
                res.redirect("/admin/series/?msg=0");
            }
        }, 1000);
    })
}
