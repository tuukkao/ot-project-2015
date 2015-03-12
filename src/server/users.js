/* Api functions for the /user endpoint. */

var mongoose = require('mongoose');
var User = require('./models/user');
var Blog = require('./models/blog');
var Post = require('./models/post');
var jwt = require('jsonwebtoken');
var config = require('./config');

/* Get a list of all the users. */
exports.getUsers = function (request, response) {
    User.find({}, "-__v -username -password -token")
    .populate('blogs')
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .exec(function (err, users) {
        if (err) return response.send(err);
        response.json(users);
    });
}

/* Registers a new user. */
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

/* Get a single user's profile. */
exports.getUser = function(request, response) {
    User.findOne({'_id': request.params.userid})
    .populate('blogs')
    .populate('blogs_followed')
    .exec(function (err, user) {
        if (err) {
            return response.send(err);
        } else if (user == null) {
            response.status(404).json({'message': 'Unknown user.'});
        } else {
            var userInfo = {
                _id: user._id,
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

/* Update user profile. */
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

/* Deletes a user. */
exports.deleteUser = function(request, response) {
    User.remove({ '_id': request.user_id }, function(err) {
        if (err) return console.error(err);
    });
};
