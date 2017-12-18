var conn = require("../util/connection");
var like = function(userId, bookId, callback){
	var sql = "insert into playlist(user_id, book_id) values(?,?)";
	conn.query(sql, [userId, bookId], function(err, result) {
		if(err) throw err;
		callback(result.affectedRows);
	});
}

var unLike = function(userId, bookId, callback){
	var sql = "delete from playlist where user_id = ? and book_id = ?";
	conn.query(sql, [userId, bookId], function(err, result) {
		if(err) throw err;
		callback(result.affectedRows);
	});
}

var getBookCount = function(userId, callback){
	var sql = "select count(book_id) as bookCount from playlist where user_id = ?";
	conn.query(sql, [userId], function(err, result) {
		if(err) throw err;
		callback(result[0].bookCount);
	});
}

var isLiked = function(userId, bookId, callback){
	var sql = "select count(book_id) as isLiked from playlist where user_id = ? and book_id = ?";
	conn.query(sql, [userId, bookId], function(err, result) {
		if(err) throw err;
		callback(result[0].isLiked);
	});
}

var getListBookId = function(userId, callback){
	
	var list = "";
	var sql = "select book_id from playlist where user_id = ?";
	conn.query(sql, [userId], function(err, result) {
		if(err) throw err;
		
		for(var i = 0; i < result.length; i++){
			if(i == result.length - 1){
				list += result[i].book_id;
			}else{
				list += result[i].book_id + ",";
			}
			
			
		}
		
		callback(list);
	});
}
module.exports = {
	like : like,
	unLike : unLike,
	isLiked : isLiked,
	getBookCount : getBookCount,
	getListBookId : getListBookId
}