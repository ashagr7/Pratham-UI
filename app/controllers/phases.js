app.controller("editPhasesCtrl", function($scope, $http, $cookieStore, $state, $compile, $stateParams, myService) {
    var Phase_Proj_Id = $stateParams.projId;
    var Phase_Id = $stateParams.phaseId;

    $scope.pageTitle = "Edit Phase";
    $scope.editPhaseBtn = true;

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    ($scope.getPhaseInfo = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": Phase_Proj_Id,
                "Phase_Id": Phase_Id
            }
        }).success(function(data) {
            //console.log(data);
            editAppendFields(data);
            var phaseList = [];
            var blockIdList = [];

            if (data[0].LstofBlocks != null) {
                for (var i = 0; i < data[0].LstofBlocks.length; i++) {
                    phaseList.push(data[0].LstofBlocks[i].Blocks_Name);
                    blockIdList.push(data[0].LstofBlocks[i].Blocks_Id);
                }
            }
            $scope.projectDetails = {
                phaseName: data[0].Phase_Name,
                location: data[0].Phase_Location,
                surveyNos: data[0].Phase_Surveynos,
                unitOfMeasurement: data[0].Phase_UnitMsmnt.UnitMsmnt_Id + "",
                phaseType: data[0].Phase_UnitType.UnitType_Id,
                noOfBlocks: data[0].Phase_NoofBlocks,
                projectName: $stateParams.projId,
                blockName: phaseList,
                blockId: blockIdList
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();




    function editAppendFields(data) {
        angular.element("#noOfBlocks").html('');
        if (data[0].LstofBlocks != null) {
            for (i = 1; i <= data[0].LstofBlocks.length; i++) {
                var childDiv = '<div id="block' + data[0].LstofBlocks[i - 1].Blocks_Id + '"><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control inputWithIcon" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /> <input type="text" class="form-control dispNone" ng-model="projectDetails.blockId[' + (i - 1) + ']" ng-value="' + data[0].LstofBlocks[i - 1].Blocks_Id + '" name="blockId[' + (i - 1) + ']"/>';

                if (!data[0].LstofBlocks[i - 1].blnunitexists)
                    childDiv = childDiv + '<span ng-click="deleteBlock(' + data[0].Phase_Id + ',' + data[0].LstofBlocks[i - 1].Blocks_Id + ')" class="glyphicon glyphicon-trash delete"></span></div>';
                else
                    childDiv = childDiv + "</div>";
                var childDivComplied = $compile(childDiv)($scope);
                angular.element("#noOfBlocks").append(childDivComplied);
            }
        }
    };

    $scope.appendFields = function() {
        var index = 0;
        var placeholder = 1;
        var blockNumbers = $("#noOfBlocks > div").length;

        if (blockNumbers != 0) {
            var lastInputHtml = $("#noOfBlocks > div:last-child > input").attr('name');
            index = parseInt(lastInputHtml.substring(lastInputHtml.indexOf('[') + 1, lastInputHtml.indexOf(']'))) + 1;
            placeholder = index + 1;
        }

        var childDiv = '<div id="block' + index + '"><input type="text" placeholder="Block  ' + placeholder + ' Name" title="Block ' + index + ' Name" class="form-control inputWithIcon" name="blockName[' + (index) + ']" ng-model="projectDetails.blockName[' + (index) + ']" /></div>';
        var childDivComplied = $compile(childDiv)($scope);
        angular.element("#noOfBlocks").append(childDivComplied);

        var something = $("#blockCount").val(blockNumbers + 1);
    };

    $scope.editPhase = function(formObj, formName) {
        var noOfBlocks = $("#blockCount").val();
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                if (formObj.blockId[i] != undefined)
                    tmp.Blocks_Id = formObj.blockId[i];
                blockLst.push(tmp);
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": $stateParams.phaseId,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data);
                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if ($scope.addPhaseResult.Comm_ErrorDesc.match('0|')) {
                    $state.go("/EditUnit", {
                        projId: Phase_Proj_Id,
                        phaseId: Phase_Id
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };

    $scope.deleteBlock = function(blockId, phaseId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Delete",
            ContentType: 'application/json',
            data: {
                "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                "Blocks_Id": phaseId,
                "Blocks_Phase_Id": blockId
            }
        }).success(function(data) {
            $("#block" + phaseId).remove();
            var blockNumbers = $("#noOfBlocks > div").length;
            $("#blockCount").val(blockNumbers);
            //            $state.go("/EditPhases", {
            //                "projId": $stateParams.projId,
            //                "phaseId": $stateParams.phaseId
            //            });
            //            $state.reload();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
});

app.controller("addPhasesCtrl", function($scope, $http, $cookieStore, $state, $compile, $stateParams) {
    $scope.pageTitle = "Add Phase";
    $scope.addPhaseBtn = true;

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            $scope.projectDetails = {
                phaseType: "1",
                unitOfMeasurement: "1",
                projectName: $stateParams.projId
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.appendFields = function(noOfLocation) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= noOfLocation; i++) {
            var childDiv = '<div><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < formObj.noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                blockLst.push(tmp);
            }

            //            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": 0,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": formObj.noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data.Comm_ErrorDesc);
                var resultData = data.Comm_ErrorDesc;
                var resDataArray = resultData.split('|');

                console.log(resDataArray);

                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if (resDataArray[0] == 0) {
                    $state.go("/AddUnit", {
                        projId: formObj.projectName,
                        phaseId: resDataArray[1]
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("phasesCtrl", function($scope, $http, $cookieStore, $state, $compile) {
    $scope.typeNames = ['Flat', 'Sites', 'Villa', 'Row Houses'];

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhases = function(projId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham//Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": projId
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.phaseList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            $state.go("/AddPhases", {
                "projId": formObj.projectName
            });
            /*$state.go("/AddPhases");
            $scope.projectDetails = {
                projectName : formObj.projectName
            };*/
        }
    };
});

app.controller("addUnitCtrl", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Add Unit";
    $scope.addPhaseUnitBtn = "ture";

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            //            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "0") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "0") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "0") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "0") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "0") {
                    relinquishType = "true";
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: data.UnitTypeData_lstplappv[0].plnappno,
                    planApproveDt: data.UnitTypeData_lstplappv[0].plnappdt,
                    planApproveAuth: data.UnitTypeData_lstplappv[0].plnappaut,
                    nocObtained: nocObtainedType,
                    nocDate: data.UnitTypeData_lstnoc[0].nocdt,
                    nocDocNo: data.UnitTypeData_lstnoc[0].nocdocno,
                    relinquish: relinquishType,
                    docNum: data.UnitTypeData_lstlreq[0].reqsno,
                    docDate: data.UnitTypeData_lstlreq[0].reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                //                alert("wrong");
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.savePhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": 0
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("editUnitCtrl", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Edit Unit";
    $scope.editPhaseUnitBtn = "ture";
    $scope.editTypeDataId = 0;

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                $scope.editTypeDataId = data.UnitTypeData_Id;

                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "1") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "1") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "1") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "1") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "1") {
                    relinquishType = "true";
                }

                var planApproveNum = '';
                var planApproveDate = '';
                var planApproveAuth = '';

                if (data.UnitTypeData_lstplappv.length > 0) {
                    planApproveNum = data.UnitTypeData_lstplappv[0].plnappno;
                    planApproveDate = data.UnitTypeData_lstplappv[0].plnappdt;
                    planApproveAuth = data.UnitTypeData_lstplappv[0].plnappaut;
                }

                var nocDate = '';
                var nocNum = '';

                if (data.UnitTypeData_lstnoc.length > 0) {
                    nocDate = data.UnitTypeData_lstnoc[0].nocdt;
                    nocNum = data.UnitTypeData_lstnoc[0].nocdocno;
                }

                var reqsno = '';
                var reqdocndt = '';

                if (data.UnitTypeData_lstlreq.length > 0) {
                    reqsno = data.UnitTypeData_lstlreq[0].reqsno;
                    reqdocndt = data.UnitTypeData_lstlreq[0].reqdocndt;
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: planApproveNum,
                    planApproveDt: planApproveDate,
                    planApproveAuth: planApproveAuth,
                    nocObtained: nocObtainedType,
                    nocDate: nocDate,
                    nocDocNo: nocNum,
                    relinquish: relinquishType,
                    docNum: reqsno,
                    docDate: reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.editPhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": $scope.editTypeDataId
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});