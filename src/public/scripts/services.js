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

.service('Session', function () {
    this.create = function (userId, userRole, token) {
        this.userId = userId;
        this.userRole = userRole;
        this.token = token;
    };
    this.destroy = function () {
        this.userId = null;
        this.userRole = null;
        this.token = null;
    };
    return this;
})
;
