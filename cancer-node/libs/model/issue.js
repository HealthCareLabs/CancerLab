/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose');
var IssueComment = require('./issueComment');
var Schema = mongoose.Schema;

//Issue Model
var Issue = new Schema({
    size: {
        type: String,
        required: true
    },
    colorModification: {
        type: String,
        enum: ['Darker', 'Brighter', 'No changes'],
        required:true
    },
	surface:{
		type:String,
		required:true
	},
    bleeding: {
        type: String,
        enum: ['Yes', 'No'],
        required:true
    },
    lymphEnlarging: {
        type: String,
        enum: ['Yes', 'No'],
        required:true

    },
    patientComment: {
        type: String,
        required: false
    },
    images: [{type: String}],
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'IssueComment'
    },
    ETag: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required:true,
        default:Date.now
    }

});

module.exports = mongoose.model('Issue', Issue);