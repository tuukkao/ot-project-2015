angular.module('app.about', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // route for about/info
    $routeProvider.when('/about', {
        templateUrl : 'about/about.html',
        controller  : 'aboutController'
    })
}])

.controller('aboutController', ['$scope', function($scope) {
    $scope.message = "about";
}])
;
