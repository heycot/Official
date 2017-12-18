var Role = require('../entities/role');
var conn = require('../util/connection');

var getRoles = function(callback) {
    var sql = "select * from roles";
    var roles = new Array();
    conn.query(sql, function(err, result){
        for(var i = 0; i < result.length; i++) {
            var row = new Role(result[i].id, result[i].role);
            roles.push(row);
        }
        callback(roles);
    });
    conn.release;
}


module.exports = {
    getRoles : getRoles
}