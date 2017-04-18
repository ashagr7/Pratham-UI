app.controller("emailTemplatesCtrl", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Email Templates";
});

app.controller("createNewEmailTemplateCtrl", function($scope, $rootScope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Create New Email Template";
    $scope.template = {
        mergeFieldType:"",
        fields:""        
    };
    ($scope.loadEditor = function(){
            $('#contentEditor').summernote();
    })();
    
    $scope.getMergedFieldTypes = (function(){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModulesGetAlrt",
            ContentType: 'application/json',
            data: {
                "module_id": 0
            }
        }).success(function(data) {
            $scope.mergeFieldTypes = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.getFields = function(moduleId){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
            }
        }).success(function(data) {
            if(data[0].modfield_ErrorDesc == "-1 | Module fields do not exist for this Module"){
                $rootScope.appMsg = "Module fields do not exist for this Module";
                $rootScope.showAppMsg = true;
                $scope.fields = [];
                $scope.template.fields = "";
                $scope.template.copyMergedFields = "";
            }
            else{
                $rootScope.appMsg = "";
                $rootScope.showAppMsg = false;
                $scope.fields = data;   
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
    $scope.copyMergedFields = function(field){
        $scope.template.copyMergedFields = field;
    }
});