var mongoose = require('mongoose');
var User = require('./models/user');
var Blog = require('./models/blog');
var Post = require('./models/post');
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.getUsers = function (request, response) {
    User.find({}, "-_id -__v -username -password -token")
    .populate('blogs')
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .exec(function (err, users) {
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
                    data: user2._id,
                    token: user2.token
                });
            })
        }
    });
}

exports.getUser = function(request, response) {
    User.findOne({'_id': request.params.userid})
    .populate('blogs').exec(function (err, user) {
        if (err) {
            return response.send(err);
        } else if (user == null) {
            response.status(404).json({'message': 'Unknown user.'});
        } else {
            var userInfo = {
                display_name: user.display_name,
                description: user.description,
                created_at: user.created_at,
                blogs: user.blogs,
                blogs_followed: user.blogs_followed,
                profile_picture: user.profile_picture
            }
            response.json(userInfo);
        }
    });
};

exports.updateUser = function(request, response) {
    User.update({ '_id': request.userid }, request.body, function(err, numRows) {
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
    User.remove({ '_id': request.userid }, function(err) {
        if (err) return console.error(err);
    });
};
