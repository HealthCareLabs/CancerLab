/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose');
var Doctor = require('./doctor')
var Schema = mongoose.Schema;

//Patient Model
var IssueComment = new Schema({
    author: {
        type:Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    comment:{
        type:String
    },
    created: {
        type: Date,
        required:true,
        default: Date.now
    }
});

module.exports = mongoose.model('IssueComment',IssueComment);