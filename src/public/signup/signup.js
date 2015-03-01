angular.module('app.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // Route for user registration
    $routeProvider.when('/signup', {
        templateUrl : 'signup/signup.html',
        controller  : 'signupController'
    })
}])

/**
 *
 *
 */
.controller('signupController', ['$scope', 'User', function($scope, User) {
    $scope.user = {
        username : '',
        password : '',
        email : '',
        display_name : '',
        description : ''
    };
    $scope.signUp = function(user) {
        User.registerUser(user)
        .success(function(data) {
            console.log(data);
            $scope.user = {
                username : '',
                password : '',
                email : '',
                display_name : '',
                description : ''
            };
        })
        .error(function(data, status) {
            console.log(data, status);
        });
    }
}])
;
