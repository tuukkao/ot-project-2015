angular.module('app')
.factory('Blogs', ['$http', 'ENV', function($http, ENV) {
    return $http.get(ENV.apiEndpoint + '/blog');
}])

.factory('Posts', ['$http', 'ENV', function($http, ENV) {
    return {
        fetchPosts: function() {
            return $http.get(ENV.apiEndpoint + '/post');
        },
        fetchPostsForBlog: function() {
            return $http.get(ENV.apiEndpoint + '/post?blogid=' + blogId,
            { blogid: blogId});
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
        // !! does boolean conversion so if Session has userId value, this will
        // return true.
        return !!Session.token;
    };

    return authService;
}])

.service('Session',['$http', function ($http) {
    this.create = function (userId, userRole, token) {
        this.userId = userId;
        this.userRole = userRole;
        this.token = token;
        $http.defaults.headers.common.Authorization = token;
    };
    this.destroy = function () {
        this.userId = null;
        this.userRole = null;
        this.token = null;
        $http.defaults.headers.common.Authorization = null;
    };
    return this;
}])
;
