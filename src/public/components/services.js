angular.module('app.services', [])
.factory('Blogs', ['$http', 'ENV', function($http, ENV) {
    return {
        fetchBlogs: function() {
            return $http.get(ENV.apiEndpoint + '/blog');
        },
        fetchBlogsForUser: function(author) {
            return $http.get(ENV.apiEndpoint + '/blog?author='+author);
        },
        fetchBlogById: function(blogId) {
            return $http.get(ENV.apiEndpoint + '/blog?_id='+blogId);
        },
        addBlog: function(blog) {
            return $http.post(ENV.apiEndpoint + '/blog',
            {
                title: blog.title,
                description: blog.description,
                tags: blog.tags,
                author: blog.author
            });
        },
        updateBlog: function(blog) {
            return $http.put(ENV.apiEndpoint + '/blog/' + blog._id,
            {
                title: blog.title,
                description: blog.description,
                tags: blog.tags,
                author: blog.author
            });
        },
        removeBlog: function(blogId) {
            return $http.delete(ENV.apiEndpoint + '/blog/' + blogId)
        }
    }
}])

.factory('Posts', ['$http', 'ENV', function($http, ENV) {
    return {
        fetchPosts: function() {
            return $http.get(ENV.apiEndpoint + '/post');
        },
        fetchPostsForBlog: function(blogId) {
            return $http.get(ENV.apiEndpoint + '/post?parent_blog=' + blogId,
            { blogid: blogId});
        },
        addPost: function(post) {
            console.log(post);
            return $http.post(ENV.apiEndpoint + '/post', {
                title: post.title,
                content: post.content,
                tags: post.tags,
                parent_blog: post.parent_blog,
                author: post.author,
            });
        }
    }
}])

.factory('UserFeed', ['$http', 'ENV', function($http, ENV) {
    return {
        getBlogs: function(userId) {
            return $http.get(ENV.apiEndpoint + '/blog/?author='+userId);
        }
    }
}])

.factory('Comment', ['$http', 'ENV', 'Session', function($http, ENV, Session) {
    return {
        getComments : function(postId) {
            return $http.get(ENV.apiEndpoint + '/post/'+postId+'/comment');
        },
        addComment : function(postId, comment, author) {
            return $http.post(ENV.apiEndpoint + '/post/'+postId+'/comment',
            { comment: comment, author: author });
        },
        updateComment : function(postId, comment) {
            return $http.put(ENV.apiEndpoint + '/post/'+postId+'/comment/'+commentId,
            { comment: comment });
        },
        deleteComment : function(postId, commentId) {
            return $http.delete(ENV.apiEndpoint + '/post/'+postId+'/comment/'+commentId);
        }
    }
}])

.factory('User', ['$http', 'ENV', function($http, ENV) {
    return {
        getUser: function(userId) {
            return $http.get(ENV.apiEndpoint + '/user/'+userId, { userid: userId });
        },
        registerUser: function(user) {
            return $http.post(ENV.apiEndpoint + '/user/', {
                username    : user.username,
                password    : user.password,
                email       : user.email,
                display_name: user.display_name,
                description : user.description
            });
        },
        followBlog: function(user) {
            return $http.put(ENV.apiEndpoint + '/user/'+user._id, {
                    blogs_followed: user.blogs_followed
            });
        }
    }
}])

.factory('Authorization', ['$http', 'ENV', 'USER_ROLES', 'Session',
            function($http, ENV, USER_ROLES, Session) {
    var authService = {};
    authService.authenticate = function(credentials, success, error) {
        $http.post(ENV.apiEndpoint + '/login', credentials)
        .success(function (data) {
            console.log('Authentication success');
            Session.create(data._id, USER_ROLES.authenticated, data.token);
            success(data);
        })
        .error(function (data) {
            console.log('Authentication failed');
            Session.destroy();
            error();
        })
    };

    authService.isAuthenticated = function() {
        // !! does boolean conversion so if Session has token value, this will
        // return true.
        return !!Session.getToken();
    };

    return authService;
}])

.service('Session',['$http', '$localStorage',function ($http, $localStorage) {
    this.getToken = function () {
        if(!!$localStorage.user)
            return $localStorage.user.token;

        return null;
    }
    this.create = function (userId, userRole, token, callback) {
        var user = {
            _id: userId,
            user_role: userRole,
            token: token };
        $localStorage.user = user;

        if(typeof callback == 'function')
            callback($localStorage.user);
    };
    this.destroy = function (callback) {
        $localStorage.user = {
            _id: null,
            user_role: null,
            token: null };
        $http.defaults.headers.common.Authorization = null;

        if(typeof callback == 'function')
            callback($localStorage.user);
    };
    return this;
}])
;
