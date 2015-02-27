var mongoose = require('mongoose');
var Blog = require("./models/blog");
var User = require('./models/user');

exports.getBlogs = function(request, response) {
    filters = {};
    if (request.query.author) filters.author = request.query.author;
    if (request.query.created_at) filters.created_at = request.query.created_at;
    
    Blog.find(filters)
    .populate('author', '_id display_name profile_picture')
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .exec(function(err, blogs) {
        if (err) return response.send(err);
        response.json(blogs);
    });
};

exports.addBlog = function(request, response) {
    blog = new Blog(request.body);
    blog.save(function(err) {
        if (err) return response.send(err);
        User.findOne({"_id": request.body.author}, function(err, user) {
            user.blogs.push(blog._id);
            user.save(function(err) {
                if (err) return response.send(err);
            });
        });
        response.json({'message': 'Blog added'});
    });
};

exports.updateBlog = function(request, response) {
    console.log(request.user_id);
    Blog.update({'_id': request.params.blogid, 'author': request.user_id}, request.body, function(err, numRows) {
        if (err) {
            return response.send(err);
        } else if (numRows == 0) {
            response.status(404).json({'message': 'Unknown blog.'});
        } else {
            response.json({'message': 'Updated blog.'});
        }
    });
};

exports.deleteBlog = function(request, response) {
    Blog.remove({'_id': request.params.blogid, 'author': request.user_id}, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Blog deleted.'});
    });
};
