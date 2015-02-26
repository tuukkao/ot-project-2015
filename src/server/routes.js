module.exports = function(app){
    var blogs = require("./blogs");
    var users = require("./users");
    var posts = require("./posts");
    var comments = require("./comments");
    var authorize = require("./auth");

    app.post('/login', authorize.authenticate);

    app.get('/blog', blogs.getBlogs);
    app.get('/blog/:userid', blogs.getBlogsForUser);

    app.post('/blog', authorize.confirmAuth, blogs.addBlog);

    app.put('/blog/:blogid', authorize.confirmAuth, blogs.updateBlog);
    app.delete('/blog/:blogid', authorize.confirmAuth, blogs.deleteBlog);

    app.get('/post', posts.getPosts);
    app.post('/post', authorize.confirmAuth, posts.addPost);

    app.get('/post/:postid', posts.getPost);
    app.put('/post/:postid', authorize.confirmAuth, posts.updatePost);
    app.delete('/post/:postid', authorize.confirmAuth, posts.deletePost);

    app.get('/post/:postid/comment', comments.getCommentsForPost)
    app.post('/post/:postid/comment', authorize.confirmAuth, comments.addCommentToPost);

    app.get('/post/:postid/comment/:commentid', comments.getComment);
    app.put('/post/:postid/comments/:commentid', authorize.confirmAuth, comments.updateComment);
    app.delete('/post/:postid/comments/:commentid', authorize.confirmAuth, comments.deleteComment);

    app.get('/user', users.getUsers);
    app.post('/user', authorize.register, users.addUser);

    app.get('/user/:userid', users.getUser);
    app.put('/user/:userid', authorize.confirmAuth, users.updateUser);
    app.delete('/user/:userid', authorize.confirmAuth, users.deleteUser);
}
