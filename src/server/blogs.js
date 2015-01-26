var dummydata = require("./dummy");

function writeResponse(response, content) {
    response.header("Content-Type", "application/json");
    response.end(content)
}

exports.getBlogs = function(request, response) {
    dummydata.getAllBlogs(response, writeResponse);

};

exports.addBlog = function(request, response) {
    response.send(request.params);
};

exports.updateBlog = function(request, response) {
    response.send(request.params);
};

exports.deleteBlog = function(request, response) {
    response.send(request.params);
};
