'use strict';

/**
 * Created by AsTex on 25.06.2016.
 */
var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var log = require('./libs/log')(module);
var multer = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var passport = require('passport');
require('./libs/auth/auth');
var config = require('./libs/config');
var mongoose = require('./libs/db/mongoose');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var doctors = require('./libs/routes/doctors');
var patients = require('./libs/routes/patients');
var tokens = require('./libs/routes/tokens');
var images = require('./libs/routes/images');
var treatments = require('./libs/routes/treatments');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ uploadDir: './temp/images' }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: 'SECRET',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    }) }));
app.use(passport.initialize());
app.use(flash());

app.use(passport.session());
app.use('/api/patients', patients);
app.use('/api/treatments', treatments);
app.use('/api/token', tokens);
app.use('/api/images', images);
app.use('/api/doctors', doctors);

app.use(function (req, res, next) {
    res.status(404);
    log.error('Not found URL: %s', req.url);
    res.send({ error: 'Not Found' });
    return;
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(req);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    return;
});

app.get('/ErrorExample', function (req, res, next) {
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function () {
    console.log('Express server listening on port 1337');
});

//# sourceMappingURL=app-compiled.js.map