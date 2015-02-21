angular.module('app')
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

        // Route for index .
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'indexController'
        })

        // Route for feed
        .when('/feed', {
            templateUrl : 'views/feed.html',
            controller  : 'feedController'
        })

        // Route for user's blogs
        .when('/blogs', {
            templateUrl : 'views/blogs.html',
            controller  : 'blogController'
        })

        // Route for user's profile
        .when('/me', {
            templateUrl : 'views/profile.html',
            controller  : 'profileController'
        })

        // Route for user registration
        .when('/signup', {
            templateUrl : 'views/signup.html',
            controller  : 'signupController'
        })

        // route for about/info
        .when('/about', {
            templateUrl : 'views/about.html',
            controller  : 'aboutController'
        })
}])
;
