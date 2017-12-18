var conn = require("../util/connection");
var Category = require("../entities/category");
var Book = require("../entities/book");

var getCategories = function(callback){
	var sql = "select * from categories";
	var categories = new Array();

	conn.query(sql, function (err, result) {
		if (err) throw err;
		for(var i = 0; i < result.length; i++){
		    var cat = new Category(result[i].id,result[i].name,result[i].create_at,result[i].update_at);
		    categories.push(cat);
		}
	    callback(categories);
	});
}

var getCategory = function(id, callback){
	var sql = "SELECT * FROM categories WHERE id = " + id;
	conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		if(result == ""){
			callback(result);
		}else{
			var category = new Category(result[0].id, result[0].name, result[0].create_at, result[0].update_at);
			callback(category);
		}
	});
}

var getCategoryByName = function(name, callback){
	var sql = "SELECT * FROM categories WHERE name LIKE ?";
	conn.query(sql, name, function(err, result){
			if(err) throw err;
			var row = result.length;
			callback(row);
	});
}

var getCategoryByNameOtherID = function(category, callback){
	var sql = "SELECT * FROM categories WHERE name LIKE ? AND id != ?";
	conn.query(sql, [category.mName, category.mId], function(err, result){
			if(err) throw err;
			var row = result.length;
			callback(row);
	});
}

var addCategory = function(category, callback){
	var sql  = "INSERT INTO categories(name, create_at, update_at) VALUES (?, ?, ?)";
	conn.query(sql, [category.getMName(), category.getMCreateAt(), category.getMUpdateAt()], function(err, result){
		if(err) throw err;
		callback(result);
	});
}

var editCategory = function(category, callback){
	var sql = "UPDATE categories SET name = ?, update_at = ? WHERE id = ?";
	conn.query(sql, [category.getMName(), category.getMUpdateAt(), category.getMId()], function(err, result){
		if(err) throw err;
		callback(result);
	});
}

var deleteCategory = function(id, callback){
	var sql = "DELETE FROM categories WHERE id = ?";
	conn.query(sql, id, function(err, result){
		if(err) throw err;
		callback(result);
	});
}

module.exports = {
	getCategories : getCategories,
	getCategory : getCategory,
	addCategory : addCategory,
	editCategory : editCategory,
	deleteCategory : deleteCategory,
	getCategoryByName : getCategoryByName,
	getCategoryByNameOtherID : getCategoryByNameOtherID,
};
