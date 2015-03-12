/* Api functions for the /post endpoint. */

var mongoose = require("mongoose");
var Post = require("./models/post");
var Blog = require("./models/blog");
var User = require("./models/user")

/* Get a (filtered) list of posts. */
exports.getPosts = function(request, response) {
    filters = {};
    if (request.query.parent_blog) filters.parent_blog = request.query.parent_blog;
    if (request.query.author) filters.author = request.query.author;
    if (request.query.created_at) filters.created_at = request.query.created_at;
    if (request.query.modified_At) filters.modified_At = request.query.modified_at;
    if (request.query.tag) filters.tags = request.query.tag;
    Post.find(filters, "-comments",
              { sort: { created_at: -1 }})
    .skip(request.query.limit *(request.query.page -1)).limit(request.query.limit)
    .populate({
        path    : 'parent_blog',
        select  : '_id title tags',
        model   : 'Blog'
        })
    .populate({
        path    : 'author',
        select  : '_id display_name profile_picture',
        model   : 'User'
        })
    .exec(function(err, posts) {
        if (err) response.send(err);
        response.json(posts);
    });
};

/* Adds a new post. */
exports.addPost = function(request, response) {
    // Todo: Right now the user can add a post to any blog they like.
    // Preventing that would be nice.
    post = new Post(request.body);
    post.save(function(err) {
        if(err) return response.send(err);
        response.json({'message': 'Post added.'});
    });
};

/* Get a single post. */
exports.getPost = function(request, response) {
    Post.findOne({'parent_blog': request.params.blogid, '_id': request.params.postid}, "-comments", function(err, post) {
        if (err) {
            return response.send(err);
        } else if (post == null) {
            response.status(404).json("Unknown post.");
        } else {
            response.json(post);
        }
    });
};

/* Updates a post. */
exports.updatePost = function(request, response) {
    Post.update({'_id': request.params.postid, 'author': request.user_id}, function(err, numRows) {
        if (err) {
            return response.send(err);
        } else if (numRows == 0) {
            response.status(404).json({'message': 'Unknown post.'});
        } else {
            response.json({'message': 'Post updated.'});
        }
    });
};

/* Deletes a post. */
exports.deletePost = function(request, response) {
    Post.remove({'_id': request.params.postid, 'parent_blog.author': request.user_id}, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Post deleted.'});
    });
};
