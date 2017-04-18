app.controller("paymentScheduleCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $rootScope, myService) {
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.getPaymentScheduleList = function(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                $rootScope.paymentScheduleList = data;
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

    $scope.editPaymentSchedule = function(paymentSchduleObj) {
        var modalInstance = $uibModal.open({
            templateUrl: 'paymentScheduleChange.html',
            controller: 'paymentScheduleChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return paymentSchduleObj;
                }
            }
        });
    };
});

app.controller("paymentScheduleChangeCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, item) {

    ($scope.getPaymentScheduleDetail = function() {
        $scope.blockStage = {
            paymentScheduleValue: item.PaymentScheduleCalcValue
        };
    })();

    $scope.updatePaymentSchedule = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/Update",
                ContentType: 'application/json',
                data: {
                    "PaymentScheduleId": item.PaymentScheduleId,
                    "PaymentScheduleBlockstageId": item.blockstageId,
                    "PaymentScheduleCompGuid": $cookieStore.get('comp_guid'),
                    "PaymentScheduleCalcTypeValue": 1,
                    "PaymentScheduleCalcValue": formObj.paymentScheduleValue
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getPaymentScheduleList(item.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getPaymentScheduleList(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                $rootScope.paymentScheduleList = data;
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});