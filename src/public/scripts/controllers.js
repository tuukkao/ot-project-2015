angular.module('app')
/**
 * MainController will take care that the right stuff is shown at right time.
 *
 */
.controller('appController', function($scope, USER_ROLES, Authorization, $localStorage, $http) {
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user._id;
        $scope.token = user.token;
        $scope.isAuthenticated = Authorization.isAuthenticated();
        $http.defaults.headers.common.Authorization = user.token;
    };

    if($localStorage.user) {
        $scope.setCurrentUser($localStorage.user);
    } else {
        $scope.currentUser = null;
    }
    console.log($scope.currentUser);
    $scope.userRoles = USER_ROLES;
    $scope.isAuthenticated = Authorization.isAuthenticated();
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
.controller('feedController', ['$scope', 'Posts', function ($scope, Posts) {
    $scope.posts = [];
    Posts.fetchPosts()
    .success(function(data){
        console.log(data);
        $scope.posts = data;
        console.log($scope.posts);
    })
    .error(function(data, status){
        console.log(data, status);
    });
}])


/**
 * LoginContoller manages frontend authentication of the user.
 *
 */
.controller('loginController', ['$scope', '$rootScope','Authorization', 'AUTH_EVENTS',
            'Session', function($scope, $rootScope, Authorization, AUTH_EVENTS, Session) {
    $scope.credentials = {
        username : '',
        password : ''
        };
    $scope.login = function(credentials) {
        var success = function(data) {
            Session.create(data._id, null, data.token, function(data) {
                $scope.setCurrentUser(data);
            });
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        };
        var error =  function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        };
        Authorization.authenticate(credentials, success, error);
    }
}])

.controller('commentController', ['$scope', 'Comment',
            function($scope, Comment) {

    $scope.addComment = function(post) {
        console.log(post);
        var postId = post._id;
        var comment = post.newComment;
        var author = $scope.currentUser;
        Comment.addComment(postId, comment, author)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log(data);
            });
    }
}])
/**
 *
 *
 */
.controller('blogController', ['$scope', 'UserFeed', 'Posts', 'Comment',
            function($scope, UserFeed, Posts, Comment) {
    $scope.blogs = [];

    UserFeed.getBlogs($scope.currentUser)
    .success(function(data) {
        $scope.blogs = data;
        fetchPosts();
    })
    .error(function(data, status) {
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
 *
 *
 */
.controller('profileController', ['$scope', 'User', 'Session', '$location',
            function($scope, User, Session, $location) {
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
    $scope.logOut = function() {
        console.log("log out");
        Session.destroy(function(data) {
            $scope.setCurrentUser(data);
        });
        $location.path("/");
    }
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
