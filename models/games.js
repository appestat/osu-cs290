var db = require('mysql2');
const config = require('../config/dbCredentials.json');
var conPool = db.createPool(config);


function retrieve(callback) {
    conPool.query("select * from games", (err, results) => {
	    callback(err, results);
    });
};
function retrieveThisGame(data, callback) {
    conPool.query("select winner, loser, create_time, info from games where match_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}
    
function insert(data, callback) {
    conPool.query("insert into games (winner, loser, time, info) values (?, ?, ?, ?)",[data.winner, data.loser, data.time, data.info], (err, results) => {
 	callback(err, results);
    });
}


function update(data, callback) {
    conPool.query("update games set winner=?, loser=?, time=?, info=? where match_id=?", [data.winner, data.loser, data.time, data.info, data.id], (err, results) => {
	callback(err, results);
    });
}

function deleteGame(data, callback) {
    conPool.execute("DELETE from games WHERE game_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}

module.exports = {
    retrieveGames : retrieve,
    retrieveThisGame : retrieveThisGame,
    insertGame : insert,
    updateGame : update,
    deleteGame : deleteGame
};
