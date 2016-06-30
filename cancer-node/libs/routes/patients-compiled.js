'use strict';

/**
 * Created by AsTex on 25.06.2016.
 */
var express = require('express');
var passport = require('passport');
var userRouter = express.Router();

var treatmentsRouter = express.Router({ mergeParams: true });
userRouter.use('/:userId/treatments', treatmentsRouter);

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var ObjectId = require('mongoose').Types.ObjectId;

var db = require(libs + 'db/mongoose');
var Patient = require(libs + 'model/patient').Patient;
var Treatment = require(libs + 'model/treatment');

userRouter.get('/', passport.authenticate('local'), function (req, res) {
    return Patient.find(function (err, patients) {
        if (!err) {
            return res.send({ status: 'OK', patients: patients });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    });
});
userRouter.post('/', function (req, res) {
    log.error(req.body);
    var patient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        secondName: req.body.secondName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        location: req.body.location,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        policyNumber: req.body.policyNumber
    });

    patient.save(function (err) {
        if (!err) {
            log.info("Patient created");
            return res.send({ status: 'OK', patient: patient, apiKey: patient.apiKey, _id: patient._id });
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server Error' });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});
//,passport.authenticate(['Header','local']),
userRouter.get('/:id', passport.authenticate(['header', 'local']), function (req, res) {
    log.debug(req.get('apikey'));
    if (req.authStrategy === 'Header') {
        if (req.params.id !== req.user._id) {
            res.statusCode = 401;
            return res.send({ error: 'You can request only your profile' });
        }
    }
    return Patient.findById(req.params.id, function (err, patient) {
        if (!patient) {
            res.statusCode = 404;
            return res.send({ error: 'Patient not found' });
        }
        if (!err) {
            return res.send({
                status: 'OK',
                patient: patient
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            res.send({
                error: 'Server error'
            });
        }
    });
});

userRouter.put('/:id', passport.authenticate('Header'), function (req, res) {

    return Patient.findById(req.params.id, function (err, patient) {
        if (!patient) {
            res.statusCode = 404;
            return res.send({ error: 'Patient not found' });
        }
        patient.firstName = req.body.firstName;
        patient.lastName = req.body.lastName;
        patient.secondName = req.body.secondName;
        patient.location = req.body.location;
        patient.policyNumber = req.body.policyNumber;
        return patient.save(function (err) {
            if (!err) {
                log.info('Patient updated');
                return res.send({ status: 'OK', patient: patient });
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation Error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});
userRouter.delete('/:id', function (res, req) {
    return PatientModel.findById(req.params.id, function (err, patient) {
        if (!patient) {
            res.statusCode = 404;
            return res.send({ error: 'Patient not found' });
        }
        return patient.remove(function (err) {
            if (!err) {
                log.info('Patient removed');
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server Error' });
            }
        });
    });
});

treatmentsRouter.get('/', passport.authenticate(['header', 'local']), function (req, res) {
    if (req.authStrategy === 'Header') {
        log.error(req.user._id + ' ' + req.params.userId);
        if (req.params.userId != req.user._id) {
            res.statusCode = 401;
            return res.send({ error: 'You can request only your profile' });
        } else {

            Treatment.find({ 'author': req.user._id }, function (err, treatments) {
                if (!err) {
                    return res.send({ status: 'OK', treatments: treatments });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    res.send({
                        error: 'Server error'
                    });
                }
            });
        }
    }
});

treatmentsRouter.get('/:treatmentId', passport.authenticate(['header', 'local']), function (req, res) {
    if (req.authStrategy === 'Header') {
        if (req.params.userId != req.user._id) {
            res.statusCode = 401;
            return res.send({ error: 'You can request only your profile' });
        } else {
            Treatment.find({ 'author': req.params.userId, '_id': req.params.treatmentId }, function (err, treatment) {
                if (!err) {
                    return res.send({ status: 'OK', treatment: treatment });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    res.send({
                        error: 'Server error'
                    });
                }
            });
        }
    }
});

module.exports = userRouter;

//# sourceMappingURL=patients-compiled.js.map