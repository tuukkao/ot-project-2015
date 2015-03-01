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
    $scope.userRoles = USER_ROLES;
    $scope.isAuthenticated = Authorization.isAuthenticated();
})
.controller('indexController', ['$scope', function($scope) {
    $scope.message = "INDEX";
}])

/**
 * FeedController will take care of getting the right feed for the user.
 *
 */
.controller('feedController', ['$scope', 'Posts', 'Comment', '$routeParams',
            function ($scope, Posts, Comment, $routeParams) {
    $scope.posts = [];

    $scope.getPostsForBlog = function(blogId) {
        Posts.fetchPostsForBlog(blogId)
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    };

    $scope.getPosts = function() {
        Posts.fetchPosts()
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data) {
            console.log(data);
        });
    }

    if(!$routeParams.blogid) {
        $scope.getPosts();
    } else {
        $scope.getPostsForBlog($routeParams.blogid);
    }

    $scope.fetchCommentsForPost = function(post) {
        console.log(post);
        post.comments = {};
        Comment.getComments(post._id)
        .success(function(data) {
            console.log(data);
            post.comments = data;
            console.log(post);
        })
        .error(function(data) {
            console.log(data);
        })
    };

    $scope.addComment = function(post) {
        console.log(post);
        var postId = post._id;
        var comment = post.newComment;
        var author = $scope.currentUser;
        Comment.addComment(postId, comment, author)
            .success(function(data) {
                console.log(data);
                post.newComment = null;
                $scope.fetchCommentsForPost(post);
            })
            .error(function(data) {
                console.log(data);
            });
    }
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

/**
 *
 *
 */
.controller('blogController', ['$scope', 'Blogs', '$location', '$routeParams',
            function($scope, Blogs, $location, $routeParams) {
    // initializing stuff.
    $scope.blogs = [];
    $scope.tag = "";

    // if there is no route parameter initialize "empty" blog entry
    if(!$routeParams.blogid) {
        $scope.blog = {
            title: "",
            tags : [],
            description : "",
            _id : null,
            author : $scope.currentUser
        }
    } else {
        Blogs.fetchBlogById($routeParams.blogid)
        .success(function (data) {
            $scope.blog = data[0];
        })
        .error(function (data) {
        });
    }

    // Get blogs for user!
    Blogs.fetchBlogsForUser($scope.currentUser)
    .success(function (data) {
        $scope.blogs = data;
        console.log($scope.blogs);
    })
    .error(function (data) {
        console.log(data);
    });
    $scope.newBlog = function() {
        $location.path("/upsertblog");
    }

    $scope.addTag = function(tag) {
        $scope.blog.tags.push(tag);
    }

    $scope.saveBlog = function(blog) {
        if($scope.blog._id) {
            blog.author = $scope.currentUser;
            Blogs.updateBlog(blog)
            .success(function(data) {
                console.log(data);
                // trigger success=?
                $location.path("/blogs");
            })
            .error(function(data) {
                console.log(data);
                // triggerr Error!
            });
        } else {
            Blogs.addBlog(blog)
            .success(function(data) {
                console.log(data);
                // trigger success=?
                $location.path("/blogs");
            })
            .error(function(data) {
                console.log(data);
                // triggerr Error!
            });
        }
    }

    $scope.newPost = function(blogId) {
        $location.path("/post/"+blogId);
    }
}])

.controller('postController', ['$scope', 'Posts', '$location', '$routeParams',
            function($scope, Posts, $location, $routeParams) {
    $scope.post = {
        title: "",
        content: "",
        tags: [],
        parent_blog: $routeParams.blogid,
        author: $scope.currentUser
    };

    $scope.addPost = function(post) {
        console.log(post);
        Posts.addPost(post)
        .success(function(data) {
            console.log(data);
            $location.path("/feed/"+$routeParams.blogid);
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
            data.blogs_followed.push(blogId);
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
            var index = data.blogs_followed.indexOf(blogId);
            data.blogs_followed.splice(index, 1);
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
.controller('navController', ['$scope', function ($scope) {
    $scope.isCollapsed = true;
}])
;
