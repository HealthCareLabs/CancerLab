'use strict';

/**
 * Created by AsTex on 25.06.2016.
 */
var express = require('express');
var passport = require('passport');
var treatmentRouter = express.Router();
var issueRouter = express.Router({ mergeParams: true });
treatmentRouter.use('/:treatmentId/issues', issueRouter);
var path = require('path'),
    fs = require('fs');

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var Patient = require(libs + 'model/patient').Patient;
var Treatment = require(libs + 'model/treatment');
var Issue = require(libs + 'model/issue');
var Image = require(libs + 'model/image');
var IssueComment = require(libs + 'model/issue');
var ObjectUpdater = require('../extra/objectHandler');
var requestHandler = require('../extra/reqHandler');

treatmentRouter.get('/', requestHandler.isLoggedIn(true, true), function (req, res) {
    if (req.authStrategy === 'Header') {
        console.log(req.user);
        var findTreatmentsQuery = Treatment.find({ 'author': req.user._id });
        findTreatmentsQuery.sort('-created');
        findTreatmentsQuery.populate('issues');
        findTreatmentsQuery.exec(function (err, treatments) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal server error' });
            } else {
                if (!treatments) {
                    return res.send({ status: 'OK', treatments: [] });
                } else {
                    return res.send({ status: 'OK', treatments: treatments });
                }
            }
        });
    } else {
        var offset = 0;
        var limit = 10;
        if (req.body.offset) {
            offset = req.params.offset;
        }
        if (req.body.limit) {
            limit = req.params.limit;
        } else {
            limit = 10;
        }
        //{skip: offset, limit: limit, desc: 'created'}
        var query = Treatment.find({});
        query.skip(offset);
        query.limit(limit);
        query.sort('-created');
        query.exec(function (err, treatments) {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Internal server error' });
            } else {
                if (!treatments) {
                    return res.send({ status: 'OK', treatments: [] });
                } else {
                    offset = offset + treatments.length;
                    return res.send({ status: 'OK', offset: offset, treatments: treatments });
                }
            }
        });
    }
});

treatmentRouter.get('/:id/lastImage', function (req, res) {
    Treatment.findById(req.params.id).populate('issues').exec(function (err, treatment) {
        if (!err) {
            var lastImage = "";
            treatment.issues.forEach(function (item, i, arr) {
                lastImage = item.images[item.images.length - 1];
            });
            Image.findById(lastImage, function (err, img) {
                if (!err) {
                    return res.sendFile(path.resolve(img.localPath));
                } else {
                    res.statusMessage = 404;
                    res.send({ status: 'Not Found' });
                }
            });
        }
    });
});

treatmentRouter.post('/', requestHandler.isLoggedIn(true, false), function (req, res) {
    var treatment = new Treatment({
        author: req.user,
        title: req.body.title,
        bodyField: req.body.bodyField
    });
    // ObjectUpdater(treatment);
    treatment.save(function (err) {
        if (!err) {
            log.info('Treatment created');
            return res.send({ status: 'OK', treatmentId: treatment._id });
        } else {
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                return res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server Error' });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});

issueRouter.get('/', requestHandler.isLoggedIn(true, true), function (req, res) {
    Treatment.findById(req.params.treatmentId).populate('author').populate('issues').sort('-issues.created').exec(function (err, treatment) {
        if (err) {
            res.statusCode = 500;
            return res.send({ error: 'Internal server error' });
        } else {
            if (!treatment) {
                res.statusCode = 404;
                return res.send({ error: 'Treatment not found' });
            } else {

                if (req.authStrategy === 'Header') {
                    log.info(treatment.author.id);
                    log.info(req.user.id);

                    if (treatment.author.id != req.user._id) {
                        res.statusCode = 401;
                        return res.send({ error: 'You can request only your profile' });
                    } else {

                        var issues = treatment.issues.reverse();
                        return res.send({ status: 'OK', issues: issues });
                    }
                }
            }
        }
    });
});

issueRouter.post('/', requestHandler.isLoggedIn(true, false), function (req, res) {
    Treatment.findOne({ '_id': req.params.treatmentId }).populate('author').exec(function (err, treatment) {
        if (err) {
            res.statusCode = 500;
            return res.send({ error: 'Internal server error' });
        } else {
            if (!treatment) {
                res.statusCode = 404;
                return res.send({ error: 'Treatment not found' });
            } else {
                var issue = new Issue({
                    size: req.body.size,
                    surface: req.body.surface,
                    bleeding: req.body.bleeding,
                    colorModification: req.body.ColorModification || req.body.colorModification,
                    surfaceModification: req.body.SurfaceModification || req.body.surfaceModification,
                    lymphEnlarging: req.body.LymphEnlarging || req.body.lymphEnlarging,
                    patientComment: req.body.PatientComment || req.body.patientComment,
                    images: req.body.Images || req.body.images
                });
                ObjectUpdater(issue);
                issue.save(function (err) {
                    if (!err) {
                        log.info('Issue created in treatment %s', treatment._id);
                        Treatment.findByIdAndUpdate(treatment._id, { $push: { "issues": issue } }, { safe: true, upsert: true, new: true }, function (err) {
                            if (!err) {
                                return res.send({ status: 'OK', issue: issue });
                            }
                        });
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
            }
        }
    });
});

issueRouter.put('/:issueId', requestHandler.isLoggedIn(true, true), function (req, res) {
    Issue.findOne({ '_id': req.params.issueId }).exec(function (err, issue) {
        if (err) {
            res.statusCode = 500;
            return res.send({ error: 'Internal server error' });
        } else {
            if (!issue) {
                res.statusCode = 404;
                return res.send({ error: 'Treatment not found' });
            } else {
                var comment = new IssueComment({
                    author: req.user,
                    comment: req.body.comment,
                    commentType: req.body.commentType
                });
                comment.save(function (err) {
                    if (!err) {
                        Issue.findByIdAndUpdate(issue._id, { $push: { 'comments': comment } }, {
                            safe: true,
                            upsert: true,
                            new: true
                        }, function (err) {
                            if (!err) {
                                Treatment.findByIdAndUpdate(req.params.treatmentId, { $set: { 'state': 'Answered' } }).exec(function (err, treatment) {
                                    if (!err) {

                                        return res.send({ status: 'OK', treatment: treatment, issue: issue });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = treatmentRouter;

//# sourceMappingURL=treatments-compiled.js.map