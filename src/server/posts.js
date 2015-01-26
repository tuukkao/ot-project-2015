var dummydata = require("./dummy");

function writeResponse(response, content) {
    response.header("Content-Type", "application/json");
    response.end(content)
}

exports.getPostsForBlog = function(request, response) {
    var blogid = request.param("blogid");
    dummydata.getAllPosts(blogid, response, writeResponse);
};

exports.addPostToBlog = function(request, response) {

    response.send(request.params);
};

exports.getPost = function(request, response) {
    var blogid = request.param("blogid");
    var postid = request.param("postid");
    dummydata.getPost(blogid, postid, response, writeResponse);
};

exports.updatePost = function(request, response) {
    response.send(request.params);
};

exports.deletePost = function(request, response) {
    response.send(request.params);
};
