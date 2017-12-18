var conn = require("../util/connection");
var Book = require("../entities/book");

var getBooksPublic = function(callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 limit 12";
	var books = new Array();
	conn.query(sql, function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getBooksByCategory = function(id, offset, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and cat_id = ? limit ?,?";
	var books = new Array();
	conn.query(sql, [id, offset, 12], function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getPlaylists = function(listId, offset, callback) {
	var clause = "(0)";
	if(listId != ""){
		var list = listId.split(",");
		clause = "(";
		for(var i = 0; i < list.length; i++){
			if(i == list.length - 1){
				clause += parseInt(list[i]);
			}else{
				clause += parseInt(list[i]) + ",";
			}

		}
		clause += ")";
	}

	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and books.id in " + clause + " limit ?,?";
	var books = new Array();
	conn.query(sql, [offset, 12], function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getBooksByAuthor = function(author, offset, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and author like ? limit ?,?";
	var books = new Array();
	conn.query(sql, [author, offset, 12], function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username, result[i].play_list);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getBookCountByCategory = function(id, callback) {
	var sql = "select count(books.id) as bookCount from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and cat_id = ?";

	conn.query(sql, [id], function (err, result) {
		if (err) throw err;
	    callback(result[0].bookCount);
	});

}

var getBookCountByAuthor = function(author, callback) {
	var sql = "select count(books.id) as bookCount from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and author like ?";

	conn.query(sql, [author], function (err, result) {
		if (err) throw err;
	    callback(result[0].bookCount);
	});

}

var getBookCountByKeyword = function(keyword, callback) {
	var sql = "select count(books.id) as bookCount from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and books.name like '%"+keyword+"%'";
	var books = new Array();
	conn.query(sql, function (err, result) {
		if (err) throw err;
	    callback(result[0].bookCount);
	});

}

var getBooksBySeries = function(id, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and series_id = ?";
	var books = new Array();
	conn.query(sql, [id], function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username, result[i].play_list);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getBooksTopRate = function(callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 order by avg_score desc limit 5";
	var books = new Array();
	conn.query(sql, function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }

	    callback(books);
	});

}

var getBooksAdmin = function(callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books left outer join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id";
	var books = new Array();
	conn.query(sql, function (err, result) {
		if (err) throw err;

	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var getBookPubLic = function(id, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and books.id = ?";
	conn.query(sql, [id], function (err, result) {
		if (err) throw err;
		if(result == "" ) {
			callback(result);
		} else {
			var book = new Book(result[0].id, result[0].name, result[0].summary, result[0].series_id, result[0].cat_id, result[0].user_create_id, result[0].create_at, result[0].author, result[0].file_name, result[0].image, result[0].sum_vote, result[0].sum_score, result[0].avg_score, result[0].status, result[0].cat_name, result[0].series_name, result[0].username);

			callback(book);
		}
	});

}

var getBookAdmin = function(id, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books left outer join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where books.id = ?";
	var books = new Array();
	conn.query(sql, [id], function (err, result) {
		if (err) throw err;

	    	var book = new Book(result[0].id, result[0].name, result[0].summary, result[0].series_id, result[0].cat_id, result[0].user_create_id, result[0].create_at, result[0].author, result[0].file_name, result[0].image, result[0].sum_vote, result[0].sum_score, result[0].avg_score, result[0].status, result[0].cat_name, result[0].series_name, result[0].username);
	    	callback(book);
	});

}

var getBooksSearch = function(keyword, offset, callback) {
	var sql = "select books.id as id, books.name as name, books.summary as summary, cat_id, series_id, user_create_id, author, books.create_at as create_at, file_name, image, sum_vote, sum_score, (sum_score / sum_vote) as avg_score, status, categories.name as cat_name, series.name as series_name, username from books inner join categories on books.cat_id = categories.id inner join users on books.user_create_id = users.id left outer join series on books.series_id = series.id where status = 1 and (books.name like '%"+keyword+"%' or author like ?) limit ?,?";
	var books = new Array();
	conn.query(sql, [keyword, offset, 12], function (err, result) {
		if (err) throw err;
	    for(var i = 0; i < result.length; i++){
	    	var book = new Book(result[i].id, result[i].name, result[i].summary, result[i].series_id, result[i].cat_id, result[i].user_create_id, result[i].create_at, result[i].author, result[i].file_name, result[i].image, result[i].sum_vote, result[i].sum_score, result[i].avg_score, result[i].status, result[i].cat_name, result[i].series_name, result[i].username);
	    	books.push(book);
	    }
	    callback(books);
	});

}

var updateBookStatus = function(id, status, callback) {
	var sql = "update books set status = ? where id = ?";
	conn.query(sql, [status, id], function(err, result) {
		if(err) throw err;
		callback(result);
	});

}

var vote = function(id, sumScore, sumVote, callback) {
	var sql = "update books set sum_score = ?, sum_vote = ? where id = ?";
	conn.query(sql, [sumScore, sumVote, id], function(err, result) {
		if(err) throw err;

		callback(result.affectedRows);
	});

}



var updateBook= function(seriesFlag, book, callback) {
	var sql;
	if(seriesFlag ==  true) {
		sql = "update books set name = ?, summary = ?, series_id = ?, cat_id = ?, author = ?, file_name = ?, image = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mSeriesId, book.mCatId, book.mAuthor, book.mFileName, book.mImage, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	} else {
		sql = "update books set name = ?, summary = ?, cat_id = ?, author = ?, file_name = ?, image = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mCatId, book.mAuthor,  book.mFileName, book.mImage, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}
}
var updateBookNotImage = function(seriesFlag, book, callback) {
	var sql;
	if(seriesFlag == true) {
		sql = "update books set name = ?, summary = ?, series_id = ?, cat_id = ?, author = ?, file_name = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mSeriesId, book.mCatId, book.mAuthor, book.mFileName, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	} else {
			sql = "update books set name = ?, summary = ?, cat_id = ?, author = ?, file_name = ? where id = ?";
			conn.query(sql, [book.mName, book.mSummary, book.mCatId, book.mAuthor, book.mFileName, book.mId], function(err, result) {
				if(err) throw err;
				callback(result);
			});
	}
}
var updateBookNotPdf = function(seriesFlag, book, callback) {
	var sql;
	if(seriesFlag == true){
		sql = "update books set name = ?, summary = ?, series_id = ?, cat_id = ?, author = ?, image = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mSeriesId, book.mCatId, book.mAuthor, book.mImage, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}
	else {
		sql = "update books set name = ?, summary = ?, cat_id = ?, author = ?, image = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mCatId, book.mAuthor, book.mImage, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}
}
var updateBookNotPdfAndImage = function(seriesFlag, book, callback) {
	var sql;
	if(seriesFlag == true) {
		sql = "update books set name = ?, summary = ?, series_id = ?, cat_id = ?, author = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mSeriesId, book.mCatId, book.mAuthor, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	} else {
		sql = "update books set name = ?, summary = ?, cat_id = ?, author = ? where id = ?";
		conn.query(sql, [book.mName, book.mSummary, book.mCatId, book.mAuthor, book.mId], function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}
}

var addBook = function(book, callback) {
	var sql = "insert into books(name, summary, series_id, cat_id, user_create_id, author, file_name, image, status) values(?,?,?,?,?,?,?,?,?)";
	conn.query(sql, [book.mName, book.mSummary, book.mSeriesId, book.mCatId, book.mUserCreateId, book.mAuthor, book.mFileName, book.mImage, book.mStatus], function(err, result) {
		if(err) throw err;
		callback(result);
	});
}

var deleteBook = function(id, callback) {
	var sql = "delete from books where id = ?";
	conn.query(sql, [id], function(err, result) {
		if(err) throw err;
		callback(result);
	});
}

var getCategoryBySeriesId = function(id, callback) {
	var sql = "select categories.id from categories inner join books on books.cat_id = categories.id inner join series on series.id=books.series_id where books.series_id=?";
	conn.query(sql, [id], function(err, result){
		if(err) throw err;
		callback(result);
	});
};

module.exports = {
	getBooksPublic : getBooksPublic,
	getBooksByCategory : getBooksByCategory,
	getBooksBySeries : getBooksBySeries,
	getBooksTopRate : getBooksTopRate,
	getBooksAdmin : getBooksAdmin,
	getBooksSearch : getBooksSearch,
	getBookPubLic : getBookPubLic,
	getBookAdmin : getBookAdmin,
	updateBookStatus : updateBookStatus,
	updateBook : updateBook,
	addBook : addBook,
	deleteBook : deleteBook,
	getBookCountByCategory : getBookCountByCategory,
	getBookCountByKeyword : getBookCountByKeyword,
	getBookCountByAuthor : getBookCountByAuthor,
	getBooksByAuthor : getBooksByAuthor,
	vote : vote,
	getPlaylists : getPlaylists,
	updateBookNotImage : updateBookNotImage,
	updateBookNotPdfAndImage : updateBookNotPdfAndImage,
	updateBookNotPdf : updateBookNotPdf,
	getCategoryBySeriesId : getCategoryBySeriesId
};
