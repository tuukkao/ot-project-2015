var mongoose = require('mongoose');
var Blog = require("./models/blog");
var User = require('./models/user');

exports.getBlogs = function(request, response) {
    Blog.find()
    .populate('author', '-blogs')
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .exec(function(err, blogs) {
        if (err) return response.send(err);
        response.json(blogs);
    });
};

// Get specific user's blogs.
exports.getBlogsForUser = function(request, response) {
    Blog.find({ 'author': request.params.userid })
    .populate('author', '-blogs')
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .exec(function(err, blogs) {
        if (err) return response.send(err);
        response.json(blogs);
    })
}

exports.addBlog = function(request, response) {
    blog = new Blog(request.body);
    blog.save(function(err) {
        if (err) return response.send(err);
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
