var mysql = require("mysql");
var conn = mysql.createConnection({
	host : "127.0.0.1",
	user : 'root',
	password : '1234',
	database : 'readbookonline'

});
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = conn;