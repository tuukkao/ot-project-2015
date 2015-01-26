module.exports = function(app){
    var blogs = require("./blogs");
    var users = require("./users");
    var posts = require("./posts");
    var comments = require("./comments");

    app.get('/blogs', blogs.getBlogs);
    app.post('/blogs', blogs.addBlog);

    app.put('/blog/:blogid', blogs.updateBlog);
    app.delete('/blog/:blogid', blogs.deleteBlog);

    app.get('/blog/:blogid/posts', posts.getPostsForBlog);
    app.post('/blog/:blogid/posts', posts.addPostToBlog);

    app.get('/blog/:blogid/post/:postid', posts.getPost);
    app.put('/blog/:blogid/post/:postid', posts.updatePost);
    app.delete('/blog/:blogid/post/:postid', posts.deletePost);

    app.get('/blog/:blogid/post/:postid/comments', comments.getCommentsForPost)
    app.post('/blog/:blogid/post/:postid/comments', comments.addCommentToPost);

    app.get('/blog/:blogid/post/:postid/comments/:commentid', comments.getComment);
    app.put('/blog/:blogid/post/:postid/comments/:commentid', comments.updateComment);
    app.delete('/blog/:blogid/post/:postid/comments/:commentid', comments.deleteComment);

    app.get('/users', users.getUsers);
    app.post('/users', users.addUser);

    app.get('/user/:username', users.getUser);
    app.put('/user/:username', users.updateUser);
    app.delete('/user/:username', users.deleteUser);
}
