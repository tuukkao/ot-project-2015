var mongoose = require('mongoose');
var User = require('./models/user');

exports.getUsers = function (request, response) {
    User.find(function (err, users) {
        if (err) return Console.error(err);
        response.json(users);
    });
}

exports.addUser = function (request, response)
{
    console.log(request.body);
    user = new User(request.body);
    user.save(function(err) {
        if (err) return console.error(err);
    });
}

exports.getUser = function(request, response) {
    User.findOne({'username': request.params.username}, function (err, user) {
        if (err) return Console.error(err);
        response.json(user);
    });
};

exports.updateUser = function(request, response) {
    response.send(request.params);
};

exports.deleteUser = function(request, response) {
    response.send(request.params);
};
