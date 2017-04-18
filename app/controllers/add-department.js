app.controller("addDepartmentCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    ($scope.getParentDepartmentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/Department",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.parentDepartmentList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getManagerNameDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.managersList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.addNewDepartment = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SaveDept",
                ContentType: 'application/json',
                data: {
                    "dept_compguid": $cookieStore.get('comp_guid'),
                    "dept_branchid": formObj.branchName,
                    "dept_name": formObj.departmentName,
                    "dept_head_userid": formObj.managerName,
                    "dept_parentid": formObj.parentDepartment
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/Heirarchy");
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
});