var app = angular.module('app');

    app.controller('feedController', ['$scope', 'Blogs', function ($scope, Blogs) {
        Blogs.success(function(data){
            console.log(data);
            $scope.blogs = data.blogs;
        }).error(function(data, status){
            console.log(data, status);
            $scope.blogs = [];
        });
    }])
