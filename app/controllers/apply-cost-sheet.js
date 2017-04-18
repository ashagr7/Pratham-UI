app.controller("applyCostSheetCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService){
    $scope.title = "Apply Cost Sheet";
    $scope.projectId = $stateParams.projectId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;    
    
    $scope.getCostSheetTemplates = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": 0
            }
        }).success(function(data) {            
            $scope.costSheetTemplates = data;
            for (i = 1; i <= 19; i++) {
                var increment;
                if (i == 7) {
                    i = i + 1;
                }
                increment = i;                
                var costComponentRow = '<tr> <td> <label>Code' + increment + '</label> </td> <td> <input type="text" class="form-control" name="untctcm_code' + increment + '" ng-model="costSheetTemplate.untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="untctcm_name' + increment + '" ng-model="costSheetTemplate.untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:costSheetTemplate.untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="untctcm_comments' + increment + '" ng-model="costSheetTemplate.untctcm_comments' + increment + '"/> </td><td><span class="glyphicon glyphicon-trash" ng-click="deleteCostComponent(' + increment + ')"></span></td></tr>';
                //                console.log(costComponentRow);
                costComponentRow = $compile(costComponentRow)($scope);
                angular.element(".formulaTable").append(costComponentRow);
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
    $scope.checkBlockCostSheetTemplates = (function(){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": $scope.blockId
            }
        }).success(function(data) {            
            if(data[0].untctcm_ErrorDesc == "0"){
                $scope.showCostSheetTemplates = false;
                $scope.showMessage = true;
            }
            else{
                $scope.getCostSheetTemplates();
                $scope.showCostSheetTemplates = true;
                $scope.showMessage = false;
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

    $scope.saveFormula = function() {
        if ($scope.formulaGen != "") {
            $scope.costSheetTemplate[fieldName] = $scope.formulaGen;
            $uibModalInstance.close();
        }
    };

    ($scope.checkBlockUnits = function() {
        var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, $stateParams.blockId).then(function(response) {
            var blockFloorNumberArr = [];
            var blockFloors = response.data[1].Blocks_Floors;
            for (i = 1; i <= blockFloors; i++) {
                blockFloorNumberArr.push(i);
            }
            $scope.blockFloorNumbers = blockFloorNumberArr;
        });

    })();

    $scope.getTemplateDetails = function(tempId) {
        $scope.flag = 1;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": tempId,
                "untctcm_Blocks_Id": 0
            }
        }).success(function(data) {
            console.log(data);
            $scope.flag = 1;
            $scope.costSheetTemplate = data[0];
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.saveCostSheetTemplate = function(formName, formObj) {
        $scope.costSheetTemplate.floorRaiseDirection = "";
        $scope.submit = true;
        if ($scope[formName].$valid) {
            formObj.untctcm_comp_guid = $cookieStore.get('comp_guid');
            formObj.untctcm_Blocks_Id = parseInt($scope.blockId);
            formObj.untctcm_SBA = 0;
            formObj.untctcm_SiteArea = 0;
            console.log(JSON.stringify(formObj));

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Save",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go("/GenerateCostSheet", {
                        "blockId": $scope.blockId
                    });
                }
            }).error(function() {
                angular.element(".loader").hide();
            });

        }
    };
});