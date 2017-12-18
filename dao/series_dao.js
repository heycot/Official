var conn = require("../util/connection");
var Series = require("../entities/series");

// var getListSeries = function(callback){
//     var sql = "SELECT * FROM series";
//     var results = new Array();
//
//     conn.query(sql, function(err, result){
//         if (err) throw err;
//     	for(var i = 0; i < result.length; i++){
//             var series = new Series(result[i].id, result[i].name, result[i].summary, result[i].create_at, result[i].update_at);
//             results.push(series);
//         }
//         callback(results);
//     });
// }
var getListSeries = function(callback){
    var sql = "SELECT distinct series.id, series.name, series.summary, series.create_at, series.update_at FROM series inner join books on series.id = books.series_id";
    var results = new Array();
    conn.query(sql, function(err, result){
        if (err) throw err;
    	for(var i = 0; i < result.length; i++){
            var series = new Series(result[i].id, result[i].name, result[i].summary, result[i].create_at, result[i].update_at);
            results.push(series);
        }
        callback(results);
    });
}

var getSeries = function(id, callback){
    var sql = "SELECT * FROM series WHERE id = ?";
    conn.query(sql, id, function(err, result){
        if(err) throw err;
        if( result == ""){
            callback(result);
        }else{
            var series = new Series(result[0].id, result[0].name, result[0].summary, result[0].create_at, result[0].update_at);
            console.log(series);
            callback(series);
        }

    });
}

var getSeriesByName = function(name, callback){
    var sql = "SELECT * FROM series WHERE name LIKE ?";
    conn.query(sql, name, function(err, result){
        if (err) throw err;
        callback(result.length);
    });
}

var getSeriesByNameOtherID = function(series, callback){
	var sql = "SELECT * FROM series WHERE id != ? AND name LIKE ? ";
	conn.query(sql, [series.mId, series.mName], function(err, result){
			if(err) throw err;
			var row = result.length;
			callback(row);
	});
}

var addSeries = function(series, callback){
    var sql = "INSERT INTO series(name, summary, create_at, update_at) VALUES (?, ?, ?, ?)";

    conn.query(sql, [series.getMName(), series.getMSummary(), series.getMCreateAt(), series.getMUpdateAt()], function(err, result){
        if(err) throw err;
        callback(result);
    });
}

//sua ten va mo ta
var editSeries = function(series, callback){
    var sql = "UPDATE series SET name = ?, summary = ?, update_at = ? WHERE id = ?";

    conn.query(sql, [series.getMName(), series.getMSummary(), series.getMUpdateAt(), series.getMId()], function(err, result){
        if(err) throw err;
        callback(result);
    });
}

var deleteSeries = function(id, callback){
    var sql = "DELETE FROM series WHERE id = ?";

    conn.query(sql, id, function(err, result){
        if(err) throw err;
        callback(result);
    });
}

module.exports = {
    getListSeries : getListSeries,
    getSeries : getSeries,
    getSeriesByName : getSeriesByName,
    addSeries : addSeries,
    editSeries : editSeries,
    deleteSeries : deleteSeries,
    getSeriesByNameOtherID : getSeriesByNameOtherID,
};
