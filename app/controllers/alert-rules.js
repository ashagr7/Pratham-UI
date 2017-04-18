app.controller("alertRulesCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Alert Rules";
    ($scope.getAlertRules = function(){
		angular.element(".loader").show();
		$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/RulesVwGet",
			ContentType: 'application/json',
            data: {
			  "rule_user_id" : $cookieStore.get('user_id'),
			  "rule_comp_guid" : $cookieStore.get('comp_guid')
			}
		}).success(function(data){
			$scope.alertRules = data;
			angular.element(".loader").hide();
		}).error(function(){
			angular.element(".loader").hide();
		})
	})();
});
app.controller("createNewRuleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Create New Alert Rule";
    $scope.createNewRule = {
        rule_moduleid: ''
    };
    $scope.getModules = (function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": 0
            }
        }).success(function(data) {
            $scope.modules = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getActionTypes = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ActiontypeGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
            }
        }).success(function(data) {
            $scope.actionTypes = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }


    $scope.saveRule = function(formName, formObj) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            formObj.rule_comp_guid = $cookieStore.get('comp_guid');
            formObj.rule_user_id = $cookieStore.get('user_id');
            console.log(JSON.stringify(formObj));
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/Rules/Ins",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                var res = data.ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go('/UpdateRule', {
                        ruleId: data.ruleid,
                        moduleId: data.rule_moduleid
                    });
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
});

app.controller("updateRuleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Update Rule";
	var ruleId = $stateParams.ruleId;
    var moduleId = $stateParams.moduleId;
	$scope.recordType = 0;
    
	$scope.rules = [];
	
    $scope.getSubModules = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
            }
        }).success(function(data) {
            $scope.subModules = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getSubModules(moduleId);
    $scope.showInput0 = true;
    $scope.getFieldValues = function(fieldId,index) {
        var fieldValues = 'fieldValues'+index;
        var showDrodown = 'showDrodown'+index;
        var showInput = 'showInput'+index;
        var disableOperator = 'disableOperator'+index;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModfldvaluesGet",
            ContentType: 'application/json',
            data: {
                "module_id": fieldId
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            if (data.length == 1 && data[0].ErrorDesc == "-1 | No Module field Values do not exist for this Module") {
                $scope[showDrodown] = false;
                $scope[showInput] = true;
                $scope[disableOperator] = false;
            } else {
                $scope[fieldValues] = data;
                $scope[showInput] = false;
                $scope[showDrodown] = true;
                $scope.rules[index].rulecriteria_condition = "="
                $scope[disableOperator] = true;
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
	
	$scope.addRow = function(selectedVal){        
        if(selectedVal=="" || selectedVal==undefined){
            alert("AA");
            return;
        }
        
		var i = $(".alertRuleTable tr").length;
        var showInput = 'showInput'+i;
		var htmlRow = '<tr> <td> <select class="form-control" ng-model="rules['+i+'].rulecriteria_modfield_id" ng-change="getFieldValues(rules['+i+'].rulecriteria_modfield_id,'+i+')"> <option value="">Field</option> <option ng-repeat="x in subModules" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules['+i+'].rulecriteria_condition" ng-disabled="disableOperator'+i+'"> <option value="">Operator</option> <option value="=">=</option> <option value="<>">&#60;&#62;</option> <option value=">">&#62;</option> <option value="<">&#60;</option> <option value=">=">&#62;=</option> <option value="<=">&#60;</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" ng-show="showInput'+i+'" placeholder="Value" ng-model="rules['+i+'].rulecriteria_criteria"/> <select ng-show="showDrodown'+i+'" class="form-control" ng-model="rules['+i+'].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues'+i+'" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td><select class="form-control" ng-model="rules['+i+'].rule_criteria_operator"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules['+i+'].rule_criteria_operator)">Add</button></td> </tr>';
		
		htmlRow = $compile(htmlRow)($scope);
        angular.element(".alertRuleTable").append(htmlRow);
        $scope[showInput] = true;
	}
    
        $scope.updateRule = function(obj){
        angular.element(".loader").show();
        for(i=0;i<obj.length;i++){
            obj[i].rulecriteria_rule_id = ruleId;
			obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $state.go("/Action",{
                ruleId: ruleId
            });
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
});

app.controller("actionCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Choose Action";
    var ruleId = $stateParams.ruleId;
    $scope.action = {
        actionType:"email",
        template:""
    }
    $scope.saveAction = function(formName, formObj){
        $state.go("/Schedule",{
                ruleId: ruleId
        });
    }
});

app.controller("scheduleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.monthDates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.pageTitle = "Schedule Alert";
    $scope.ruleId = $stateParams.ruleId;
    $scope.previewTemplate = function(tempId){
        alert(tempId);
    }
});