angular.module('app')
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

        // Route for index .
        .when('/', {
            templateUrl: 'views/feed.html',
            controller: 'feedController'
        })

        // Posts for specific blog
        .when('/feed/:blogid', {
            templateUrl: 'views/feed.html',
            controller: 'feedController'
        })

        // Route for user's blogs
        .when('/blogs', {
            templateUrl : 'views/blogs.html',
            controller  : 'blogController'
        })

        // Add new blog
        .when('/upsertblog', {
            templateUrl : 'views/upsertblog.html',
            controller  : 'blogController'
        })

        // Modify/Update a blog
        .when('/upsertblog/:blogid', {
            templateUrl : 'views/upsertblog.html',
            controller  : 'blogController'
        })

        // New post
        .when('/post/:blogid', {
            templateUrl : 'views/post.html',
            controller  : 'postController'
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

        // TODO: logout
        .when('/logout', {
            templateUrl : 'views/logout.html',
            controller  : 'logoutController'
        })

        // Routes to view user profiles
        .when('profile/:userid', {
            templateUrl : 'views/profile.html',
            controller  : 'profileController'
        })

        // Otherwise redirect to frontpage
        .otherwise({
            redirectTo: '/'
        });
}])
;
