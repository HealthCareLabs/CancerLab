/**
 * Created by AsTex on 25.06.2016.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');

router.get('/', passport.authenticate('basic'), function (req, res) {
    return res.send({apiKey:req.user.apiKey, userId:req.user.id});
});




module.exports = router;