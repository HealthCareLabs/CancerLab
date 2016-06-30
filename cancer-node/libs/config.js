/**
 * Created by AsTex on 25.06.2016.
 */
var nconf = require('nconf');

nconf.argv()
.env()
.file({file:'./config.json'});

module.exports = nconf;