angular.module('app.blogs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    // Route for user's blogs
    $routeProvider.when('/blogs', {
        templateUrl : 'blogs/blogs.html',
        controller  : 'blogController'
    })

    // Add new blog
    .when('/upsertblog', {
        templateUrl : 'blogs/upsertblog.html',
        controller  : 'blogController'
    })

    // Modify/Update a blog
    .when('/upsertblog/:blogid', {
        templateUrl : 'blogs/upsertblog.html',
        controller  : 'blogController'
    })
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
;
