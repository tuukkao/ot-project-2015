var fs = require('fs');

exports.getAllPosts = function(blogid, response, writeResponse) {
    fs.readFile("./dummydata/posts.json", function(err, data) {
        if (err) throw err;
        var json = JSON.parse(data);
        json.posts.forEach(function(item, index) {
            item.blog_id = blogid;
        })
        writeResponse(response, JSON.stringify(json));
    });
}

exports.getPost = function(blogid, postid, response, writeResponse) {
    fs.readFile("./dummydata/posts.json", function(err, data) {
        if (err) throw err;
        var json = JSON.parse(data);
        json.posts[0].blog_id = blogid;
        json.posts[0]._id = postid;
        writeResponse(response, JSON.stringify(json.posts[0]));
    });

}

exports.getAllBlogs = function(response, writeResponse) {
    fs.readFile("./dummydata/blogs.json", function(err, data) {
        if (err) throw err;

        writeResponse(response, data);
    });
}
