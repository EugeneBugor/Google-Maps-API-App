var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
mongoose.Promise = global.Promise;//mpromise (mongoose's default promise library) is deprecated

module.exports = mongoose;
