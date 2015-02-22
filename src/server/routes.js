module.exports = function(app){
    var blogs = require("./blogs");
    var users = require("./users");
    var posts = require("./posts");
    var comments = require("./comments");
    var authorize = require("./auth");

    app.post('/login', authorize.authenticate);

    app.get('/blogs', blogs.getBlogs);

    app.post('/blogs', authorize.confirmAuth, blogs.addBlog);

    app.put('/blog/:blogid', authorize.confirmAuth, blogs.updateBlog);
    app.delete('/blog/:blogid', authorize.confirmAuth, blogs.deleteBlog);

    app.get('/blog/:blogid/posts', posts.getPostsForBlog);
    app.post('/blog/:blogid/posts', authorize.confirmAuth, posts.addPostToBlog);

    app.get('/blog/:blogid/post/:postid', posts.getPost);
    app.put('/blog/:blogid/post/:postid', authorize.confirmAuth, posts.updatePost);
    app.delete('/blog/:blogid/post/:postid', authorize.confirmAuth, posts.deletePost);

    app.get('/blog/:blogid/post/:postid/comments', comments.getCommentsForPost)
    app.post('/blog/:blogid/post/:postid/comments', authorize.confirmAuth, comments.addCommentToPost);

    app.get('/blog/:blogid/post/:postid/comments/:commentid', comments.getComment);
    app.put('/blog/:blogid/post/:postid/comments/:commentid', authorize.confirmAuth, comments.updateComment);
    app.delete('/blog/:blogid/post/:postid/comments/:commentid', authorize.confirmAuth, comments.deleteComment);

    app.get('/users', users.getUsers);
    app.post('/users', authorize.register, users.addUser);

    app.get('/user/:userid', users.getUser);
    app.put('/user/:userid', authorize.confirmAuth, users.updateUser);
    app.delete('/user/:userid', authorize.confirmAuth, users.deleteUser);
}
