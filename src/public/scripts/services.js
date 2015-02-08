var app = angular.module('app');

    app.factory('Blogs', ['$http', 'ENV', function($http, ENV) {
        return $http.get(ENV.apiEndpoint + '/blogs');
    }])
