var mongoose = require('mongoose');
var Blog = require("./models/blog");
var User = require('./models/user');

exports.getBlogs = function(request, response) {
    Blog.find()
    .populate('author', '-blogs')
    .exec(function(err, blogs) {
        if (err) return response.send(err);
        response.json(blogs);
    });
};

exports.addBlog = function(request, response) {
    blog = new Blog(request.body);
    blog.save(function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Blog added'});
    });
};

exports.updateBlog = function(request, response) {
    Blog.update({'_id': request.params.blogid}, request.body, function(err, numRows) {
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
    Blog.remove({'_id': request.params.blogid}, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Blog deleted.'});
    });
};
