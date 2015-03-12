/* Api functions for the /post/<postid>/comment endpoint. */

var mongoose = require("mongoose");
var Post = require("./models/post");

/* Gets all the comments for the given post. */
exports.getCommentsForPost = function(request, response) {
    Post.findOne({'_id': request.params.postid}, 'comments')
    .populate('comments.author', '_id display_name profile_picture')
    .exec( function(err, post) {
        if (err) return response.send(err);
        response.json(post.comments);
    });
};

/* Adds a new comment to the given post. */
exports.addCommentToPost = function(request, response) {
    Post.findOne({'_id': request.params.postid}, 'comments', function (err, post) {
        if (err) return request.send(err);
        // Todo: Don't accept the request body as is.
        post.comments.addToSet(request.body);
        post.save(function(err) {
            if(err) return response.send(err);
            response.json({'message': 'Comment added'});
        });
    });
};

/* Gets a single comment with the given post and comment id's. */
exports.getComment = function(request, response) {
    Post.findOne({'_id': request.params.postid}, 'comments', function(err, post) {
        if(err) return response.send(err);
        comment = post.comments.id(request.params.commentid);

        if (comment == null) {
            response.status(404).json({'message': 'Unknown comment.'});
        } else {
            response.json(comment);
        }
    });
};

/* Modifies a comment. */
exports.updateComment = function(request, response) {
    set = {};
    for (var key in request.body) {
        set['comments.$.' + key] = request.body[key];
    }

    Post.update({'_id': request.params.postid,
    'comments._id': request.params.commentid, 'comments.author': request.user_id},
    {'$set': set }, function(err) {
        if (err) return response.send(err);
        response.json({'message': 'Comment updated.'});
    });
};

/* Deletes a comment. */
exports.deleteComment = function(request, response) {
    Post.findOne({'_id': request.params.postid}, 'comments', function(err, post) {
        if(err) return response.send(err);
        comment = post.comments.id(request.params.commentid);
        // Not sure if this even works !!
        comment = comment.author(request.user_id);

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
