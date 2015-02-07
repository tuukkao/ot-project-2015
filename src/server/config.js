var config = {};

config.api_port = process.env.PORT || 8080;

config.db_uri = 'mongodb://localhost:27017/turinadb';

module.exports = config;
