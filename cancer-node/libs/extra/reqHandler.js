/**
 * Created by AsTex on 27.06.2016.
 */
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var Patient = require(libs + 'model/patient').Patient;

function isApiAuthenticated(req) {
    if (!req.get('X-API-KEY')) {
        return false;
    }
    var token = req.get('X-API-KEY');
    var patient = Patient.findOne({apiKey: token}, function (err, patient) {
        if (err) return null;
        if (!patient) return null;
        console.log(patient._id);
        if (patient.checkApiKey(token)) return patient;

    });

    console.log(patient._id);
    if (patient._id) {
        req.login(patient._id, function (err) {
            if (!err)
                console.log('Updated');
            return true;
        });
    }
}


var isLoggedIn = function (patientArea, doctorArea) {
    return function (req, res, next) {
        if (doctorArea && !patientArea) {
            return next();
        }
        var token = req.get('X-API-KEY');

        if (patientArea && !doctorArea) {

            Patient.findOne({apiKey: token}, function (err, patient) {
                if (err) {
                    res.statusCode = 500;
                    return res.send({error: 'Server Error'});
                }
                if (!patient) {
                    res.statusCode = 500;
                    return res.send({error: 'Server Error'});
                }
                console.log(patient._id);
                if (patient.checkApiKey(token)) {
                    req.authStrategy = 'Header';
                    req.user = patient;
                    return next();
                }
            });
        }

        if (patientArea && doctorArea) {
            if (req.isAuthenticated())
                return next();
            else {
                Patient.findOne({apiKey: token}, function (err, patient) {
                    if (err) {
                        res.statusCode = 500;
                        return res.send({error: 'Server Error'});
                    }
                    if (!patient) {
                        res.statusCode = 500;
                        return res.send({error: 'Server Error'});
                    }
                    console.log(patient._id);
                    if (patient.checkApiKey(token)) {
                        req.authStrategy = 'Header';
                        req.user = patient;
                        return next();
                    }
                });
            }

        }

    }
};

module.exports.isLoggedIn = isLoggedIn;
