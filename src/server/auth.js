var mongoose = require('mongoose');
var User = require('./models/user');

exports.confirmAuth = function(request, response, next) {
    var token;
    var header = request.headers["authorization"];
    if (typeof header !== 'undefined') {
        var bearer = header.split(" ");
        token = bearer[1];
        User.findOne({ 'token': token }, function(err, user) {
            if (err) {
                response.json({
                    type: false,
                    data: "Error occured " +err
                });
            } else {
                if (user) {
                    request.token = token;
                    next();
                } else {
                    response.send(403);
                }
            }
        });
    }
}

exports.authenticate = function(request, response) {
    console.log("Trying to log in. User: "+ request.body.username+" Password: "+ request.body.password);
    User.findOne({ 'username': request.body.username, 'password': request.body.password }, function(err, user) {
        console.log("Query complete.");
        if (err) {
            response.json({
                type: false,
                data: "Error occured " +err
            });
        } else {
            if (user) {
                response.json({
                    type: true,
                    data: user,
                    token: user.token
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
    console.log("Trying to register user.");
    User.findOne(
        { $or: [{ 'email': request.body.email }, { 'username': request.body.email }] }, function(err, user) {
            console.log("Query complete.");
            if (err) {
                console.log("Error occured.");
                response.json({
                    type: false,
                    data: 'Error occured '+err
                });
            } else {
                if (user) {
                    console.log("User exists.");
                    response.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    console.log("Moving to next function!, next.");
                    next();
                }
            }
        });
    }
