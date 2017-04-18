app.controller("accessRightsCtrl", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Access Rights";
    $scope.currentRoleId = 0;

    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getModulesList = function(roleId) {
        $scope.currentRoleId = roleId;
        if (roleId != undefined && roleId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/ModulesGet",
                ContentType: 'application/json',
                data: {}
            }).success(function(data) {
                angular.element(".loader").hide();
                $scope.modulesList = data;
                getRoleaccrgts(roleId);
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            $scope.modulesList = [];
        }
    };

    function getRoleaccrgts(roleId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/Roleaccrgts",
            ContentType: 'application/json',
            data: {
                "RoleAccRgts_compguid": $cookieStore.get('comp_guid'),
                "RoleAccRgts_RoleId": roleId
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.Roleaccrgts = [];
            for (var i = 0; i < data.length; i++) {
                var rolesAccesRgt = {};
                rolesAccesRgt.Add = data[i].RoleAccRgts_Add;
                rolesAccesRgt.View = data[i].RoleAccRgts_View;
                rolesAccesRgt.Edit = data[i].RoleAccRgts_Edit;
                rolesAccesRgt.Delete = data[i].RoleAccRgts_Del;
                $scope.Roleaccrgts.push(rolesAccesRgt);
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    function checkUndefined(checkBoxValue) {
        if (checkBoxValue == undefined) {
            return 0;
        } else {
            return checkBoxValue;
        }
    };

    $scope.SubmitRoleaccrgts = function(formObj, formName) {

        if ($scope.currentRoleId == undefined || $scope.currentRoleId == '') {
            alert("Please select any Role first.");
            return false;
        }
        $scope.submit = true;

        var rolesRightDataArray = [];

        for (var i = 0; i < $scope.modulesList.length; i++) {
            var rolesAccesRgt = {};
            rolesAccesRgt.RoleAccRgts_compguid = $cookieStore.get('comp_guid');
            rolesAccesRgt.RoleAccRgts_RoleId = $scope.currentRoleId;
            rolesAccesRgt.RoleAccRgts_ModuleId = $scope.modulesList[i].module_id;
            if (formObj[i] != undefined) {
                rolesAccesRgt.RoleAccRgts_Add = checkUndefined(formObj[i].Add);
                rolesAccesRgt.RoleAccRgts_View = checkUndefined(formObj[i].View);
                rolesAccesRgt.RoleAccRgts_Edit = checkUndefined(formObj[i].Edit);
                rolesAccesRgt.RoleAccRgts_Del = checkUndefined(formObj[i].Delete);
            } else {
                rolesAccesRgt.RoleAccRgts_Add = 0;
                rolesAccesRgt.RoleAccRgts_View = 0;
                rolesAccesRgt.RoleAccRgts_Edit = 0;
                rolesAccesRgt.RoleAccRgts_Del = 0;
            }

            rolesRightDataArray.push(rolesAccesRgt);
        }

        console.log(rolesRightDataArray);

        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveRoleaccrgts",
                ContentType: 'application/json',
                data: rolesRightDataArray
            }).success(function(data) {
                if (data[0].RoleErrorDesc == "0") {
                    alert("Access Right Record Saved")
                    $state.go("/Leads");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});