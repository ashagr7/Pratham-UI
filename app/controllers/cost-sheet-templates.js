app.controller("costSheetTemplatesCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal) {
    $scope.title = "Cost Sheet Templates";
    ($scope.getCostSheetTemplates = function() {
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
            console.log(data);
            $scope.costSheetTemplates = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.showTemplateDetails = function(obj) {
        console.log(obj);
        var modalInstance = $uibModal.open({
            templateUrl: 'costSheetDetail.html',
            controller: 'costSheetDetail',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return obj;
                }
            }
        });
    };
});

app.controller("costSheetDetailCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModalInstance, item) {
    $scope.costSheetDetail = item;
    $scope.formulaType = ['Formula', 'Flat'];
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("costSheetTemplateCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal) {
    $scope.title = "Add Cost Sheet Template";
    /*$scope.costSheetTemplate = {
        untctcm_Ascending: '',
    };*/

    ($scope.getTemplateDetails = function() {
        $scope.showAddCmptBtn = true;
        var tempId = $stateParams.templateId;
        console.log(tempId);
        if (tempId != "" && tempId != undefined) {
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
                if (data[0].untctcm_ErrorDesc != "-1 | Unitcostcompnts do not exist") {
                    $scope.editTemplate = true;
                    $scope.showAddCmptBtn = false;
                    $scope.costSheetTemplate = data[0];
                    for (i = 1; i <= 19; i++) {
                        var increment;
                        if (i == 7) {
                            i = i + 1;
                        }
                        increment = i;
                        console.log(increment);
                        var costComponentRow = '<tr> <td> <label>Code' + increment + '</label> </td> <td> <input type="text" class="form-control" name="untctcm_code' + increment + '" ng-model="costSheetTemplate.untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="untctcm_name' + increment + '" ng-model="costSheetTemplate.untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:costSheetTemplate.untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="untctcm_comments' + increment + '" ng-model="costSheetTemplate.untctcm_comments' + increment + '"/> </td><td><span class="glyphicon glyphicon-trash" ng-click="deleteCostComponent(' + increment + ')"></span></td></tr>';
                        //                console.log(costComponentRow);
                        costComponentRow = $compile(costComponentRow)($scope);
                        angular.element(".formulaTable").append(costComponentRow);
                    }
                    angular.element(".loader").hide();
                } else {
                    $state.go("/CostSheetTemplate");
                    angular.element(".loader").hide();
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            angular.element(".loader").hide();
            $state.go("/CostSheetTemplate");
        }
    })();

    $scope.addCostComponent = function() {
        var trCount = $(".formulaTable > tr").length;
        var increment = trCount + 1;
        if (increment >= 7) {
            increment = increment + 1;
        }
        if (increment >= 20) {
            return;
        }
        var costComponentRow = '<tr> <td> <label>Code' + increment + '</label> </td> <td> <input type="text" class="form-control" name="untctcm_code' + increment + '" ng-model="costSheetTemplate.untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="untctcm_name' + increment + '" ng-model="costSheetTemplate.untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:costSheetTemplate.untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="untctcm_comments' + increment + '" ng-model="costSheetTemplate.untctcm_comments' + increment + '"/> </td><td><span class="glyphicon glyphicon-trash" ng-click="deleteCostComponent(' + increment + ')"></span></td></tr>';

        costComponentRow = $compile(costComponentRow)($scope);
        angular.element(".formulaTable").append(costComponentRow);
    };

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

    $scope.deleteCostComponent = function(rowId) {
        alert(rowId);
    };

    $scope.saveCostSheetTemplate = function(formName, formObj) {
        var url = "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Save";
        $scope.submit = true;
        if ($scope[formName].$valid) {
            formObj.untctcm_comp_guid = $cookieStore.get('comp_guid');
            formObj.untctcm_Blocks_Id = 0;
            formObj.untctcm_SBA = 0;
            formObj.untctcm_SiteArea = 0;

            if ($scope.editTemplate) {
                formObj.untctcm_Id = $stateParams.templateId;
                url = "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Updt";
            }

            console.log(formObj);

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: url,
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go("/CostSheetTemplates");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
});
app.controller("costComponentFormulaCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, item) {
    $scope.formula = {
        abbreviation: '',
        operator: ''
    };
    $scope.formulaGen = item.formulaVal;
    $scope.fieldCount = item.index;
    $scope.fieldName = "untctcm_val_formula" + $scope.fieldCount;
    $scope.close = function() {
        $uibModalInstance.close();
    };
    $scope.addFormula = function(formObj) {
        var preVal = angular.element("#formulaGen").val();
        var formula = formObj.abbreviation + formObj.operator;
        var finalFormula = preVal + formula;
        //        angular.element("#formulaGen").val(finalFormula);
        $scope.formulaGen = finalFormula;
        $scope.formula = {
            abbreviation: '',
            operator: ''
        };
    };
    $scope.saveFormula = function() {
        /*console.log(fieldName);*/
        if ($scope.formulaGen != "") {
            $scope.costSheetTemplate[$scope.fieldName] = $scope.formulaGen;
            $uibModalInstance.close();
        }
    };
});