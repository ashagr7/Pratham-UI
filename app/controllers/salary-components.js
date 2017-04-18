app.controller("ctcDetailCtrl", function($scope, $http, $cookieStore, $uibModalInstance, $stateParams, $state, item) {
    $scope.empObject = item;

    ($scope.getSalaryComponentDetails = function() {
        console.log($scope.empObject);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/CalculateUserSalaryHeads",
            ContentType: 'application/json',
            data: {
                "UserSalheadsCompGuid": $cookieStore.get('comp_guid'),
                "UserSalheadsEmp_ctc": item.employeeCtc,
                "UserSalheadsUserId": $stateParams.employeeId
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.editSalaryComponent = function(salaryCode, salaryId) {
        $("#" + salaryCode + salaryId).prop('disabled', false);
        $("#button" + salaryCode).prop('disabled', false);
    };

    $scope.saveSalaryComponent = function(salaryCode, salaryId, salaryCompId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/SalaryHeadsInsert",
            ContentType: 'application/json',
            data: {
                "UserSalheadsCompGuid": $cookieStore.get('comp_guid'),
                "UserSalheadsUserId": parseInt($stateParams.employeeId),
                "UserSalheads_SalHeadsId": parseInt(salaryCompId),
                "UserSalheadsCalcValue": parseInt($("#" + salaryCode + salaryId).val())
            }
        }).success(function(data) {
            console.log(data);
            if (data.UserSalheadsErrorDesc == '0 | Save Successfull') {
                alert('Data save sucessfully.');
                $("#" + salaryCode + salaryId).prop('disabled', true);
                $("#button" + salaryCode).prop('disabled', true);
            } else {
                alert('Data not save sucessfully.');
            }
        }).error(function() {
            alert('Something went wrong!!');
        });
    };
});

app.controller("salaryComponentDetailsCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $rootScope) {

    ($scope.getSalaryComponentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.editSalaryComponent = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalaryComponent.html',
            controller: 'editSalaryComponentController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.salaryComponentDetails[selectedItem];
                }
            }
        });
    };

    $scope.addSalaryComponent = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalaryComponent.html',
            controller: 'addSalaryComponentController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return 0;
                }
            }
        });
    };
});

app.controller("addSalaryComponentCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Add Salary Component";
    $scope.addSalaryComponentBtn = true;

    $scope.addSalaryComponent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalaryHeadsInsert",
                ContentType: 'application/json',
                data: {
                    "SalHeads_comp_guid": $cookieStore.get('comp_guid'),
                    "SalHeads_Name": formObj.salaryComponentName,
                    "SalHead_Paytyp": formObj.salaryPayType,
                    "SalHead_TxSts": formObj.salaryTaxStatus,
                    "SalHead_CalTyp": formObj.salaryCalculationType,
                    "SalHead_CalTypVal": formObj.salaryCalculationValue,
                    "SalHead_PrtofCTC": formObj.salaryPartOfCtc,
                    "SalHead_VarFxd": formObj.salaryComponentType,
                    "SalHead_Code": formObj.salaryAbbreviation
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalaryComponentDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getSalaryComponentDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("editSalaryComponentCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Edit Salary Component";
    $scope.editSalaryComponentBtn = true;

    ($scope.getSalaryComponentDetails = function() {
        console.log(item);
        $scope.addSalaryComponent = {
            salaryComponentName: item.SalHeads_Name,
            salaryAbbreviation: item.SalHead_Code,
            salaryPayType: item.SalHead_Paytyp + '',
            salaryTaxStatus: item.SalHead_TxSts,
            salaryCalculationType: item.SalHead_CalTyp + '',
            salaryCalculationValue: item.SalHead_CalTypVal,
            salaryPartOfCtc: item.SalHead_PrtofCTC,
            salaryComponentType: item.SalHead_VarFxd
        };
    })();

    $scope.editSalaryComponent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalaryHeadsUpdate",
                ContentType: 'application/json',
                data: {
                    "SalHeads_Id": item.SalHeads_Id,
                    "SalHeads_comp_guid": $cookieStore.get('comp_guid'),
                    "SalHeads_Name": formObj.salaryComponentName,
                    "SalHead_Paytyp": formObj.salaryPayType,
                    "SalHead_TxSts": formObj.salaryTaxStatus,
                    "SalHead_CalTyp": formObj.salaryCalculationType,
                    "SalHead_CalTypVal": formObj.salaryCalculationValue,
                    "SalHead_PrtofCTC": formObj.salaryPartOfCtc,
                    "SalHead_VarFxd": formObj.salaryComponentType,
                    "SalHead_Code": formObj.salaryAbbreviation
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalaryComponentDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getSalaryComponentDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});