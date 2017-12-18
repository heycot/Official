var User = require("../entities/user");
var conn = require("../util/connection");


var getUsers = function(callback) {
    var sql = "select users.*, role from users inner join roles on users.role_id = roles.id";
    var roles = new Array();
    conn.query(sql, function(err, results){
        if (err) throw err;
        for(var i = 0; i < results.length; i++) {
            var row = new User(results[i].id, results[i].username, results[i].fullname, results[i].email, results[i].password, results[i].role_id, results[i].role);
            roles.push(row);
        }
        callback(roles);
    });
}

var getUserById = function(id, callback) {
    var sql = "select users.*, role from users inner join roles on users.role_id = roles.id where users.id = ?";
    conn.query(sql, [id], function(err, results){
        if (err) throw err;
        if(results == "") {
            callback(results);
        } else 
        {
            var user = new User(id, results[0].username, results[0].fullname, results[0].email, results[0].password, results[0].role_id, results[0].role);
            callback(user);
        }
    });
}

var getUser = function(username, password, callback) {
    var sql = "select users.*, role from users inner join roles on users.role_id = roles.id where username = ? and password = ?";
    conn.query(sql, [username, password], function(err, results){
        if (err) throw err;
        if(results == "") {
            callback(results);
        } else 
        {
            var user = new User(id, results[0].username, results[0].fullname, results[0].email, results[0].password, results[0].role_id, results[0].role);
            callback(user);
        }
    });
}


var getUserByUsername = function(username, callback) {
    var sql = "select users.*, role from users inner join roles on users.role_id = roles.id where username = ?";
    conn.query(sql, [username], function(err, results, fields){
        if (err) throw err;
        if(results == "") {
            callback(results);
        } else 
        {
            var user = new User(results[0].id, results[0].username, results[0].fullname, results[0].email, results[0].password, results[0].role_id, results[0].role);
            callback(user);
        }
    });
}

var getUserByUsernameExceptId = function(username, id, callback) {
    var sql = "select users.*, role from users inner join roles on users.role_id = roles.id where username = ? and users.id <> ?";
    conn.query(sql, [username, id], function(err, results, fields){
        if (err) throw err;
        if(results == "") {
            callback(results);
        } else 
        {
            var user = new User(results[0].id, results[0].username, results[0].fullname, results[0].email, results[0].password, results[0].role_id, results[0].role);
            callback(user);
        }
    });
}

var addUser = function(user, callback) {
    var sql = "insert into users(username, fullname, email, password, role_id) values(?, ?, ?, ?, ?)";
    conn.query(sql, [user.mUsername, user.mFullname, user.mEmail, user.mPassword, user.mRoleId], function(err, result){
        if (err) throw err;
        callback(result.affectedRows);
    });
}

var editUser = function(user, callback) {
    var sql = "update users set fullname = ?, email = ?, password = ?, role_id = ? where id = ?";
    conn.query(sql, [user.mFullname, user.mEmail, user.mPassword, user.mRoleId, user.mId], function(err, result){
        if (err) throw err;
        callback(result.affectedRows);
    });
}

var deleteUser = function(id, callback) {
	var sql = "delete from users where id = ?";
	conn.query(sql, [id], function(err, result) {
        console.log('hihi' + result.affectedRows);
        if (err) throw err;
        callback(result.affectedRows);
	});
}

var getUserSearch = function(keyWord, callback) {
    var sql = "select * from users where username like ?";
    var roles = new Array();
    conn.query(sql, ["%" + keyWord + "%"], function(err, results){
        if (err) throw err;
        for(var i = 0; i < results.length; i++) {
            var row = new User(results[i].id, results[i].username, results[i].fullname, results[i].email, results[i].password, results[i].role_id, results[i].role);
            roles.push(row);
        }
        callback(roles);
    });
}
module.exports = {
    getUsers : getUsers,
    getUser : getUser,
    getUserById : getUserById,
    getUserByUsername : getUserByUsername,
    addUser : addUser,
    editUser : editUser,
    deleteUser : deleteUser,
    getUserSearch : getUserSearch,
    getUserByUsernameExceptId : getUserByUsernameExceptId
}