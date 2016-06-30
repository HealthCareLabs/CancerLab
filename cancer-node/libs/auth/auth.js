/**
 * Created by AsTex on 25.06.2016.
 */
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var HeaderStrategy = require('passportjs-header').Strategy;
var headerStrategy = require('passport-http-header-strategy').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var log = require('../log')(module);
var libs = process.cwd() + '/libs/';

var config = require(libs + 'config');

var Doctor = require(libs + 'model/doctor');
var Patient = require(libs + 'model/patient').Patient;


/*passport.use('header-own', new CustomStrategy(
 function(req, done) {
 Patient.findOne({apiKey:api}, function(err,patient){
 if (err) { return done(err); }
 if(!patient) return done(null, false, { error: 'Invalid token.' });
 if(!patient.checkApiKey(api)) {
 return done(null, false, {error: 'Incorrect token.'});
 }
 req.authStrategy = 'Header';
 return done(null,patient);
 });
 }
 ));
 */

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new headerStrategy({header: 'X-API-KEY', passReqToCallback: true},
    function (req, token, done) {
        Patient.findOne({apiKey: token}, function (err, patient) {
            if (err) {
                return done(err);
            }

            if (!patient) return done(null, false, {error: 'Invalid token.'});
            if (!patient.checkApiKey(token)) {
                return done(null, false, {error: 'Incorrect token.'});
            }
            req.authStrategy = 'Header';
            return done(null, patient);
        });
    }
));
/*
 passport.use('test', new CustomStrategy({passReqToCallback: true},
 function (req, done) {
 this._verify = done;
 log.debug('test');
 console.log(req.body.email);
 console.log(req.body.password);
 if (!req.cookies.session) {
 if (!req.body.email || !req.body.password) {
 return done(null, false, {error: 'Incorrect credentials.'});
 }
 else {
 Doctor.findOne({email: req.body.email}, function (err, doctor) {
 log.debug('test');
 if (err) {
 return done(err, false, {error: 'Incorrect username.'});
 }
 if (!doctor) {
 return done(null, false, {error: 'Incorrect username.'});
 }
 if (!doctor.checkPassword(req.body.password)) {
 return done(null, false, {error: 'Incorrect password.'});
 }
 req.authStrategy = 'Local';
 res.cookie('session', doctor.sessionId);
 return done(null, doctor);
 });
 }
 } else {
 Doctor.findOne({sessionId: req.cookies.session}, function (err, doctor) {
 if (err) {
 return done(err, false, {error: 'Incorrect username.'});
 }
 if (!doctor) {
 return done(null, false, {error: 'Incorrect username.'});
 }
 return done(null, doctor);
 });

 }
 log.debug('test');
 }));

 */

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password', passReqToCallback: true},
    function (req, username, password, done) {
        console.log(req.body.email);
        console.log(req.body.password);
        if (!req.cookies.session) {
            if (!req.body.email || !req.body.password) {
                return done(null, false, {error: 'Incorrect credentials.'});
            }
            else {
                Doctor.findOne({email: username}, function (err, doctor) {
                    log.debug('test');
                    if (err) {
                        return done(err, false, {error: 'Incorrect username.'});
                    }
                    if (!doctor) {
                        return done(null, false, {error: 'Incorrect username.'});
                    }
                    if (!doctor.checkPassword(req.body.password)) {
                        return done(null, false, {error: 'Incorrect password.'});
                    }
                    req.authStrategy = 'Local';
                    return done(null, doctor);
                });
            }
        } else {
            Doctor.findOne({sessionId: req.cookies.session}, function (err, doctor) {
                if (err) {
                    return done(err, false, {error: 'Incorrect username.'});
                }
                if (!doctor) {
                    return done(null, false, {error: 'Incorrect username.'});
                }
                return done(null, doctor);
            });

        }
        log.debug('test');

    }
));

passport.use(new BasicStrategy(
    function (email, password, done) {
        Patient.findOne({email: email}, function (err, patient) {
            if (err) {
                log.debug('Bad request');
                return done(err);
            }
            if (!patient) {
                log.debug('Bad request2');
                return done(null, false, {error: "No authentication data provided"});
            }
            if (!patient.checkPassword(password)) {
                return done(null, false);
            }
            return done(null, patient);
        });
    }
));