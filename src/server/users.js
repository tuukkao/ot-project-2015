var mongoose = require('mongoose');
var User = require('./models/user');
var Blog = require("./models/blog");

exports.getUsers = function (request, response) {
    User.find().populate('blogs').exec(function (err, users) {
        if (err) return response.send(err);
        response.json(users);
    });
}

exports.addUser = function (request, response)
{
    user = new User(request.body);
    user.save(function(err) {
        if (err) return response.send(err);
        response.json({'message': 'User added.'});
    });
}

exports.getUser = function(request, response) {
    User.findOne({'username': request.params.username})
    .populate('blogs').exec(function (err, user) {
        if (err) {
            return response.send(err);
        } else if (user == null) {
            response.status(404).json({'message': 'Unknown user.'});
        } else {
            response.json(user);
        }
    });
};

exports.updateUser = function(request, response) {
    User.update({'username': request.params.username}, request.body, function(err, numRows) {
        if (err) {
            return response.send(err);
        }else if (numRows == 0) {
            response.status(404).json({'message': 'Unknown user.'});
        } else {
            response.json({'message': 'User updated.', 'username': request.params.username});
        }
    });
};

exports.deleteUser = function(request, response) {
    User.remove({ 'username': request.params.username }, function(err) {
        if (err) return console.error(err);
    });
};
