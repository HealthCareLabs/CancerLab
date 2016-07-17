/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Issue = require('./issue');
var Patient = require('./patient').Patient;

//Patient Model
var Treatment = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    title:{
        type:String,
        required:true
    },
    bodyField:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        default:Date.now
    },
    state:{
        type:String,
        enum:['Answered','Not answered', 'Viewed'],
        default:'Not answered'
    },
    issues:[{type:Schema.Types.ObjectId, ref:'Issue'}],

    result:{
        type:String,
        enum:['Dangerous','Safe','Warning']
    },
    ETag:{
        type:String
    }
});

module.exports = mongoose.model('Treatment', Treatment);