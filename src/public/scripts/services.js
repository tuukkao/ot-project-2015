var app = angular.module('app');

    app.factory('Blogs', ['$http', 'ENV', function($http, ENV) {
        return $http.get(ENV.apiEndpoint + '/blogs');
    }])

    app.factory('Posts', ['$http', 'ENV', function($http, ENV) {
        return {
            fetchPosts: function(blogId) {
                return $http.get(ENV.apiEndpoint + '/blog/'+blogId+'/posts', { blogid: blogId});
            }
        }
    }])

    app.factory('Authorization', ['$http', 'ENV', function($http, ENV) {
        return {
            authenticate: function(credentials) {
                return $http.post(ENV.apiEndpoint + '/login', credentials);
            }
        }
    }])
