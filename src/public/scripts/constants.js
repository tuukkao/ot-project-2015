angular.module('app')
.constant('ENV', {
    'name': 'development',
    'apiEndpoint': 'http://localhost:8080',
    'imgPath' : 'http://localhost/images/'
})
.constant('USER_ROLES', {
    all: '*',
    authenticated: 'authenticated'
})
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})
;
