var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator'); // added for login
var bcrypt = require('bcrypt'); // added for login
var passport = require('passport'); // added for login
const saltRounds = 10; // added for login; amount of cycles text goes through
var matchModel = require('../models/games.js');
var boardModel = require('../models/boards.js');
var userModel = require('../models/users.js');
var glicko = require('glicko2');


/* GET boards page. */
router.get('/boards', function(req, res, next) {
    boardModel.retrieveBoards((err, results) => {
	if (err) throw err;
	res.render('boardList', {boards: []});
    });
});
// added for login
router.get('/login', function(req,res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	}
	else {
		res.render('testlogin');
	}
});

// added for login
router.get('/register', function(req,res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	}
	else {
		res.render('register');
	}
})

// added for login: later add success redirect to previous page?
router.post('/login',passport.authenticate('local',{
	successRedirect:'/',
	failureRedirect:'/login',
}));

// added for login
router.get('/logout',function(req,res){
	req.logout(); //This comes with passport
	req.session.destroy();
	res.redirect('/');
});

// added for login; copied from passport example
router.post('/register',function (req,res,next){

	//validating inputs using express-validator
	req.checkBody('displayname','Display name field cannot be empty').notEmpty();
	req.checkBody('displayname','Display name must be between 2-15 characters long.').len(2,15);
	req.checkBody('username','Username field cannot be empty').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	// will not require email
	// req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	// req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

	const errors = req.validationErrors();
	if(errors) {
	  console.log('errors:'+JSON.stringify(errors));
	  res.render('register', { title: 'Registration Error',errors:errors })
	}
	else {
	  const displayname = req.body.displayname;
	  const username = req.body.username;
	  // const email = req.body.email;
	  const password = req.body.password;
	  console.log(req.body);


	/*
	  const config = require('../config/dbCredentials.json');
	  const db = require('../models/users');
	*/
		// login
		var db = require('mysql2');
		const config = require('../config/dbCredentials.json');
		var conPool = db.createPool(config);

	  bcrypt.hash(password, saltRounds, function(err, hash) {
		// Store hash in your password DB.

	  // will not require email
	  conPool.query('INSERT into users(name,username,password) values(?,?,?)',[displayname,username,hash],function(err,results,fields){
		if(err) throw err;
		// MAY NEED TUNING HERE DEPENDING ON KAI'S SQL **************
		conPool.query('SELECT LAST_INSERT_ID() as user_id',function(err,results,fields) {
		  if (err) throw err;
		  //This login comes from passport
		  console.log(results[0])
		  var user_id = results[0]
		  req.login(user_id, function(err) {
			res.redirect('/')
		  })
		})
	  })
	});
	}

	//res.render('index', { title: 'Registration Complete' });
  })

// added for login
passport.serializeUser(function(user_id, done) {
done(null, user_id);
});

// added for login
passport.deserializeUser(function(user_id, done) {

	done(null, user_id);
});

// added for login
function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) {return next()};
		res.redirect('/login')
	}
}

router.get('/boards/create', function(req, res, next) {
	console.log(req.user); // added for login
	console.log(req.isAuthenticated()); // added for login
	if (req.isAuthenticated()) {
		res.render('createBoard');
	}
	else {
		res.redirect('/login');
	}

});

router.get('/boards/:id/adduser', function(req, res, next) {
	if (req.isAuthenticated()) {
		res.render('createUser', {id: req.params.id});
	}
	else {
		res.redirect('/login');
	}
});

router.get('/boards/:id/addmatch', function(req, res, next) {
	if (req.isAuthenticated()) {
		userModel.getUsersFromBoard({id:req.params.id}, (err, users) => {
			res.render('createMatch', {id:req.params.id, users: users});
			});
	}
	else {
		res.redirect('/login');
	}
});


router.post('/boards/:id/addmatch', function(req, res, next) {
	if (req.isAuthenticated()) {
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
				    matchModel.insertGame({winner: req.body.winner, loser: req.body.loser, info: req.body.info, board_id: req.params.id, longitude: req.body.longitude, latitude: req.body.latitude}, (err, result) => {
					console.log(result);
					if(err) throw err;
				});
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
	}
	else {
		res.redirect('/login');
	}


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
	if (req.isAuthenticated()) {
		boardModel.retrieveThisBoard({id: req.params.id},(err, results) => {
		if (err) throw err;
		console.log(results);
		userModel.getUsersFromBoard({id: req.params.id}, (err, results2) => {
			console.log(results2);
			res.render('showBoard', {board: results[0], users: results2});
		});
		});
	}
	else {
		res.redirect('/login');
	}
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
	if (req.isAuthenticated()) {
		console.log(req.body);
		boardModel.insertBoard({title: req.body.title, default_elo: req.body.default_elo, default_rd: req.body.default_rd, default_vol: req.body.default_vol, tau: req.body.tau}, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.redirect('/boards/' + results.insertId);
		});
	}
	else {
		res.redirect('/login');
	}
});

router.get('/boards/:id/matches', function(req, res, next) {
    console.log("HELLO");
    matchModel.getGamesFromBoard({id: req.params.id}, (err, results) => {
	console.log(results);
	res.render('showMatches', {matches: results, id:req.params.id});
    });
});

router.get('/boards/:id/matches/map', function(req, res, next) {
    console.log("HELLO");
    matchModel.getGamesFromBoard({id: req.params.id}, (err, results) => {
	console.log(results);
	res.render('map', {matches: results});
    });
});

router.get('/', function(req, res, next) {
    res.render('home');
});

//router.get('match/:id', function



module.exports = router;
