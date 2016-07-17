/**
 * Created by AsTex on 25.06.2016.
 */
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Patient Model
var Patient = new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    secondName:{type:String, required:false},
    email:{type:String, required:true,unique:true},
    phone:{type:String, required:true, unique:true},
    location:{type:String, required:true},
    gender:{
        type:String,
        enum:['man','woman'],
        required:true
    },
    birthDate:{
        type:Date,
        required:true
    },
    policyNumber:{
        type:String,
        required:true
    },
    registrationDate:{
        type:Date,
        default:Date.now
    },
    lastMessageDate:{
        type:Date,
        required:false
    },
    hashedPassword:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        default:Date.now
    },
    apiKey:{
        type:String,
        unique:true
    }
});

Patient.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

Patient.virtual('userId')
    .get(function () {
        return this.id;
    });

Patient.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        this.apiKey = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

Patient.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

Patient.methods.checkApiKey = function(apiKey){
    return apiKey === this.apiKey;
};
Patient.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.salt;
    delete obj.apiKey;
    return obj;
};

module.exports.Patient = mongoose.model('Patient', Patient);