app.controller("leadsCtrl", function($scope, $rootScope, $http, $cookieStore, $uibModal, $state, $window, httpSvc) {
    $scope.searchLead = ''; // set the default search/filter term
    $scope.selected = []; //stores checked items only

    var leadsPostObj = {
        "user_comp_guid": $cookieStore.get('comp_guid'),
        "user_type": 3
    };
	angular.element(".loader").show();
    httpSvc.leads.getAll(leadsPostObj).success(function(data) {
        if (data[0].user_ErrorDesc != '-1 | User record does not exist') {
            angular.element(".loader").hide();
            $scope.leads = data;
        } else {
            angular.element(".loader").hide();
        }
    }).error(function(data) {
		angular.element(".loader").hide();
	});

    function printMe(val) {
        console.log("" + val);
    }

    $scope.exist = function(item) {
        return $scope.selected.indexOf(item) > -1;
    }
    $scope.toggleSelection = function(item) {
        var idx = $scope.selected.indexOf(item);
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
        } else {
            $scope.selected.push(item);
        }

    }
    $scope.checkAll = function() {
        if ($scope.selectAll) {
            angular.forEach($scope.leads, function(item) {
                idx = $scope.selected.indexOf(item.user_id);
                if (idx >= 0) {
                    return true;
                    //                        console.log($scope.selected);
                } else {
                    $scope.selected.push(item.user_id);
                    //                        console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
            //              console.log($scope.selected);
        }
    };

    $scope.leadToProspectBtnClick = function() {
        var str = "" + $scope.selected;
        if (str != "") {
			var obj = {
                    "user_ids": str,
                    "user_compguid": $cookieStore.get('comp_guid')
            };
            angular.element(".loader").show();
            httpSvc.leads.leadToProspect(obj).success(function(data) {
                if (data.ErrorDesc == "0 | Update Success") {
                    $scope.selected = [];
                    angular.element(".loader").hide();
                    $window.location.reload();
                } else {
                    angular.element(".loader").hide();
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            $rootScope.appMsg = "Please select at least one lead.";
 			$rootScope.showAppMsg = true;
        }
    }

    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'leadDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.leads[selectedItem];
                }
            }
        });
    };

    $scope.viewLeadStatus = function(leadNo) {
        alert("View Lead Status: " + leadNo);
    };
});

app.controller("leadDetailCtrl", function($scope, $uibModalInstance, $state, item) {
    $scope.leadType = ['hot', 'warm', 'cold'];
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = $scope.lead.userprojlist;
    }

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.deleteRow = function(rowId) {
        angular.element("tr#" + rowId).remove();
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": leadId
        });
    };

    $scope.getTypeNameById = function(typeId) {
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

app.controller("addLeadCtrl", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Add Lead";
    $scope.addLeadBtn = true;
    ($scope.getLeadSource = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/LeadSourceGet",
            ContentType: 'application/json',
            data: {
                "lead_source_compguid": "d0cb84c5-6b52-4dff-beb5-50b2f4af5398"
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.lead_source_list = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    $scope.addLead = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_type": 3,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                    "user_code": formObj.leadCode,
                    "user_lead_status_id": parseInt(formObj.leadStage),
                    "user_createdby": $cookieStore.get('user_id'),
                    "user_lead_source_id": parseInt(formObj.leadSource)
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/ProjectDetails", {
                        "leadID": data.user_id
                    });
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
            }).error(function() {});
        }
    };
});

