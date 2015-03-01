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
    .when('/feed/tag/:tag', {
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
    $scope.tags = [];
    $scope.tag = "";
    $scope.showFilters = false;


    $scope.getPostsForBlog = function(blogId) {
        Posts.fetchPostsForBlog(blogId)
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    };

    $scope.getPosts = function(querystring) {
        Posts.fetchPosts(querystring)
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    }
    $scope.filterPosts = function() {
        console.log("fetching");
        var query = "?tag=";
        for(var i = 0; i < $scope.tags.length; i++) {
            if(i == 0) {
                query += $scope.tags[i];
            } else {
                query += "&tag="+$scope.tags[i];
            }
        }
        $scope.getPosts(query);
    }
    $scope.addTag = function() {
        $scope.tags.push($scope.tag);
        $scope.tag = "";
        $scope.filterPosts();
    }
    $scope.resetTags = function() {
        $scope.tags = [];
        $scope.getPosts();
    }

    if($routeParams.blogid) {
        $scope.getPostsForBlog($routeParams.blogid);
    } else if($routeParams.tag) {
        console.log("true");
        $scope.tag = $routeParams.tag;
        $scope.addTag();
    } else {
        $scope.getPosts();
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
