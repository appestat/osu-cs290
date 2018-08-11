var express = require('express');
var router = express.Router();
var matchModel = require('../models/games.js');
var boardModel = require('../models/boards.js');
/* GET home page. */
router.get('/boards/:id', function(req, res, next) {
    boardModel.retrieveThisBoard({id: req.params.id},(err, results) => {
	if (err) throw err;
	console.log(results);
	res.render('showBoard', {boardname: results[0].name});
    });
});

//router.get('match/:id', function
			       


module.exports = router;
