angular.module('app.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // Route for user's profile
    $routeProvider.when('/me', {
        templateUrl : 'profile/profile.html',
        controller  : 'profileController'
    })
    // Routes to view user profiles
    .when('/profile/:userid', {
        templateUrl : 'profile/profile.html',
        controller  : 'profileController'
    })
}])

/**
 *
 *
 */
.controller('profileController', ['$scope', 'User', 'Session', '$location',
    '$routeParams', function($scope, User, Session, $location, $routeParams) {
    $scope.user = [];
    $scope.blogsFollowed = [];
    $scope.enableFollow = false;
    $scope.getUser = function() {
        var userId = "";
        if($routeParams.userid) {
            userId = $routeParams.userid;
        }
        else {
            userId = $scope.currentUser;
        }
        User.getUser(userId)
        .success(function(data){
            $scope.user = data;
            if($scope.user._id != $scope.currentUser) {
                User.getUser($scope.currentUser)
                .success(function(data){
                    var blogIds = [];
                    for(var i = 0; i < data.blogs_followed.length; i++) {
                        blogIds.push(data.blogs_followed[i]._id);
                    }
                    $scope.blogsFollowed = blogIds;
                    for(var i = 0; i < $scope.user.blogs.length; i++) {
                        if($scope.blogsFollowed.indexOf($scope.user.blogs[i]._id) == -1){
                            $scope.user.blogs[i].followed = false;
                        } else {
                            $scope.user.blogs[i].followed = true;
                        }
                    }
                    $scope.enableFollow = true;
                    console.log($scope.blogsFollowed);
                })
                .error(function(data, status){
                    console.log(data, status);
                });
            }
        })
        .error(function(data, status){
            console.log(data, status);
        });
    }
    // Get user!
    $scope.getUser();
    $scope.followBlog = function(blogId) {
        User.getUser($scope.currentUser)
        .success(function(data) {
            var followed = [];
            // transform blog objects to ID references.
            for(var i = 0; i < data.blogs_followed.length; i++) {
                followed.push(data.blogs_followed[i]._id);
            }
            // Add new blog to followed blogs!
            followed.push(blogId);
            data.blogs_followed = followed;
            User.followBlog(data)
            .success(function(data) {
                console.log(data);
                $scope.getUser();
            })
            .error(function(data) {
                console.log(data);
            });
        })
        .error(function(data) {
            console.log(data);
        });
    }
    $scope.unfollowBlog = function(blogId) {
        User.getUser($scope.currentUser)
        .success(function(data) {
            var followed = [];
            // transform blog objects to ID references.
            for(var i = 0; i < data.blogs_followed.length; i++) {
                followed.push(data.blogs_followed[i]._id);
            }
            var index = followed.indexOf(blogId);
            followed.splice(index, 1);
            data.blogs_followed = followed;
            User.followBlog(data)
            .success(function(data) {
                console.log(data);
                $scope.getUser();
            })
            .error(function(data) {
                console.log(data);
            });
        })
        .error(function(data) {
            console.log(data);
        });
    }


    $scope.logOut = function() {
        console.log("log out");
        Session.destroy(function(data) {
            $scope.setCurrentUser(data);
        });
        $location.path("/");
    }
}])
