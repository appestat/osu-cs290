var express = require('express');
var router = express.Router();
var matchModel = require('../models/games.js');
var boardModel = require('../models/boards.js');
var userModel = require('../models/users.js');
var glicko = require('glicko2')
/* GET home page. */
router.get('/boards', function(req, res, next) {
    boardModel.retrieveBoards((err, results) => {
	if (err) throw err;
	res.render('boardList', {boards: []});
    });
});

router.get('/boards/create', function(req, res, next) {
    res.render('createBoard');
});

router.get('/boards/:id/adduser', function(req, res, next) {
    res.render('createUser', {id: req.params.id});
});

router.get('/boards/:id/addmatch', function(req, res, next) {
    userModel.getUsersFromBoard({id:req.params.id}, (err, users) => {
	res.render('createMatch', {id:req.params.id, users: users});
    });
});


router.post('/boards/:id/addmatch', function(req, res, next) {
    boardModel.retrieveThisBoard({id: req.params.id}, (err, board) => {
	let gsettings = {tau : board[0].tau, rating: board[0].defaultElo, rd: board[0].defaultRD, vol: board[0].defaultVol};
	let ranking = new glicko.Glicko2(gsettings);
	// warning callback hell (tfw no async ;_;)
	console.log(req.body);
	userModel.getThisUser({id: req.body.winner}, (err, winner) => {
	    userModel.getThisUser({id: req.body.loser}, (err, loser) => {
		winnerPlayer = ranking.makePlayer(winner[0].elo, winner[0].RD, winner[0].vol);
		loserPlayer = ranking.makePlayer(loser[0].elo, loser[0].RD, loser[0].vol);
		ranking.updateRatings([[winnerPlayer, loserPlayer, 1]]);
		console.log(winnerPlayer.getRating());
		console.log(loserPlayer.getRating());
		// Add geolocation
		matchModel.insertGame({winner: req.body.winner, loser: req.body.loser, info: req.body.info, board_id: req.params.id}, (err, result) => {
		    console.log(result);
		    if(err) throw err;
		});
		//
		userModel.updateUser({elo: winnerPlayer.getRating(), rd: winnerPlayer.getRd(), vol: winnerPlayer.getVol(), user_id: winner[0].user_id}, (err, result) => {
		    if(err) throw err;
		});
		userModel.updateUser({elo: loserPlayer.getRating(), rd: loserPlayer.getRd(), vol: loserPlayer.getVol(), user_id: loser[0].user_id}, (err, results) => {
		    if(err) throw err;
		});
		// TODO DISPLAY CHANGES???
		res.redirect('/boards/' + req.params.id);
	    });
	});
    });
}); // ayy lmao

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
    boardModel.retrieveThisBoard({id: req.params.id}, (err, results) => {
	if (err) throw err;
	console.log(results);
	userModel.getUsersFromBoard({id: req.params.id}, (err, results2) => {
	    console.log(results2);
	    res.render('showBoard', {board: results[0], users: results2});
	});
    });
});
router.get('/getBoardsRange', function(req, res, next) {
    console.log(req.query.currentIdx);
    idx = parseInt(req.query.currentIdx);
    boardModel.retrieveTenBoards(idx, (err, results) => {

	if (err) throw err;
	console.log(results);
	res.send(results);
    });
});
	
router.post('/boards/create', function(req, res, next) {
    console.log(req.body);
    boardModel.insertBoard({title: req.body.title, default_elo: req.body.default_elo, default_rd: req.body.default_rd, default_vol: req.body.default_vol, tau: req.body.tau}, (err, results) => {
	if(err) throw err;
	console.log(results);
	res.redirect('/boards/' + results.insertId);
    });
});

router.get('/boards/:id/matches', function(req, res, next) {
    console.log("HELLO");
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
