angular.module('app')
/**
 * MainController will take care that the right stuff is shown at right time.
 *
 */
.controller('appController', function($scope, USER_ROLES, Authorization) {
    console.log($scope.currentUser);
    $scope.userRoles = USER_ROLES;
    $scope.isAuthenticated = Authorization.isAuthenticated();
    $scope.currentUser = null;
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user._id;
        $scope.token = user.token;
        $scope.isAuthenticated = Authorization.isAuthenticated();
    };
})
.controller('indexController', ['$scope', function($scope) {
    $scope.message = "INDEX";
    console.log('Current user: '+$scope.currentUser);
    console.log('Is authenticated? '+$scope.isAuthenticated);
}])
/**
 * FeedController will take care of getting the right feed for the user.
 *
 */
.controller('feedController', ['$scope', 'Blogs', 'Posts', function ($scope, Blogs, Posts) {
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


/**
 * LoginContoller manages frontend authentication of the user.
 *
 */
.controller('loginController', ['$scope', '$rootScope','Authorization', 'AUTH_EVENTS',
            function($scope, $rootScope, Authorization, AUTH_EVENTS) {
    $scope.credentials = {
        username : '',
        password : ''
        };
    $scope.login = function(credentials) {
        var success = function(data) {
            console.log(data);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(data);
        };
        var error =  function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        };
        Authorization.authenticate(credentials, success, error);
    }
}])

/**
 *
 *
 */
.controller('blogController', ['$scope', function($scope) {
    $scope.message = "blogs";
}])

/**
 *
 *
 */
.controller('profileController', ['$scope', 'User', function($scope, User) {
    $scope.message = "profile";
    $scope.user = [];

    User.getUser($scope.currentUser)
    .success(function(data){
        console.log(data);
        $scope.user = data;
        console.log($scope.user);
    })
    .error(function(data, status){
        console.log(data, status);
    });
}])

/**
 *
 *
 */
.controller('signupController', ['$scope', function($scope) {
    $scope.message = "signup";
}])


.controller('aboutController', ['$scope', function($scope) {
    $scope.message = "about";
}])
/**
 *
 *
 */
.controller('navigationController', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page === currentRoute ? 'active' : '';
    };
}])
;
