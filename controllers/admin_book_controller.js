var checkLogin = require('../util/checkLogin');

var bookDao = require("../dao/book_dao");
var categoryDao = require("../dao/category_dao");
var seriesDao = require("../dao/series_dao");
var Series = require("../entities/series");
var Book = require("../entities/book");

var fs = require('fs-extra');

module.exports = function(app, io, urlencodedParser, upload) {
	app.get("/admin/book", checkLogin.ensureAuthenticated, function(req, res){
			var message = req.query.message;
			bookDao.getBooksAdmin(function(result){
				var books = new Array();
				books = result;
				res.render("pages/admin/books/index", {user:req.user, data : books, message : message});
			});
	});
	app.get("/admin/book/delete/:id", checkLogin.ensureAuthenticated, function(req, res){
			var id = req.params.id;
			if(id != undefined && id > 0) {
				bookDao.deleteBook(id, function(result){
						if(result.affectedRows > 0) {
							res.redirect("/admin/book/?message=1");
						} else {
							res.redirect("/admin/book/?message=2");
						}
				});
			} else {
				res.redirect("/404");
			}
	});
	app.get("/admin/book/detail/:id", checkLogin.ensureAuthenticated, function(req, res){
		var id = req.params.id;
		if(id != undefined && id > 0) {
			bookDao.getBookAdmin(id, function(result) {
					var book = result;
					res.render("pages/admin/books/detail", {user:req.user, data : book});
			});
		} else {
			res.redirect("/404");
		}
	});

	app.post("/admin/book/add", checkLogin.ensureAuthenticated, upload.any(), function(req, res, next) {
		var bookName = req.body.bookName;
		var author = req.body.author;
		var image;
		var pdf;
		var summaryBook = req.body.summaryBook;
		var seriesName = req.body.seriesName;
		var seriesSummary = req.body.seriesSummary;
		var categoryId = req.body.categoryId;
		var seriesId = req.body.seriesId;

		if(req.files[0] != undefined) {
			var oldDestination;
			var newDestination;
			if(req.files[0].fieldname == 'picture') {
				oldDestination = req.files[0].path;
				newDestination = './templates/files/images/'+ req.files[0].originalname;
				image = req.files[0].originalname;
				fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
		  		if (err) return console.error(err)
				})
				if(req.files[1] != undefined) {
					oldDestination = req.files[1].path;
					newDestination = './templates/files/pdf/' + req.files[1].originalname;
					pdf = req.files[1].originalname;
					fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
				 		if (err) return console.error(err)
					})
				}
			}
			else {
					oldDestination = req.files[0].path;
					newDestination = './templates/files/pdf/' + req.files[0].originalname;
					pdf = req.files[0].originalname;
					fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
				 		if (err) return console.error(err)
					})
				}
			if(image == undefined)
					image = 0;
				if(image == undefined)
					image = 0;
				if(categoryId != 0) {
					if(seriesId == 0 && seriesName == '') {
						console.log("aad" + categoryId);
						var book = new Book(0, bookName, summaryBook, 0, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
						bookDao.addBook(book, function(result){
							if(result.affectedRows > 0) {
									res.redirect("/admin/book/?message=3");
							} else {
									res.redirect("/admin/book/?message=4");
							}
						});
					} else {
							var series = new Series(0, seriesName, seriesSummary, null, null);
							seriesDao.addSeries(series, function(result) {
								if(result.affectedRows > 0) {
										var book = new Book(0, bookName, summaryBook, result.insertId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.addBook(book, function(result){
											if(result.affectedRows > 0) {
													res.redirect("/admin/book/?message=3");
											} else {
													res.redirect("/admin/book/?message=4");
											}
										});
									}
							});
						}
					} else {
						if(seriesId != 0) {
							bookDao.getCategoryBySeriesId(seriesId, function(result){
								
								var book = new Book(0, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
								bookDao.addBook(book, function(result){
									if(result.affectedRows > 0) {
											res.redirect("/admin/book/?message=3");
									} else {
											res.redirect("/admin/book/?message=4");
									}
								});
							});
						} else {
							res.render("pages/admin/books/addbook", {book : book,message : 1});
						}
				}
		}
	});

	app.get("/admin/book/add", checkLogin.ensureAuthenticated, function(req, res) {
		var categories = new Array();
		var listSeries = new Array();
		var message = req.query.message;
		categoryDao.getCategories(function(resultsCat) {
				categories = resultsCat;
		});
		seriesDao.getListSeries(function(resultSeries) {
				listSeries = resultSeries;
				res.render("pages/admin/books/addbook", {user:req.user, categories : categories, listSeries : listSeries, message : message});
		});
	});

	app.get("/admin/book/edit/:id", checkLogin.ensureAuthenticated, function (req, res) {
		var id = req.params.id;
		if(id != undefined && id > 0) {
			var categories = new Array();
			var listSeries = new Array();
			var message = req.query.message;
			categoryDao.getCategories(function(resultsCat) {
					categories = resultsCat;
			});

				seriesDao.getListSeries(function(resultSeries) {
						listSeries = resultSeries;
				});
				bookDao.getBookAdmin(id, function(resultBook) {
						var books = resultBook;
						res.render("pages/admin/books/edit", {user:req.user, data:books, categories : categories, listSeries : listSeries, message : message});
				});
			}else {
				res.redirect("/404");
		}
	});

	app.post("/admin/book/edit/:id", checkLogin.ensureAuthenticated, upload.any(), function (req, res, next) {
		var id = req.params.id;
		if(id != undefined && id > 0) {
			var bookName = req.body.bookName;
			var author = req.body.author;
			var image;

			var pdf;
			var summaryBook = req.body.summaryBook;
			var seriesName = req.body.seriesName;
			var seriesSummary = req.body.seriesSummary;
			var categoryId = req.body.categoryId;
			var seriesId = req.body.seriesId;
			var changeSeries = req.body.changeSeries;
			var removeImage = req.body.removeImage;
			var oldDestination;
			var newDestination;
			if(removeImage == undefined) {	// khong xoa anh
				if(req.files[0] != undefined && req.files[1] != undefined) {
						oldDestination = req.files[0].path;
						newDestination = './templates/files/images/'+ req.files[0].originalname;
						image = req.files[0].originalname;
						fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
				  		if (err) return console.error(err)
						})
						if(req.files[1] != undefined) {
							oldDestination = req.files[1].path;
							newDestination = './templates/files/pdf/' + req.files[1].originalname;
							pdf = req.files[1].originalname;
							fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
						 		if (err) return console.error(err)
							})
						}
						// thay doi ca 2
						if(changeSeries == undefined) {
							var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
							bookDao.updateBook(false, book, function(result) {
									res.redirect("/admin/book/?message=5");
							});
						} else {
							if(seriesId != 0) {
								bookDao.getCategoryBySeriesId(seriesId, function(result){
									var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
									bookDao.updateBook(true, book, function(result){
											res.redirect("/admin/book/?message=5");
									});
								});
							} else {
								var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
								bookDao.updateBook(true, book, function(result){
										res.redirect("/admin/book/?message=5");
								});
							}
							}
					}
						// thay doi mot trong 2
					else if(req.files[0] != undefined){
							// thay doi anh
							if(req.files[0].fieldname == 'picture') {
								oldDestination = req.files[0].path;
								newDestination = './templates/files/images/' + req.files[0].originalname;
								image = req.files[0].originalname;
								fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
							 		if (err) return console.error(err)
								})
								if(changeSeries == undefined) {
									var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
									bookDao.updateBookNotPdf(false, book, function(result){
										res.redirect("/admin/book/?message=5");
									});
								} else {
									if(seriesId != 0) {
										bookDao.getCategoryBySeriesId(seriesId, function(result){
											var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
											bookDao.updateBookNotPdf(true, book, function(result){
													res.redirect("/admin/book/?message=5");
											});
										});
									} else {
										var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.updateBookNotPdf(true, book, function(result){
												res.redirect("/admin/book/?message=5");
										});
									}
								}
								// thay doi pdf
							} else {
								oldDestination = req.files[0].path;
								newDestination = './templates/files/pdf/' + req.files[0].originalname;
								pdf = req.files[0].originalname;
								fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
							 		if (err) return console.error(err)
								})
								if(changeSeries == undefined) {
									var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
									bookDao.updateBookNotImage(false, book, function(result){
											res.redirect("/admin/book/?message=5");
									});
								} else {
									if(seriesId != 0) {
										bookDao.getCategoryBySeriesId(seriesId, function(result){
											var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
											bookDao.updateBookNotImage(true, book, function(result){
													res.redirect("/admin/book/?message=5");
											});
										});
									} else {
										var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.updateBookNotImage(true, book, function(result){
												res.redirect("/admin/book/?message=5");
										});
									}
								}
							}
						} else if(req.files[0] == undefined) {
							if(changeSeries == undefined) {
								var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
								bookDao.updateBookNotPdfAndImage(false, book, function(result){
										res.redirect("/admin/book/?message=5");
								});
							} else {
									if(seriesId != 0) {
										bookDao.getCategoryBySeriesId(seriesId, function(result){
											var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
											bookDao.updateBookNotPdfAndImage(true, book, function(result){
													res.redirect("/admin/book/?message=5");
											});
										});
									} else {
										var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.updateBookNotPdfAndImage(true, book, function(result){
												res.redirect("/admin/book/?message=5");
										});
									}
							}
						}
					} else {	// xoa anh
							image = 0;
							if(req.files[0] != undefined) {
									if(req.files[0].fieldname == 'pdf') {
									oldDestination = req.files[0].path;
									newDestination = './templates/files/pdf/' + req.files[0].originalname;
									pdf = req.files[0].originalname;
									fs.move(oldDestination, newDestination,{ overwrite: true }, err => {
										if (err) return console.error(err)
									})
								}
							}
								// upload khong thay pdf va xoa anh
							if(pdf == undefined) {
									if(changeSeries == undefined) {
										var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.updateBookNotPdf(false, book, function(result){
											res.redirect("/admin/book/?message=5");
										});
									}
						 			else {
										if(seriesId != 0) {
											bookDao.getCategoryBySeriesId(seriesId, function(result){
												var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
												bookDao.updateBookNotPdf(true, book, function(result){
														res.redirect("/admin/book/?message=5");
												});
											});
										} else {
											var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
											bookDao.updateBookNotPdf(true, book, function(result){
													res.redirect("/admin/book/?message=5");
											});
										}
								}
							}
							else {
								if(changeSeries == undefined) {
									var book = new Book(id, bookName, summaryBook, 0, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
									bookDao.updateBook(false, book, function(result){
											res.redirect("/admin/book/?message=5");
									});
								} else {
									if(seriesId != 0) {
										bookDao.getCategoryBySeriesId(seriesId, function(result){
											var book = new Book(id, bookName, summaryBook, seriesId, result[0].id, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
											bookDao.updateBookNotImage(true, book, function(result){
													res.redirect("/admin/book/?message=5");
											});
										});
									} else {
										var book = new Book(id, bookName, summaryBook, seriesId, categoryId, req.user.mId, null, author, pdf, image, 0, 0, 0, 0, null, null, null, null);
										bookDao.updateBookNotImage(true, book, function(result){
												res.redirect("/admin/book/?message=5");
										});
									}
								}
							}
						}
		} else {
			res.redirect("/404");
		}

	});
	var namespace = io.of("/admin/book");
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
			bookDao.updateBookStatus(id, status, function(result) {
					if(result.affectedRows > 0) {
							namespace.emit("index", {path : path, id : id});
					}
			});
		});
	});
}
