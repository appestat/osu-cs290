var db = require('mysql2');
const config = require('../config/dbCredentials.json');
var conPool = db.createPool(config);


function retrieve(callback) {
    conPool.query("select * from boards", (err, results) => {
	    callback(err, results);
    });
};
function retrieveThisBoard(data, callback) {
    conPool.query("select name, games from boards where board_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}
    
function insert(data, callback) {
    conPool.query("insert into boards(title, default_elo, default_rd, default_vol, tau) values (?, ?, ?, ?, ?)",[data.title, data.default_elo, data.default_rd, data.default_vol, data.tau], (err, results) => {
 	callback(err, results);
    });
}


function update(data, callback) {
    conPool.query("update boards set title=?, default_elo=?, default_rd=?, default_vol=?, tau=? where board_id=?", [data.title, data.default_elo, data.default_rd, data.default_vol, data.tau], (err, results) => {
	callback(err, results);
    });
}

function deleteBoard(data, callback) {
    conPool.execute("DELETE from boards WHERE board_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}

module.exports = {
    retrieveBoards : retrieve,
    retrieveThisBoard : retrieveThisBoard,
    insertBoard : insert,
    updateBoard : update,
    deleteBoard : deleteBoard
};
