app.controller("unitsListingCtrl", function($scope, $http, $cookieStore, $state, $uibModal, myService) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

    $scope.projectListFun = (function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhaseList = function(projectName) {
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Block_Id": obj.blocks
                }
            }).success(function(data) {
                $scope.unitsList = data[0];
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheet',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
});

app.controller("unitCostSheetCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $uibModalInstance, item) {
    $scope.unitId = item;
    ($scope.getUnitCostSheetDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstSheet/Gt",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Id": parseInt($scope.unitId),
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $scope.unitCostSheetDetail = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});