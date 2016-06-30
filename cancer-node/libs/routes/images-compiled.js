'use strict';

/**
 * Created by AsTex on 25.06.2016.
 */
var crypto = require('crypto');
var express = require('express');
var multer = require('multer');
var passport = require('passport');
var router = express.Router();
var path = require('path'),
    fs = require('fs');

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var Image = require('../model/image');
var requestHandler = require('../extra/reqHandler');

router.post('/', requestHandler.isLoggedIn(true, false), multer({ dest: './uploads/' }).single('upl'), function (req, res) {
    var newName = crypto.randomBytes(16).toString('hex');
    var tempPath = req.file.path,
        targetPath = path.resolve('./uploads/' + newName + '.jpg');
    console.log(targetPath);
    var extension = path.extname(req.file.originalname).toLowerCase();
    if (extension === '.png' || extension === '.jpg' || extension == '.jpeg') {
        fs.rename(tempPath, targetPath, function (err) {
            if (err) {
                res.statusCode = 500;
                res.send({ error: 'Internal server error' });
            } else {
                var img = new Image({
                    localPath: targetPath
                });
                img.save(function (err) {
                    if (!err) {
                        return res.send({ status: 'Ok', imageId: img._id });
                    } else {
                        console.log(err);
                        res.statusCode = 500;
                        return res.send({ error: 'Internal server error' });
                    }
                });
            }
        });
    } else {
        fs.unlink(tempPath, function () {
            res.statusCode = 500;
            return res.send({ error: 'Only .png, .jpg, .jpeg files are allowed' });
        });
    }
});

router.get('/:id', function (req, res) {
    Image.findById(req.params.id, function (err, img) {
        if (!err) {
            return res.sendfile(path.resolve(img.localPath));
        } else {
            if (!img) {
                res.statusCode = 404;
                return res.send({ error: 'No image found' });
            }
            res.statusCode = 500;
            return res.send({ error: 'Internal server error' });
        }
    });
});

module.exports = router;

//# sourceMappingURL=images-compiled.js.map