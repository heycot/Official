var Book = require("../entities/book");
var Comment = require("../entities/comment");
var bookDao = require("../dao/book_dao");
var seriesDao = require("../dao/series_dao");
var categoryDao = require("../dao/category_dao");
var playlistDao = require("../dao/playlist_dao");
var slug = require("../util/slug");
var stringUtil = require("../util/StringUtil");
var commentDao = require("../dao/comment_dao");
var fs = require("fs-extra");

module.exports = function(app, urlencodedParser, upload){
	
	app.get('/', function(req, res){
		var user = req.user;
		categoryDao.getCategories(function(categories){
			bookDao.getBooksPublic(function(books){
				bookDao.getBooksTopRate(function(booksTopRate){
					seriesDao.getListSeries(function(listSeries){
						categories = categories;
						books = books;
						booksTopRate = booksTopRate;
						listSeries = listSeries;

						res.render("pages/public/index",{stringUtil: stringUtil, userLogin: user, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, slug:slug});
					})
				})
			})
		});
		
		
	})

	app.get('/category/:category/:id', function(req, res){
				
		if(req.params.id == undefined || req.params.id < 1 || isNaN(req.params.id) == true){
			res.redirect("/404");
		}else{
			
			var page = 1;
			if(req.query.page != undefined){
				page = req.query.page;
			}
			
			categoryDao.getCategories(function(categories){
				categoryDao.getCategory(req.params.id, function(category){
					category = category;
					bookDao.getBookCountByCategory(req.params.id, function(bookCount){

						bookCount = bookCount;
						
						sumPage = Math.ceil(bookCount / 12);
						
						offset = (page - 1) * 12;
						offsetPage = Math.floor(page / 2);

						bookDao.getBooksByCategory(req.params.id, offset, function(books){
							bookDao.getBooksTopRate(function(booksTopRate){
								seriesDao.getListSeries(function(listSeries){
									categories = categories;
									books = books;
									booksTopRate = booksTopRate;
									listSeries = listSeries;
									res.render("pages/public/category", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, sumPage:sumPage, page:page, offsetPage:offsetPage,bookCount:bookCount, category:category, slug:slug});
								})
							})
						})
					})
				})
			});	
		}
		
		
		
	})

	app.get('/:category/:bookName/:id'+'.html', function(req, res){
		

		if(req.params.id == undefined || req.params.id < 1 || isNaN(req.params.id) == true){
			res.redirect("/404");
		} else {
			
			categoryDao.getCategories(function(categories){
				bookDao.getBooksTopRate(function(booksTopRate){
					seriesDao.getListSeries(function(listSeries){
						bookDao.getBookPubLic(req.params.id ,function(book) {
							categories = categories;
							booksTopRate = booksTopRate;
							listSeries = listSeries;
							if(book == "") {
								res.redirect("/404");
							} else {

								bookDao.getBooksBySeries(book.mSeriesId, function(listSeriesById){
									commentDao.getCommentsPublic(req.params.id, function(listOfComment) {
										var isLiked = 0;
										if(req.session.userLogin){
											playlistDao.isLiked(req.session.userLogin['id'], book.mId, function(isLiked){
												isLiked = isLiked;
												res.render("pages/public/detail",{listOfComment : listOfComment, isLiked:isLiked, userLogin:req.session.userLogin, categories:categories, book:book, listSeriesById : listSeriesById, booksTopRate:booksTopRate, listSeries:listSeries, slug:slug, stringUtil : stringUtil});
											})
										}else{
											res.render("pages/public/detail",{listOfComment : listOfComment, isLiked:isLiked, userLogin:req.session.userLogin, categories:categories, book:book, listSeriesById : listSeriesById, booksTopRate:booksTopRate, listSeries:listSeries, slug:slug, stringUtil : stringUtil});
										}
									})	
								})	
							}
						});
					});
				});
			});
		}
	})
	app.get('/series/:series/:id', function(req, res){
		if(req.params.id == undefined || req.params.id < 1 || isNaN(req.params.id) == true){
			res.redirect("/404");
		}else{
			
			categoryDao.getCategories(function(categories){
				seriesDao.getSeries(req.params.id, function(series){
					series = series;
					bookDao.getBooksBySeries(req.params.id, function(books){
						bookDao.getBooksTopRate(function(booksTopRate){
							seriesDao.getListSeries(function(listSeries){
								categories = categories;
								books = books;
								booksTopRate = booksTopRate;
								listSeries = listSeries;
								
								res.render("pages/public/series", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, series:series, slug:slug});
							})
						})
					})
					
				})
			});
		}
		
		

	})

	

	app.get('/search', function(req, res){
		
		var key = "";
		var page = 1;
		if(req.query.page != undefined){
			page = req.query.page;
		}
		if(req.query.s != undefined){
			key = req.query.s;
		}
		
		categoryDao.getCategories(function(categories){
			
			bookDao.getBookCountByKeyword(key, function(bookCount){

				bookCount = bookCount;
				
				sumPage = Math.ceil(bookCount / 12);
				
				offset = (page - 1) * 12;
				offsetPage = Math.floor(page / 2);

				bookDao.getBooksSearch(key, offset, function(books){
					bookDao.getBooksTopRate(function(booksTopRate){
						seriesDao.getListSeries(function(listSeries){
							categories = categories;
							books = books;
							booksTopRate = booksTopRate;
							listSeries = listSeries;
							
							res.render("pages/public/search", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, sumPage:sumPage, page:page, offsetPage:offsetPage, bookCount:bookCount, key:key, slug:slug});
						})
					})
				})
			})
			
		});
		
	})

	app.get('/author/:author', function(req, res){
		
		if(req.params.author == undefined || req.params.author == ""){
			res.redirect("/404");
			
		}else{
			
			var author = req.params.author;
			var author = author.replace(/-/g, " ");
			var page = 1;
			if(req.query.page != undefined){
				page = req.query.page;
			}
			
			
			categoryDao.getCategories(function(categories){
				
				bookDao.getBookCountByAuthor(author, function(bookCount){

					bookCount = bookCount;
					
					sumPage = Math.ceil(bookCount / 12);
					
					offset = (page - 1) * 12;
					offsetPage = Math.floor(page / 2);

					bookDao.getBooksByAuthor(author, offset, function(books){
						bookDao.getBooksTopRate(function(booksTopRate){
							seriesDao.getListSeries(function(listSeries){
								categories = categories;

								books = books;
								
								booksTopRate = booksTopRate;
								listSeries = listSeries;
								if(books == ""){
									res.redirect("/404");
								}else{
									author = books[0].mAuthor;
									res.render("pages/public/author", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, sumPage:sumPage, page:page, offsetPage:offsetPage, bookCount:bookCount, author:author, slug:slug});
								}
								
							})
						})
					})
				})
				
			});	
		}
		
		
		
	})

	
	app.get("/404", function(req, res){
		categoryDao.getCategories(function(categories){
			bookDao.getBooksTopRate(function(booksTopRate){
				res.render("pages/public/404", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, booksTopRate:booksTopRate, slug : slug});	
			})	
		});	
	})


	app.post("/vote",function(req, res){
		var sumScore = req.body.sumScore;
		var id = req.body.id;
		var sumVote = req.body.sumVote;
		
		bookDao.vote(id, sumScore, sumVote, function(result){
			
			res.send(req.body);
		})
		
	})

	app.post("/like",function(req, res){
		var userId = req.body.userId;
		var bookId = req.body.bookId;
		
		if(req.body.status == 1){
			
			playlistDao.like(userId, bookId, function(result){
				req.body.status = 0;

				res.send(req.body);
			})
		}
		if(req.body.status == 0){
			
			playlistDao.unLike(userId, bookId, function(result){
				req.body.status = 1;
				res.send(req.body);
			})
		}
		
		
	})


	app.get('/collection', function(req, res){

		if(!req.session.userLogin){
			res.redirect("/");
		}else{
			var page = 1;
			if(req.query.page != undefined){
				page = req.query.page;
			}

			var id = req.session.userLogin['id'];
			categoryDao.getCategories(function(categories){
				playlistDao.getBookCount(id, function(bookCount){
					
					bookCount = bookCount;
					
					sumPage = Math.ceil(bookCount / 12);
					
					offset = (page - 1) * 12;
					offsetPage = Math.floor(page / 2);
					playlistDao.getListBookId(id, function(listId){
						listId = listId;
						
						bookDao.getPlaylists(listId, offset, function(books){

							bookDao.getBooksTopRate(function(booksTopRate){
								seriesDao.getListSeries(function(listSeries){
									categories = categories;
									books = books;
									
									booksTopRate = booksTopRate;
									listSeries = listSeries;
									res.render("pages/public/collection", {stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, books:books, booksTopRate:booksTopRate, listSeries:listSeries, sumPage:sumPage, page:page, offsetPage:offsetPage,bookCount:bookCount, slug:slug});
								})
							})
						})
					})
				})
				
			});	
		}
		
		
		
	})
	
	app.post("/comment",function(req, res){
		var idUser = req.body.idUser;
		var username = req.body.username;
		var idBook = req.body.idBook;
		var content = req.body.content;

		var comment = new Comment(0, idUser, username, idBook, content, null, 0);
		if(content == "") {
			res.send("errorValidate");
		} else {
			commentDao.insertComment(comment, function(result) {
				if(result != 0) {
					res.send(req.body);
				} else {
					res.send("error");
				}
			})
		}
	})


	app.get("/addbook", function(req, res) {
	
      if(!req.session.userLogin){
			res.redirect("/");
		}else{
			categoryDao.getCategories(function(categories){
			
				bookDao.getBooksTopRate(function(booksTopRate){
					seriesDao.getListSeries(function(listSeries){
						categories = categories;
						
						booksTopRate = booksTopRate;
						listSeries = listSeries;

						res.render("pages/public/addbook",{stringUtil : stringUtil, userLogin:req.session.userLogin, categories:categories, booksTopRate:booksTopRate, listSeries:listSeries, slug:slug, msg : ""});
					})
				})
				
			});
		}
      
  });

  app.post("/addbook", upload.any(), function(req, res) {
  		if(!req.session.userLogin){
  			res.redirect("/");
  		}else{
			categoryDao.getCategories(function(categories){
			bookDao.getBooksTopRate(function(booksTopRate){
  			var bookName = req.body.bookName;
				var author = req.body.author;
				var image;
				var pdf;
				var summaryBook = req.body.summaryBook;
				var categoryId = req.body.categoryId;

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
				var book = new Book(0, bookName, summaryBook, 0, categoryId, req.session.userLogin['id'], null, author, pdf, image, 0, 0, 0, 0, categoryId, 0, 0, 0);
				bookDao.addBook(book, function(result) {
					if(result.affectedRows > 0)
						res.render("pages/public/addbook",{userLogin:req.session.userLogin, categories:categories, booksTopRate:booksTopRate, stringUtil: stringUtil,slug:slug, msg : "Add Succsess!"});
				});
				
			}
		});
		});
  		}
		
	});


}