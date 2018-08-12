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

router.get('/boards/:id/adduser', function(req, res, next) {
    res.render('createUser', {id: req.params.id});
});

router.post('/boards/:id/adduser', function(req, res, next) {
    boardModel.retrieveThisBoard({id: req.params.id}, (err, board) => {
	if(err) throw err;
	console.log(board[0].defaultElo);
	userModel.insertUser({name: req.body.name, elo: board[0].defaultElo, rd: board[0].defaultRD, vol: board[0].defaultVol, board_id: req.params.id}, (err, newUser) =>
			     {
				 if(err) throw err;
				 res.redirect('/boards/' + req.params.id);
			     });
    });
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
    console.log(req.body);
    boardModel.insertBoard({title: req.body.title, default_elo: req.body.default_elo, default_rd: req.body.default_rd, default_vol: req.body.vol, tau: req.body.tau}, (err, results) => {
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
