var express = require('express');
var router = express.Router();
var matchModel = require('../models/games.js');
var boardModel = require('../models/boards.js');
var userModel = require('../models/users.js');
/* GET home page. */
router.get('/boards', function(req, res, next) {
    boardModel.retrieveBoards((err, results) => {
	if (err) throw err;
	res.render('boardList', {boards: results});
    });
});
router.get('/boards/:id', function(req, res, next) {
    boardModel.retrieveThisBoard({id: req.params.id},(err, results) => {
	if (err) throw err;
	console.log(results);
	userModel.getUsersFromBoard({id: req.params.id}, (err, results2) => {
	    console.log(results2);
	    res.render('showBoard', {boardname: results[0].name, users: results2});
	});
    });
});

//router.get('match/:id', function
			       


module.exports = router;
