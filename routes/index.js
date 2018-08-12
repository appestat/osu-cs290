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

router.get('/boards/create', function(req, res, next) {
    res.render('createBoard');
});
router.get('/boards/:id', function(req, res, next) {
    boardModel.retrieveThisBoard({id: req.params.id},(err, results) => {
	if (err) throw err;
	console.log(results);
	userModel.getUsersFromBoard({id: req.params.id}, (err, results2) => {
	    console.log(results2);
	    res.render('showBoard', {board: results[0], users: results2});
	});
    });
});

router.post('/boards/create', function(req, res, next) {
    boardModel.insertBoard({title: req.body.title, defualt_elo: req.body.default_elo, default_rd: req.body.default_rd, vol: req.body.vol, tau: req.body.tau}, (err, results) => {
	if(err) throw err;
	console.log(results);
	res.redirect('/boards/' + results.insertId);
    });
});

router.get('/boards/:id/matches', function(req, res, next) {
    matchModel.getGamesFromBoard({id: req.params.id}, (err, results) => {
	console.log(results);
	res.render('showMatches', {matches: results});
    });
});

router.get('/', function(req, res, next) {
    res.render('home');
});

//router.get('match/:id', function
			       


module.exports = router;
