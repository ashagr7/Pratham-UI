app.controller("unitGenerationCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    var unitNosArr = [];

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();
    ($scope.phaseListFun = function(projectName) {
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), $scope.projectId).then(function(response) {
            $scope.phaseList = response.data;
            console.log($scope.phaseList);
            for (i = 0; i < $scope.phaseList.length; i++) {
                if ($scope.phaseList[i].Phase_Id == $scope.phaseId) {
                    $scope.untGeneration = {
                        projectName: $scope.projectId,
                        phase: $scope.phaseId,
                        typeId: $scope.phaseList[i].Phase_UnitType.UnitType_Id
                    };
                    $scope.typeObj = $scope.phaseList[i].Phase_UnitType;
                }
            }
            angular.element(".loader").hide();
        });
    })();

    ($scope.getBlockList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": $scope.phaseId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.addSampleData = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            /*Update Block*/
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Block/Updt",
                ContentType: 'application/json',
                data: {
                    "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                    "Blocks_Id": formObj.block,
                    "Blocks_Floors": formObj.noOfFloors,
                    "Blocks_UnitPerfloor": formObj.unitsPerFloor,
                    "Blocks_Devation": "true"
                }
            }).success(function(data) {
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                console.log(resSplit[0]);
                if (resSplit[0] == 0) {
                    if (formObj.seperator == undefined) {
                        formObj.seperator = "";
                    }
                    if (formObj.noOfFloors > 9) {
                        floorNo = "01";
                    } else {
                        floorNo = "1";
                    }

                    angular.element("#unitRows").html('');
                    unitNosArr = [];
                    var unitsPerFloor = formObj.unitsPerFloor;
                    var unitNo = parseInt(formObj.unitNo);
                    var skipBy = parseInt(formObj.skipBy);
                    var i = 1;
                    while (i <= unitsPerFloor) {
                        unitNosArr.push(unitNo);
                        var tableRow = '<tr><td><input type="text" class="form-control" value="' + floorNo + formObj.seperator + unitNo + '" name="unitNos" ng-required="true"/></td> <td><input type="text" class="form-control" name="unitName" ng-model="untDetails[' + i + '].unitName"/></td> <td><input type="text" class="form-control" name="unitType" ng-model="untDetails[' + i + '].unitType"/></td> <td> <select class="form-control" name="unitBedroom" ng-model="untDetails[' + i + '].unitBedroom"> <option value="">Select</option> <option value="1">1</option> </select> </td> <td> <select class="form-control" name="unitBalconies" ng-model="untDetails[' + i + '].unitBalconies"> <option value="">Select</option> <option value="1">1</option> </select> </td> <td> <select class="form-control" name="unitBathrooms" ng-model="untDetails[' + i + '].unitBathrooms"> <option value="">Select</option><option>3</option> </select> </td> <td><input type="text" class="form-control" name="unitSuperArea" id="untDetails' + i + 'unitSuperArea" ng-model="untDetails[' + i + '].unitSuperArea"/></td> <td><input type="number" ng-keyup="calculatePercentage(' + i + ')" id="untDetails' + i + 'unitPercentage" class="form-control" name="unitPercentage" ng-model="untDetails[' + i + '].unitPercentage"/></td> <td><input type="text" class="form-control" ng-disabled="true" name="unitCarpetArea" id="untDetails' + i + 'unitCarpetArea" ng-model="untDetails[' + i + '].unitCarpetArea"/></td> <td> <select class="form-control" name="unitPremium" ng-model="untDetails[' + i + '].unitPremium"> <option value="">Select</option> <option>Y</option> </select> </td> <td> <select class="form-control" name="unitPosition" ng-model="untDetails[' + i + '].unitPosition"> <option value="">Select</option> <option>E</option></select></td></tr>';
                        var tableRowComplied = $compile(tableRow)($scope);
                        angular.element("#unitRows").append(tableRowComplied);
                        unitNo = unitNo + skipBy;
                        i++;
                    }
                    console.log(unitNosArr);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        }
    };

    $scope.calculatePercentage = function(id) {
        var percentage = $('#untDetails' + id + 'unitPercentage').val();

        if (percentage > 0 && percentage <= 100) {
            var superBuiltArea = $('#untDetails' + id + 'unitSuperArea').val();
            var carpetArea = superBuiltArea - (superBuiltArea * (percentage / 100));
            $('#untDetails' + id + 'unitCarpetArea').val(Math.round(parseFloat(carpetArea)));
        } else {
            alert("Percentage value should be between 0-100.");
            return false;
        }
    };

    $scope.generateForAllFloors = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];
        for (i = initiator; i <= parentObj.noOfFloors; i++) {
            for (j = 1; j < formObj.length; j++) {
                var unitObj = {};
                var unitNo = unitNosArr[j - 1];
                unitNo = i + '' + parentObj.seperator + unitNo;
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = parentObj.typeId;
                unitObj.UnitDtls_Block_Id = parentObj.block;
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = unitNo;
                unitObj.UnitDtls_Name = formObj[j].unitName;
                unitObj.UnitDtls_Type = formObj[j].unitType;
                unitObj.UnitDtls_Balcn = formObj[j].unitBalconies;
                unitObj.UnitDtls_BRoom = formObj[j].unitBathrooms;
                unitObj.UnitDtls_Rooms = formObj[j].unitBedroom;
                unitObj.UnitDtls_Msrmnt = formObj[j].unitCarpetArea;
                unitObj.UnitDtls_Directn = formObj[j].unitPosition;
                unitObj.UnitDtls_Floor = i;
                unitObj.UnitDtls_Premium = formObj[j].unitPremium;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_BuliltupArea = formObj[j].unitSuperArea;
                unitObj.UnitDtls_Status = 1;
                unitsJson.push(unitObj);
            }

        }
        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: unitsJson
        }).success(function(data) {
            console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            console.log(resSplit[0]);
            if (resSplit[0] == 0) {
                $state.go("/Units", {
                    projId: $scope.projectId,
                    phaseId: $scope.phaseId,
                    blockId: parentObj.block
                });
            }
        }).error(function() {});
    };

    $scope.checkBlockUnits = function(blockId) {
        if (blockId == undefined) {
            return;
        }
        var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
            $scope.blockFloorUnits = response.data[1].Blocks_UnitPerfloor;
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
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
            console.log($scope.UnitsArr);
            angular.element(".loader").hide();
        });
    };

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
                "blockId": parentObj.block
            });
        }).error(function() {});
    }
});