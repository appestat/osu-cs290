var db = require('mysql2');
const config = require('../config/dbCredentials.json');
var conPool = db.createPool(config);


function retrieve(callback) {
    conPool.query("select * from users", (err, results) => {
	    callback(err, results);
    });
};

function insert(data, callback) {
    conPool.query("insert into users(name, elo, RD, VOL, board) values (?, ?, ?, ?, ?)",[data.name, data.elo, data.rd, data.vol, data.board_id], (err, results) => {
	callback(err, results);
    });
}


function update(data, callback) {
    conPool.query("update users set elo=?, RD=?, VOL=? where user_id=?", [data.elo, data.rd, data.vol, data.user_id], (err, results) => {
	callback(err, results);
    });
}

function deleteUser(data, callback) {
    conPool.execute("DELETE from users WHERE user_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}
function getThisUser(data, callback) {
    conPool.query("select * from users where user_id=?", [data.id], (err, results) => {
	callback(err, results);
    });
}
function getUsersFromBoard(data, callback) {
    conPool.execute("SELECT * from users WHERE users.board=?", [data.id], (err, results) => {
	callback(err, results);
    });
}


module.exports = {
    retrieveUser : retrieve,
    insertUser : insert,
    updateUser : update,
    deleteUser : deleteUser,
    getUsersFromBoard: getUsersFromBoard,
    getThisUser: getThisUser
}

    
// module.exports = conPool;