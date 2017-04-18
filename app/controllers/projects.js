app.controller("projectsCtrl", function($scope, $http, $cookieStore, $state) {

    ($scope.getProjectsList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Proj/View",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid'),
                "ProjId": 0
            }
        }).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Proj_ErrorDesc == "0") {
                    if (data[i].Proj_Types.length > 1) {
                        var types = data[i].Proj_Types.split('#');
                        var typeValue = '';
                        for (var j = 0; j < types.length; j++) {
                            if (!(j == types.length - 1))
                                typeValue = typeValue + ' , ' + getTypeNameById(types[j]);
                            else
                                typeValue = typeValue + ' & ' + getTypeNameById(types[j]);
                        }
                        data[i].Proj_Types = typeValue.substring(2, typeValue.length);
                    } else {
                        data[i].Proj_Types = getTypeNameById(data[i].Proj_Types);
                    }
                }
            }
            $scope.projectsList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});

app.controller("addProjectCtrl", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Project";
    $scope.addProjectBtn = true;
    $scope.saveProject = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var projType = '';

            if (formObj.type1 == true)
                projType = '1';
            if (formObj.type2 == true)
                projType = projType + '2';
            if (formObj.type3 == true)
                projType = projType + '3';
            if (formObj.type4 == true)
                projType = projType + '4';

            var projTypes = projType.split('');
            projType = '';
            for (var i = 0; i < projTypes.length; i++) {
                if (i != 0)
                    projType = projType + '#' + projTypes[i];
                else
                    projType = projTypes[i];
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId": 0,
                    "Proj_Code": formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno": formObj.surveyNos,
                    "Proj_Phases": formObj.phases,
                    "Proj_Types": projType
                }
            }).success(function(data) {
                //                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getTypeIdByName(typeName) {
        var typeId = '';
        switch (typeName) {
            case 'Flat':
                typeId = 1;
                break;
            case 'Sites':
                typeId = 2;
                break;
            case 'Villa':
                typeId = 3;
                break;
            case 'Row Houses':
                typeId = 4;
                break;
            default:
                console.log('eror');
        }
        return typeId;
    }
});

app.controller("editProjectCtrl", function($scope, $http, $cookieStore, $state, $stateParams) {
    $scope.pageTitle = "Edit Project";
    $scope.editProjectBtn = true;

    ($scope.getProjectList = function() {
        $scope.projId = $stateParams.projId;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Proj/View",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid'),
                "ProjId": $scope.projId
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            var projTypes = data[0].Proj_Types;
            $scope.addProject = {
                location: data[0].Proj_Location,
                projectName: data[0].Proj_Name,
                phases: data[0].Proj_Phases,
                surveyNos: data[0].Proj_Surveyno,
                projCode: data[0].Proj_Code,
                type1: projTypes.indexOf("1") != -1,
                type2: projTypes.indexOf("2") != -1,
                type3: projTypes.indexOf("3") != -1,
                type4: projTypes.indexOf("4") != -1
            };
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    $scope.editProject = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var projType = '';

            if (formObj.type1 == true)
                projType = '1';
            if (formObj.type2 == true)
                projType = projType + '2';
            if (formObj.type3 == true)
                projType = projType + '3';
            if (formObj.type4 == true)
                projType = projType + '4';

            var projTypes = projType.split('');
            projType = '';
            for (var i = 0; i < projTypes.length; i++) {
                if (i != 0)
                    projType = projType + '#' + projTypes[i];
                else
                    projType = projTypes[i];
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId": $scope.projId,
                    "Proj_Code": formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno": formObj.surveyNos,
                    "Proj_Phases": formObj.phases,
                    "Proj_Types": projType
                }
            }).success(function(data) {
                //                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getTypeIdByName(typeName) {
        var typeId = '';
        switch (typeName) {
            case 'Flat':
                typeId = 1;
                break;
            case 'Sites':
                typeId = 2;
                break;
            case 'Villa':
                typeId = 3;
                break;
            case 'Row Houses':
                typeId = 4;
                break;
            default:
                console.log('eror');
        }
        return typeId;
    }
});