angular.module('app', [
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'app.about',
    'app.blogs',
    'app.feed',
    'app.nav',
    'app.post',
    'app.profile',
    'app.signup',
    'app.constants',
    'app.services'
])
.config(['$routeProvider', function($routeProvider) {
     $routeProvider
    // Otherwise redirect to frontpage
        .otherwise({
            redirectTo: '/'
        });
}])
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
;
