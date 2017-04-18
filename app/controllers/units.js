app.controller("unitsCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.title = "Units";

    $scope.projectListFun = function() {
        angular.element(".loader").show();
        $scope.projectList = myService.getProjectList($cookieStore.get('comp_guid'));
        /*.then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });*/
    };

    $scope.phaseListFun = function(projectName) {
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    if ($stateParams.projId != "") {
        $scope.projectListFun();
        $scope.disableProject = true;
    }
    if ($stateParams.phaseId != "") {
        $scope.phaseListFun($stateParams.projId);
        $scope.disablePhase = true;
    }
    if ($stateParams.blockId != "") {
        $scope.blockListFun($stateParams.phaseId, $cookieStore.get('comp_guid'));
        $scope.disableBlock = true;
    }
    $scope.unts = {
        projectName: $stateParams.projId,
        phase: $stateParams.phaseId,
        block: $stateParams.blockId
    };
    $scope.unitListFun = function(compId, blockId) {
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
            console.log($scope.units);
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
                unitObj.UnitDtls_Unit_type_id = $scope.units[i].UnitDtls_Unit_type_id;
                unitObj.UnitDtls_Rooms = $scope.units[i].UnitDtls_Rooms + "";
                unitObj.UnitDtls_BRoom = $scope.units[i].UnitDtls_BRoom + "";
                unitObj.UnitDtls_Balcn = $scope.units[i].UnitDtls_Balcn + "";
                unitObj.UnitDtls_BuliltupArea = $scope.units[i].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Msrmnt = $scope.units[i].UnitDtls_Msrmnt;
                unitObj.UnitDtls_Premium = $scope.units[i].UnitDtls_Premium + "";
                unitObj.UnitDtls_Directn = $scope.units[i].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = $scope.units[i].UnitDtls_Floor;
                unitObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                $scope.UnitsArr.push(unitObj);
            }
            angular.element(".loader").hide();
        });
    };

    $scope.unitListFun($cookieStore.get('comp_guid'), $stateParams.blockId);

    $scope.addBlockUnit = function(formObj, formName, parentObj) {
        for (i = 0; i < formObj.length; i++) {
            formObj[i].UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            /*formObj[i].UnitDtls_Unit_type_id = 3;*/
            formObj[i].UnitDtls_Block_Id = parentObj.block;
            formObj[i].UnitDtls_user_id = $cookieStore.get('user_id');
        }

        console.log(formObj);

        var unitsData = JSON.stringify(formObj);

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            console.log(data);
            $state.go("/ApplyCostSheet", {
                "projectId": $stateParams.projId,
                "phaseId": $stateParams.phaseId,
                "blockId": $stateParams.blockId
            });
        }).error(function() {});
    }
});