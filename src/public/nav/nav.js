angular.module('app.nav', [])

/**
 *
 *
 */
.controller('navController', ['$scope', function ($scope) {
    $scope.isCollapsed = true;
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
;
