var express = require('express');
var expressApp = express();

require('./routes')(expressApp);

expressApp.listen(8080);
