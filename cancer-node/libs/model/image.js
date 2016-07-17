/**
 * Created by AsTex on 25.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Image Model
var Image = new Schema({
    localPath: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Image', Image);