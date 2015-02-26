var mongoose = require("mongoose");
var Post = require("./models/post");
var Blog = require("./models/blog");

exports.getPosts = function(request, response) {
    if(request.params.blogid !== undefined
    && request.params.blogid !== null) {
        console.log("seraching with blogid");
        Post.find({'parent_blog': request.params.blogid}, "-comments",
                  { sort: { created_at: -1 }}, function(err, posts) {
            if (err) response.send(err);
            else response.json(posts);
        });
    } else {
        Post.find({},"-comments", { sort: { created_at: -1 }},
        function(err, posts) {
            if (err) response.send(err);
            else response.json(posts);
        });
    }
};

exports.addPost = function(request, response) {
    request.body.parent_blog = request.params.blogid;
    post = new Post(request.body);
    post.save(function(err) {
        if(err) return response.send(err);
        response.json({'message': 'Post added.'});
    });
};

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

exports.updatePost = function(request, response) {
    Post.update({'_id': request.params.postid, 'parent_blog.author': request.user_id}, function(err, numRows) {
        if (err) {
            return response.send(err);
        } else if (numRows == 0) {
            response.status(404).json({'message': 'Unknown post.'});
        } else {
            response.json({'message': 'Post updated.'});
        }
    });
};

exports.deletePost = function(request, response) {
    Post.remove({'_id': request.params.postid, 'parent_blog.author': request.user_id}, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Post deleted.'});
    });
};