app.controller("editLeadCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Lead";
    $scope.editLeadBtn = true;
    ($scope.getLeadSource = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/LeadSourceGet",
            ContentType: 'application/json',
            data: {
                "lead_source_compguid": "d0cb84c5-6b52-4dff-beb5-50b2f4af5398"
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.lead_source_list = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    ($scope.getLeadDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            var state = data.user_state;
            var city = data.user_city;
            var dob = $filter('date')(data.user_dob, 'MMM dd, yyyy');

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }
            if (dob == "Jan 01, 0001") {
                dob = "";
            }
            if (data.user_id != 0) {
                $scope.addLead = {
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    mobileNumber: data.user_mobile_no,
                    emailId: data.user_email_address,
                    dob: dob,
                    gender: data.user_gender,
                    country: data.user_country,
                    state: state + "",
                    city: city + "",
                    address: data.user_address,
                    zip: data.user_zipcode,
                    leadCode: data.user_code,
                    officeNumber: data.user_office_no,
                    leadStage: data.user_lead_status_id.toString(),
                    leadSource: data.user_lead_source_id + ''
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
        //console.log(formObj);
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_id": $scope.leadId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                    "user_code": formObj.leadCode,
                    "user_lead_status_id": parseInt(formObj.leadStage),
                    "user_lead_source_id": parseInt(formObj.leadSource)
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id != 0) {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/Leads");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});

app.controller("projectDetailsCtrl", function($scope, $http, $state, $cookieStore, $compile, $stateParams, $window, myService) {
    $scope.leadId = $stateParams.leadID;
    if ($scope.leadId == undefined) {
        $state.go('/AddLead');
    }
    ($scope.getLeadProjects = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            if (data.user_id != 0) {
                if (data.userprojlist != null) {
                    $scope.leadProjects = data.userprojlist;
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.flatStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.flatStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

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

    $scope.getUnits = function(blocks) {
        $scope.units = [];
        $scope.perFloorUnits = [];
        if (blocks == "") {
            return;
        }
        /*for (i = 0; i < $scope.blockList.length; i++) {
            if ($scope.blockList[i].Blocks_Id == blocks) {
                $scope.blockFloors = $scope.blockList[i].Blocks_Floors;
                $scope.blockFloorUnits = $scope.blockList[i].Blocks_UnitPerfloor;
            }
        }*/
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Block_Id": blocks,
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));

            $scope.blockFloors = data[1].Blocks_Floors;
            $scope.blockFloorUnits = data[1].Blocks_UnitPerfloor;

            var dataOfUnits = data[0];

            console.log($scope.blockFloors + " - " + $scope.blockFloorUnits);

            $scope.selectedUnits = [];
            $(".dispNone").each(function(index) {
                var projObj = $(this).text();
                projObj = angular.fromJson(projObj);
                $scope.selectedUnits.push(projObj.UnitDtls_Id);
            });

            for (i = 0; i < dataOfUnits.length; i++) {
                for (j = 0; j < $scope.selectedUnits.length; j++) {
                    if (dataOfUnits[i].UnitDtls_Id == $scope.selectedUnits[j]) {
                        dataOfUnits[i].markUp = "selected";
                        break;
                    }
                }
            }
            var count = 0;
            for (k = 0; k < $scope.blockFloors; k++) {
                var floorUnits = [];
                for (l = 0; l < $scope.blockFloorUnits; l++) {
                    floorUnits.push(dataOfUnits[count]);
                    count++;
                }
                $scope.perFloorUnits.push(floorUnits);
            }
            $scope.units = dataOfUnits;
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.markUnits = function() {
        alert($scope.selectedUnits);
    };
    $scope.selectUnit = function(unitId, projectDetails) {
        for (i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].UnitDtls_Id == unitId) {
                if ($scope.units[i].UnitDtls_Status == 1 || $scope.units[i].UnitDtls_Status == 2) {
                    if ($("#unit" + $scope.units[i].UnitDtls_Id).hasClass('selected')) {
                        $scope.deleteRow($scope.projectDetails.projectName, $scope.units[i].UnitDtls_Id);
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projectDetails.projectName);
                        projObj.Phase_Id = parseInt($scope.projectDetails.phase);
                        projObj.Blocks_Id = parseInt($scope.projectDetails.blocks);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);

                        //                      console.log($scope.projectDetails);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td>' + $scope.projectDetails.projectName + '</td><td>' + $scope.projectDetails.phase + '</td><td>' + 'Flat Type' + '</td><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_BRoom + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_Msrmnt + ' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + projectDetails.projectName + ',' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).addClass('selected');
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
            }
        }
    };
    $scope.deleteRow = function(projId, rowId) {
        var deleteUser = $window.confirm('Are you sure you want to delete ?');

        if (deleteUser) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/ProjUnitDel",
                ContentType: 'application/json',
                data: [{
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "ProjDtl_Id": projId
                }]
            }).success(function(data) {
                if (data.Comm_ErrorDesc == '0|0') {
                    $("tr#" + rowId).remove();
                    $("#unit" + rowId).removeClass('selected');
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    $scope.saveLead = function(projectObj) {
        var projJson = [];
        $(".dispNone").each(function(index) {
            //console.log(index + ": " + $(this).text());
            var projObj = $(this).text();
            projObj = angular.fromJson(projObj);
            projObj.comp_guid = $cookieStore.get('comp_guid');
            projObj.Projusrid = $scope.leadId;
            projObj.ProjDtl_Status = 2;
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitSave",
            ContentType: 'application/json',
            data: projJson
        }).success(function(data) {
            angular.element(".loader").hide();
            if (data.Comm_ErrorDesc == '0|0') {
                $cookieStore.remove('lead_id');
                $state.go('/Prospects');
                angular.element(".loader").hide();
            } else {
                alert('Something went wrong.');
            }
            //console.log(JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.getTypeNameById = function(typeId) {
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