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
function getGamesFromBoard(data, callback) {
    conPool.query("select w.name as winner, l.name as loser, games.create_time, games.info, games.match_id, games.longitude, games.latitude FROM games INNER JOIN users w ON w.user_id = winner INNER JOIN users l ON l.user_id = loser WHERE games.board = ?", [data.id], (err, results) => {
	callback(err, results);
    });
}
function insert(data, callback) {
    conPool.query("insert into games (winner, loser, info, board, longitude, latitude) values (?, ?, ?, ?, ?, ?)",[data.winner, data.loser, data.info, data.board_id, data.longitude, data.latitude], (err, results) => {

 	callback(err, results);
    });
}


function update(data, callback) {
    conPool.query("update games set winner=?, loser=?, time=?, info=? where match_id=? longitude=? latitude=?", [data.winner, data.loser, data.time, data.info, data.id], (err, results) => {
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
    deleteGame : deleteGame,
    getGamesFromBoard : getGamesFromBoard
};
