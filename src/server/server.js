var config = require('./config');
var express = require('express');
var expressApp = express();
var bodyParser = require('body-parser');

require('./routes')(expressApp);
expressApp.use(bodyParser.json);

expressApp.listen(config.api_port);
