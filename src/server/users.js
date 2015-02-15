var mongoose = require('mongoose');
var User = require('./models/user');
var Blog = require('./models/blog');
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.getUsers = function (request, response) {
    User.find().populate('blogs').exec(function (err, users) {
        if (err) return response.send(err);
        response.json(users);
    });
}

exports.addUser = function (request, response)
{
    user = new User(request.body);
    user.save(function(err, user) {
        if (err)  {
            return response.send(err);
        } else {
            user.token = jwt.sign(user, config.jwt_key);
            user.save(function(err, user2) {
                if (err) return response.send(err);
                response.json({
                    type: true,
                    data: user2,
                    token: user2.token
                });
            })
        }
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
    User.update({ '_id': request.user_id }, request.body, function(err, numRows) {
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
    User.remove({ '_id': request.user_id }, function(err) {
        if (err) return console.error(err);
    });
};
