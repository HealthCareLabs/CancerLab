/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,

    Doctor = new Schema({
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        secondName:{
            type:String,
            required:false
        },
        organisation:{
            type:String,
            required:true
        },
        position:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true
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
        sessionId:{
            type:String,
            unique:true
        }
    });

Doctor.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

Doctor.virtual('userId')
    .get(function () {
        return this.id;
    });

Doctor.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        this.sessionId = crypto.randomBytes(16).toString('hex');
        this.hashedPassword = this.encryptPassword(password);

    })
    .get(function() { return this._plainPassword; });

Doctor.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

Doctor.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.salt;
    return obj;
};

module.exports = mongoose.model('Doctor', Doctor);