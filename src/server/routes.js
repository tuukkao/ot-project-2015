/* Express api routes. */

module.exports = function(app){
    var paginate = require("express-paginate");
    var blogs = require("./blogs");
    var users = require("./users");
    var posts = require("./posts");
    var comments = require("./comments");
    var authorize = require("./auth");
    var config = require("./config");

    app.use(paginate.middleware(10, 50));

    app.post(config.node_path+'/login', authorize.authenticate);

    app.get(config.node_path+'/blog', blogs.getBlogs);

    app.post(config.node_path+'/blog', authorize.confirmAuth, blogs.addBlog);

    app.put(config.node_path+'/blog/:blogid', authorize.confirmAuth, blogs.updateBlog);
    app.delete(config.node_path+'/blog/:blogid', authorize.confirmAuth, blogs.deleteBlog);

    app.get(config.node_path+'/post', posts.getPosts);
    app.post(config.node_path+'/post', authorize.confirmAuth, posts.addPost);

    app.get(config.node_path+'/post/:postid', posts.getPost);
    app.put(config.node_path+'/post/:postid', authorize.confirmAuth, posts.updatePost);
    app.delete(config.node_path+'/post/:postid', authorize.confirmAuth, posts.deletePost);

    app.get(config.node_path+'/post/:postid/comment', comments.getCommentsForPost)
    app.post(config.node_path+'/post/:postid/comment', authorize.confirmAuth, comments.addCommentToPost);

    app.get(config.node_path+'/post/:postid/comment/:commentid', comments.getComment);
    app.put(config.node_path+'/post/:postid/comments/:commentid', authorize.confirmAuth, comments.updateComment);
    app.delete(config.node_path+'/post/:postid/comments/:commentid', authorize.confirmAuth, comments.deleteComment);

    app.get(config.node_path+'/user', users.getUsers);
    app.post(config.node_path+'/user', authorize.register, users.addUser);

    app.get(config.node_path+'/user/:userid', users.getUser);
    app.put(config.node_path+'/user/:userid', authorize.confirmAuth, users.updateUser);
    app.delete(config.node_path+'/user/:userid', authorize.confirmAuth, users.deleteUser);
}
