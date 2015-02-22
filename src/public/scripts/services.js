angular.module('app')
.factory('Blogs', ['$http', 'ENV', function($http, ENV) {
    return $http.get(ENV.apiEndpoint + '/blogs');
}])

.factory('Posts', ['$http', 'ENV', function($http, ENV) {
    return {
        fetchPosts: function(blogId) {
            return $http.get(ENV.apiEndpoint + '/blog/'+blogId+'/posts',
            { blogid: blogId});
        }
    }
}])

.factory('UserFeed', ['$http', 'ENV', function($http, ENV) {
    return {
        getBlogs: function(userId) {
            return $http.get(ENV.apiEndpoint + '/blogs/'+userId);
        }
    }
}])

.factory('Comment', ['$http', 'ENV', 'Session', function($http, ENV, Session) {
    return {
        getComments : function(blogId, postId) {
            return $http.get(ENV.apiEndpoint + '/blog/'+blogId+'/post/'+postId+'/comments');
        },
        addComment : function(blogId, postId, comment, author) {
            return $http.post(ENV.apiEndpoint + '/blog/'+blogId+'/post/'+postId+'/comments',
            { comment: comment, author: author });
        },
        updateComment : function(blogId, postId, comment) {
            return $http.put(ENV.apiEndpoint + '/blog/'+blogId+'/post/'+postId+'/comments/'+commentId,
            { comment: comment });
        },
        deleteComment : function(blogId, postId, commentId) {
            return $http.delete(ENV.apiEndpoint + '/blog/'+blogId+'/post/'+postId+'/comments/'+commentId);
        }
    }
}])

.factory('User', ['$http', 'ENV', function($http, ENV) {
    return {
        getUser: function(userId) {
            return $http.get(ENV.apiEndpoint + '/user/'+userId, { userid: userId });
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
