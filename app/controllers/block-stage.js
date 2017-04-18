app.controller("blockStageCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $rootScope, myService) {
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

    $scope.getBlockStageList = function(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
            $rootScope.blockStageList = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.addStatusChange = function(blockId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockId = blockId;
                    blocks.action = 'add';
                    return blocks;
                }
            }
        });
    };

    $scope.editStatusChange = function(blockstageId, currentBlockId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockstageId = blockstageId;
                    blocks.action = 'edit';
                    blocks.blockId = currentBlockId;
                    return blocks;
                }
            }
        });
    };
});

app.controller("blockStageChangeCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, item) {

    ($scope.getBlockStageDetail = function() {
        if (item.action == 'add') {
            $scope.blockStage = {
                completed: "0",
                action: "add"
            };
        }
        if (item.action == 'edit') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageId": item.blockstageId
                }
            }).success(function(data) {
                $scope.blockStage = {
                    completed: data.blocksatgeCompleted + "",
                    name: data.blockstageName,
                    action: "edit"
                };
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    })();

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.addBlockStage = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/Save",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId
                }
            }).success(function(data) {
                $uibModalInstance.close();
                getBlockStageList(data.blockstageBlockId);
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getBlockStageList(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
            $rootScope.blockStageList = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.editBlockStage = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/Update",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId,
                    "blockstageId": item.blockstageId
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getBlockStageList(data.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };
});