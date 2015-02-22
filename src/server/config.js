var config = {};

config.api_port = process.env.PORT || 8080;

config.db_uri = 'mongodb://localhost:27017/turinadb';

config.jwt_key = 'tur1n4Bl0g1Tj4T0K3n1Ns4L4IsUU5';

config.img_dump_path = 'http://localhost/images/';

module.exports = config;
