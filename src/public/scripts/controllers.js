var app = angular.module('app');

app.controller('feedController', ['$scope', 'Blogs', 'Posts', function ($scope, Blogs, Posts) {
    $scope.blogs = [];
    Blogs.success(function(data){
        console.log(data);
        $scope.blogs = data;
        console.log($scope.blogs);
        fetchPosts();
    }).error(function(data, status){
        console.log(data, status);
    });

    var fetchPosts = function() {
        angular.forEach($scope.blogs, function(item) {
            console.log(item._id);
            if(item._id) {
                Posts.fetchPosts(item._id)
                .success(function(data) {
                    if(item.posts) {
                        item.posts = [];
                    }
                    item.posts = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log(data);
                })
            }
        })
    }
}])

app.controller('loginController', ['$scope', 'Authorization', function($scope, Authorization) {
    $scope.username = "TestiHemmo";
    $scope.password = "testi";
    $scope.login = function() {
        console.log("User: "+$scope.username+"\n Password: "+$scope.password);
        var credentials = { username: $scope.username, password: $scope.password }
        console.log(credentials);
        Authorization.authenticate(credentials)
        .success(function (data) {
            window.localStorage.token = data.token;
            window.localStorage.userId = data._id;
            console.log(window.localStorage);
        })
        .error(function (data) {
            delete window.localStorage.token;
            delete window.localStorage.userId;
        })
    }
}])
