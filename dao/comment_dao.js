var mysql = require('mysql');
var Comment = require('.././entities/comment');
var connection = require("../util/connection");

var getCommentsPublic = function(id, callback) {
	 var sql = 'SELECT comments.*, username, name FROM comments INNER JOIN books ON books.id=comments.book_id INNER JOIN users ON comments.user_id=users.id WHERE comments.status=1 and comments.book_id = ?'
    var comments = new Array();
    connection.query(sql, [id], function(err, result){
      if(err) throw err;
      for(var i = 0; i < result.length; i++) {
        var comment = new Comment(result[i].id, result[i].user_id, result[i].username, result[i].book_id, result[i].content, result[i].create_at,  result[i].status, result[i].name);
        comments.push(comment);
      }
      callback(comments);
    });
}

var insertComment = function(comment, callback){
  var sql = 'INSERT INTO comments(user_id, book_id, content) VALUES(?, ?, ?)';
 connection.query(sql, [comment.mUserId, comment.mBookId, comment.mContent], function(err, result) {
  if (err) throw err;
  callback(result.affectedRows);
  })
}

var getCommentsAdmin = function(callback){
	var sql = "select comments.*, username, name FROM comments INNER JOIN books ON books.id=comments.book_id INNER JOIN users ON comments.user_id=users.id";
	var comments = new Array();
   connection.query(sql, function(err, result){
	 if(err) throw err;
	 for(var i = 0; i < result.length; i++) {
	   var comment = new Comment(result[i].id, result[i].user_id, result[i].username, result[i].book_id, result[i].content, result[i].create_at,  result[i].status, result[i].name);
	   comments.push(comment);
	 }
	 callback(comments);
   });
}

var deleteComment = function(id, callback) {
  var sql = "DELETE FROM comments WHERE comments.id="+id;
  connection.query(sql, function(err, result){
      if(err) throw err;
      console.log("delete success");
	  callback(result);
  });
}
var updateCommentStatus = function(id, status, callback) {
	var sql = "update comments set status = ? where id = ?";
	connection.query(sql, [status, id], function(err, result) {
		if(err) throw err;
		callback(result);
	});
	
}

module.exports = {
  insertComment : insertComment,
  getCommentsPublic : getCommentsPublic,
  getCommentsAdmin : getCommentsAdmin,
  deleteComment : deleteComment,
  updateCommentStatus : updateCommentStatus
}
