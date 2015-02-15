var mongoose = require('mongoose');
var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');

exports.confirmAuth = function(request, response, next) {
    var token;
    var header = request.headers["authorization"];
    if (typeof header !== 'undefined') {
        var bearer = header.split(" ");
        token = bearer[0];
        jwt.verify(token, config.jwt_key, function(err, decoded) {
            if(err) {
                response.send(401);
            } else {
                request.user_id = decoded._id;
                next();
            }
        });
    }
}

exports.authenticate = function(request, response) {
    User.findOne({ 'username': request.body.username, 'password': request.body.password }, function(err, user) {
        if (err) {
            response.json({
                type: false,
                data: "Error occured " +err
            });
        } else {
            if (user) {
                response.json({
                    token: user.token,
                    _id: user._id
                });
            } else {
                response.json({
                    type: false,
                    data: "Incorrect login credentials."
                });
            }
        }
    });
}

exports.register = function(request, response, next) {
    User.findOne(
        { $or: [{ 'email': request.body.email }, { 'username': request.body.email }] }, function(err, user) {
            if (err) {
                response.json({
                    type: false,
                    data: 'Error occured '+err
                });
            } else {
                if (user) {
                    response.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    next();
                }
            }
        });
    }
