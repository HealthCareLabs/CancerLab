/**
 * Created by AsTex on 28.06.2016.
 */
var express = require('express');
var crypto = require('crypto');
var passport = require('passport');
var doctorRouter = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var Doctor = require(libs + 'model/doctor');

doctorRouter.post('/', function (req, res) {
    var doctor = new Doctor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        secondName: req.body.secondName,
        organisation: req.body.organisation,
        position: req.body.position,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
    });
    doctor.save(function (err) {
        log.error(doctor);
        if (!err) {
            res.send({status: 'OK', doctor: doctor});
        } else {
            res.statusCode = 500;
            res.send({error: 'Server Error'});
        }
    });
});

doctorRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log',
    failureFlash: true
}), function (req, res) {
    
    /*
     if(res.cookies && res.cookies.sessionId) {
     res.statusCode = 401;
     res.send({error:'Server error'});
     }else{
     if (!req.body.email || !req.body.password) {
     return res.send({error: 'Incorrect credentials'});
     }
     Doctor.findOne({email: req.body.email}, function (err, doctor) {
     log.debug('test');
     if (err) {
     res.statusCode = 401;
     res.send({error: 'Server Error'});
     }
     if (!doctor) {
     res.statusCode = 401;
     return res.send({error: 'Incorrect username'});
     }
     if (!doctor.checkPassword(req.body.password)) {
     return res.send({error: 'Incorrect password'});
     }
     var sessionId =  crypto.randomBytes(16).toString('hex');
     Doctor.findByIdAndUpdate(doctor._id, {$set: {'sessionId': sessionId}}).exec(function(err){
     if(!err){
     res.cookie('session', doctor.sessionId);
     return res.send({status:'OK'});
     } else{
     res.statusCode = 500;
     return res.send({error: 'Server error'});
     }
     });

     });
     }
     */

    return res.send({status: 'OK'});
});

module.exports = doctorRouter;