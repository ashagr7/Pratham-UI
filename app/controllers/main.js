app.controller("mainCtrl", function($scope, $rootScope, $http, $cookieStore, $state, $window) {    
    $rootScope.appMsg = "";
    $rootScope.showAppMsg = false;
    $scope.title = "Pratham :: Home";
    $scope.clientCss = "prathamClient";
    ($scope.checkLogin = function() {
        var userId = $cookieStore.get('user_id');
        var compGuid = $cookieStore.get('comp_guid');
        if (userId == undefined || compGuid == undefined) {
            var pageUrl = $window.location.href;
            $cookieStore.put('pageUrl', pageUrl);
            $window.location.href = '/';
        }
    })();
    $scope.logout = function() {
        $cookieStore.remove('user_id');
        $cookieStore.remove('comp_guid');
        $cookieStore.remove('pageUrl');
        $window.location.href = '/';
    };
});