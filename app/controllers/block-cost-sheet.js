app.controller("blockCostSheetCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.title = "Block Cost Sheet";

    myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
        $scope.projectList = response.data;
        angular.element(".loader").hide();
    });

    $scope.phaseListFun = function(projectName) {
        $scope.flatType = "";
        $scope.blockCostSheet.phase = "";
        $scope.blockCostSheet.blocks = "";
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
        $scope.blockCostSheet.blocks = "";
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
    }



    $scope.formulaType = ['Formula', 'Flat'];

    $scope.getBlockCostSheet = function(blockId) {
        if (blockId == "") {
            $scope.showComponents = false;
            return;
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": blockId
            }
        }).success(function(data) {
            /*console.log(JSON.stringify(data));*/
            console.log(data[0].untctcm_ErrorDesc);
            if (data[0].untctcm_ErrorDesc != "-1 | Unitcostcompnts do not exist") {

                $scope.showComponents = true;
                $scope.costSheetDetail = data[0];
                angular.element(".loader").hide();
            } else {
                $scope.showMessage = true;
                $scope.resMsg = "Costsheet for this block is not generated yet."
                angular.element(".loader").hide();
            }

        }).error(function() {
            angular.element(".loader").hide();
        });
    }
});

app.controller("editBlockCostSheetCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.title = "Edit Block Cost Sheet";

    $scope.checkBlockUnits = function(blockId) {
        var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock($cookieStore.get('comp_guid'), blockId).then(function(response) {
            var blockFloorNumberArr = [];
            var blockFloors = response.data[1].Blocks_Floors;
            for (i = 1; i <= blockFloors; i++) {
                blockFloorNumberArr.push(i);
            }
            $scope.blockFloorNumbers = blockFloorNumberArr;
        });
    }
    $scope.checkBlockUnits($stateParams.blockId);
    ($scope.getBlockCostSheet = function(blockId) {
        var blockId = $stateParams.blockId;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": blockId
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $scope.showComponents = true;
            $scope.costSheetTemplate = data[0];
            $scope.costSheetTemplate.untctcm_calctyp1 = data[0].untctcm_calctyp1 + "";
            angular.element(".formulaTable").html('');
            for (i = 1; i <= 19; i++) {
                var increment;
                if (i == 7) {
                    i = i + 1;
                }
                increment = i;
                console.log(increment);
                var costComponentRow = '<tr> <td> <label>Code' + increment + '</label> </td> <td> <input type="text" class="form-control" name="untctcm_code' + increment + '" ng-model="costSheetTemplate.untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="untctcm_name' + increment + '" ng-model="costSheetTemplate.untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:costSheetTemplate.untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="untctcm_comments' + increment + '" ng-model="costSheetTemplate.untctcm_comments' + increment + '"/> </td><td><span class="glyphicon glyphicon-trash" ng-click="deleteCostComponent(' + increment + ')"></span></td></tr>';

                costComponentRow = $compile(costComponentRow)($scope);
                angular.element(".formulaTable").append(costComponentRow);
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.toggleFields = function(increment) {
        var fieldName = "untctcm_calctyp" + increment;
        if ($scope.costSheetTemplate[fieldName] == 1) {
            $("input[name='untctcm_val_formula" + increment + "']").attr("disabled", false);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", true);
        } else {
            $("input[name='untctcm_val_formula" + increment + "']").attr("disabled", true);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", false);
        }
    };
    $scope.openFormulaModal = function(val) {
        var modalInstance = $uibModal.open({
            templateUrl: 'formula.html',
            controller: 'costComponentFormula',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return val;
                }
            }
        });
    };

    $scope.updateBlockCostSheet = function(formName, formObj) {

        $scope.submit = true;
        if ($scope[formName].$valid) {
            formObj.untctcm_comp_guid = $cookieStore.get('comp_guid');
            formObj.untctcm_Blocks_Id = $stateParams.blockId;
            formObj.untctcm_SBA = 0;
            formObj.untctcm_SiteArea = 0;

            console.log(formObj);

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Updt",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                /*var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go("/CostSheetTemplates");
                }*/
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
});