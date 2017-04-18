var app = angular.module("pratham",['ui.router','ngCookies']);
app.config(function($stateProvider, $urlRouterProvider) {
$urlRouterProvider.otherwise('/Login');
$stateProvider
    .state('/RegisterFirm', {
		url: '/RegisterFirm',
		templateUrl: 'partials/firmRegister.html',
		controller: 'firmRegisterCtrl'
	})
    .state('/AdminCreation', {
		url: '/AdminCreation',
		templateUrl: 'partials/adminCreation.html',
		controller: 'adminCreationCtrl'
	})
    .state('/Login', {
		url: '/Login',
		templateUrl: 'partials/login.html',
		controller: 'loginCtrl'
	})
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
