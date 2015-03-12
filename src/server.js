/* Entry point for the server. */

var config = require('./server/config');
var express = require('express');
var expressApp = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

cors.methods = ['GET', 'PUT', 'POST', 'DELETE'];
cors.allowedHeaders = ['Content-Type', 'Authorization'];

expressApp.use(cors());
expressApp.use(bodyParser.json());
require('./server/routes')(expressApp);

mongoose.connect(config.db_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

expressApp.listen(config.api_port);
console.log("Listening port: "+config.api_port);
