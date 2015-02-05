var app = angular.module('app', ['ngRoute'])

app.factory('Blogs', ['$http', function($http){
    return $http.get('http://nikunen.org/rest/blogs');
}])

app.controller('feedController', ['$scope', 'Blogs', function ($scope, Blogs) {
    Blogs.success(function(data){
        console.log(data);
        $scope.blogs = data.blogs;
    }).error(function(data, status){
        console.log(data, status);
        $scope.blogs = [];
    });
}])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'index.html',
        controller: 'feedController'
        })
}]);
