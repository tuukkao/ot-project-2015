angular.module('app.post', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // New post
    $routeProvider.when('/post/:blogid', {
        templateUrl : 'post/post.html',
        controller  : 'postController'
    })
}])

.controller('postController', ['$scope', 'Posts', '$location', '$routeParams',
            function($scope, Posts, $location, $routeParams) {
    $scope.post = {
        title: "",
        content: "",
        tags: [],
        parent_blog: $routeParams.blogid,
        author: $scope.currentUser
    };

    $scope.addPost = function(post) {
        console.log(post);
        Posts.addPost(post)
        .success(function(data) {
            console.log(data);
            $location.path("/feed/"+$routeParams.blogid);
        })
        .error(function(data) {
            console.log(data);
        });
    }
    $scope.addTag = function(tag) {
        $scope.post.tags.push(tag);
    }
}])
