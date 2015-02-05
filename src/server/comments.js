var mongoose = require("mongoose");
var Post = require("./models/post");

exports.getCommentsForPost = function(request, response) {
    Post.findOne({'parent_blog': request.params.blogid, '_id': request.params.postid}, 'comments', function(err, post) {
        if (err) return response.send(err);
        response.json(post.comments);
    });
};

exports.addCommentToPost = function(request, response) {
    Post.findOne({'parent_blog': request.params.blogid, '_id': request.params.postid}, 'comments', function (err, post) {
        if (err) return request.send(err);
        post.comments.addToSet(request.body);
        post.save(function(err) {
            if(err) return response.send(err);
            response.json({'message': 'Comment added'});
        });
    });
};

exports.getComment = function(request, response) {
    Post.findOne({'parent_blog': request.params.blogid, '_id': request.params.postid}, 'comments', function(err, post) {
        if(err) return response.send(err);
        comment = post.comments.id(request.params.commentid);
        
        if (comment == null) {
            response.status(404).json({'message': 'Unknown comment.'});
        } else {
            response.json(comment);
        }
    });
};

exports.updateComment = function(request, response) {
    set = {};
    for (var key in request.body) {
        set['comments.$.' + key] = request.body[key];
    }
    
    Post.update({'parent_blog': request.params.blogid, '_id': request.params.postid,
    'comments._id': request.params.commentid},
    {'$set': set }, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Comment updated.'});
    });
};

exports.deleteComment = function(request, response) {
    Post.findOne({'parent_blog': request.params.blogid, '_id': request.params.postid}, 'comments', function(err, post) {
        if(err) return response.send(err);
        comment = post.comments.id(request.params.commentid);
        
        if (comment == null) {
            response.status(404).json({'message': 'Unknown document.'});
        } else {
            comment.remove();
            post.save(function(err) {
                if (err) return response.send(err);
            response.json({'message': 'Comment deleted.'});
            });
        }
    });
};
