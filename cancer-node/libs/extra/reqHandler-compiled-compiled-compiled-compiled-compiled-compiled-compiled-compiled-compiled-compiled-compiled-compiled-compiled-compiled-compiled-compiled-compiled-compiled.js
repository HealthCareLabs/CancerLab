'use strict';

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
    console.log(token);

    Patient.findOne({ apiKey: token }, function (err, patient) {
        if (err) {
            return false;
        }
        if (!patient) return false;
        if (!patient.checkApiKey(token)) {
            return false;
        }
        req.authStrategy = 'Header';
        req.user = patient;
        console.log('true');
        return true;
    });
}

var isLoggedIn = function isLoggedIn(patientArea, doctorArea) {
    return function (req, res, next) {
        if (!doctorArea && patientArea) {
            if (isApiAuthenticated(req)) {
                req.authStrategy = 'Header';
                next();
            }
        }

        if (!patientArea) {
            if (req.isAuthenticated()) next();
        }

        if (patientArea && doctorArea) {
            if (!req.isAuthenticated()) {
                console.log('must be there');
                if (isApiAuthenticated(req)) {
                    req.authStrategy = 'Header';
                    next();
                } else {
                    return res.send({ error: 'Unauthorized' });
                }
            } else {
                next();
            }
        }
    };
};

module.exports.isLoggedIn = isLoggedIn;

//# sourceMappingURL=reqHandler-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map

//# sourceMappingURL=reqHandler-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled-compiled.js.map