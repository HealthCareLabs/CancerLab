/**
 * Created by AsTex on 27.06.2016.
 */
var crypto = require('crypto');

var updateObject = function (object){
    object.ETag = crypto.randomBytes(10).toString('hex');
};

module.exports = updateObject;