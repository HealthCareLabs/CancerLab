/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose');

var libs = process.cwd() + '/libs/';

var log = require(libs+ 'log')(module);
var config =require(libs + 'config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('DB connection error: %s', err.message);
});
db.once('open', function callback() {
    log.info("Connected to DB");
});

module.exports = mongoose;