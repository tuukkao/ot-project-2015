angular.module('app.feed', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // Route for index .
    $routeProvider.when('/', {
        templateUrl: 'feed/feed.html',
        controller: 'feedController'
    })

    // Posts for specific blog
    .when('/feed/:blogid', {
        templateUrl: 'feed/feed.html',
        controller: 'feedController'
    })
}])

/**
 * FeedController will take care of getting the right feed for the user.
 *
 */
.controller('feedController', ['$scope', 'Posts', 'Comment', '$routeParams',
            function ($scope, Posts, Comment, $routeParams) {
    $scope.posts = [];

    $scope.getPostsForBlog = function(blogId) {
        Posts.fetchPostsForBlog(blogId)
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    };

    $scope.getPosts = function() {
        Posts.fetchPosts()
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    }

    if(!$routeParams.blogid) {
        $scope.getPosts();
    } else {
        $scope.getPostsForBlog($routeParams.blogid);
    }

    $scope.fetchCommentsForPost = function(post) {
        console.log(post);
        post.comments = {};
        Comment.getComments(post._id)
        .success(function(data) {
            console.log(data);
            post.comments = data;
            console.log(post);
        })
        .error(function(data) {
            console.log(data);
        })
    };

    $scope.addComment = function(post) {
        console.log(post);
        var postId = post._id;
        var comment = post.newComment;
        var author = $scope.currentUser;
        Comment.addComment(postId, comment, author)
            .success(function(data) {
                console.log(data);
                post.newComment = null;
                $scope.fetchCommentsForPost(post);
            })
            .error(function(data) {
                console.log(data);
            });
    }
}])
;
