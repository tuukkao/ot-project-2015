var config = require('./config');
var express = require('express');
var expressApp = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

expressApp.use(bodyParser.json());
require('./routes')(expressApp);

mongoose.connect(config.db_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
expressApp.listen(config.api_port);
