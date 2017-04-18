app.controller("updateProspectsCtrl", function($scope, $http, $cookieStore, $uibModal,$state) {
    //  $scope.searchLead = '';set the default search/filter term
    $scope.selected=[];//stores checked items only
    $scope.salesfunnelnameValues=[];
    $scope.assignedtoValues=[];
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.SalesFunnelDetails = data;            
                for(var i=0; i<$scope.SalesFunnelDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.SalesFunnelDetails[i].salesfunnel_name;
                        $scope.obj.value = $scope.SalesFunnelDetails[i].salesfunnel_id;
                        $scope.salesfunnelnameValues.push($scope.obj)                      
                        
                    }          
                //console.log($scope.secondDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };
    
    
    
    $scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            $scope.EmployeesDetails = data;
            for(var i=0; i<$scope.EmployeesDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.EmployeesDetails[i].user_first_name +" " + $scope.EmployeesDetails[i].user_last_name;
                        $scope.obj.value = $scope.EmployeesDetails[i].user_id;
                        $scope.assignedtoValues.push($scope.obj)                      
                        
                    }  
            //console.log($scope.assignedtoValues);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
    ($scope.getLeads = function() {
        $scope.getEmployeesDetails();
        $scope.getSalesFunnelDetails();
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 7
            }
        }).success(function(data) {
             $scope.getEmployeesDetails();
             $scope.getSalesFunnelDetails();
            angular.element(".loader").hide();
            for(var i=0;i<data.length;i++)
                {                   
                    if (data[i].user_lead_status_id == 1)
                        {
                           data[i].user_lead_status_id="HOT" ;
                        }
                    else if (data[i].user_lead_status_id == 2)
                        {
                              data[i].user_lead_status_id="WARM";
                        }
                    else{
                         data[i].user_lead_status_id="COLD";
                    }
                }
//            console.log($scope.salesfunnelnameValues);
            for(var i=0;i<data.length;i++)
                {     
                    for(var j=0;j<$scope.salesfunnelnameValues.length;j++){
                    if (data[i].user_salesfunnel_id == $scope.salesfunnelnameValues[j].value)
                        {
                           data[i].user_salesfunnel_name=$scope.salesfunnelnameValues[j].name;
                        }
                    else if(data[i].user_salesfunnel_id ==0)
                        {
                           data[i].user_salesfunnel_name="Not Assigned";
                        }
                    }
                }
            //console.log($scope.assignedtoValues);
            for(var i=0;i<data.length;i++)
                {     
                    for(var j=0;j<$scope.assignedtoValues.length;j++){
                    if (data[i].user_assingedto == $scope.assignedtoValues[j].value)
                        {
                           data[i].user_assingedto_name=$scope.assignedtoValues[j].name;
                        }
                    else if(data[i].user_assingedto ==0)
                        {
                           data[i].user_assingedto_name="Not Assigned";
                        }
                    }
                }
            
            $scope.leads = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    
    $scope.prospectDetail = function(userids) {
        var str2=""+$scope.selected;
        //console.log("the real slim:"+str2)
        var modalInstance = $uibModal.open({
            templateUrl: 'updateProPage.html',
            controller: 'updateProPageCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    userids=str2;
                    return userids;
                }
            }
        });
        
    };

    $scope.exist=function(item){
        return $scope.selected.indexOf(item)>-1;
    }
    $scope.toggleSelection=function(item){
        var idx =$scope.selected.indexOf(item);
        if(idx > -1){
            $scope.selected.splice(idx, 1);
             //console.log($scope.selected);
        }
        else{
            $scope.selected.push(item);
             //console.log($scope.selected);
        }
    }
    $scope.checkAll = function(){
        if($scope.selectAll){
            angular.forEach($scope.leads,function(item){
                    idx=$scope.selected.indexOf(item.user_id);
                    if(idx>=0){
                        return true;
                    }
                    else{
                        $scope.selected.push(item.user_id);
                         //console.log($scope.selected);
                    }
            })
        }
        else{
            $scope.selected = [];
             //console.log($scope.selected);
        }
    };
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'prospectDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.leads[selectedItem];
                }
            }
        });
    };

    $scope.addSiteVisit = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSiteVisit.html',
            controller: 'prospectDetailCtrl',
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
app.controller("prospectDetailCtrl", function($scope, $uibModalInstance, $state, $cookieStore, $http, myService, item) {
    $scope.timeslots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:30 PM'];
    $scope.leadType = ['hot', 'warm', 'cold'];
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = $scope.lead.userprojlist;
    }

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
        $scope.addSiteVisit.phase = "";
        $scope.addSiteVisit.blocks = "";
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
        $scope.addSiteVisit.blocks = "";
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

    $scope.getPreviousSiteVisits = (function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/UserSiteVisitGet",
            ContentType: 'application/json',
            data: {
                "sitevisit_userid": $scope.lead.user_id,
                "sitevisit_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            for(var i=0;i<data.length ;i++)
                {
                    if(data[i].sitevisit_walkin==2)
                       {
                       data[i].sitevisit_walkin="No"
                       }
                    else
                        {
                             data[i].sitevisit_walkin="Yes"
                        }
                     if(data[i].sitevisit_done==2)
                       {
                       data[i].sitevisit_done="Pending"
                       }
                    else
                        {
                             data[i].sitevisit_done="Done"
                        }
                }
            $scope.siteVisitData = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went Wrong...');
            angular.element(".loader").hide();
        });
    })();

    $scope.saveSiteVisit = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SiteVisitInsert",
                ContentType: 'application/json',
                data: {
                    "sitevisit_userid": $scope.lead.user_id,
                    "sitevisit_compguid": $cookieStore.get('comp_guid'),
                    "sitevisit_projectid": formObj.projectName,
                    "sitevisit_phaseid": formObj.phase,
                    "sitevisit_blockid": formObj.blocks,
                    "sitevisit_walkin": formObj.walkIn,
                    "sitevisit_pickupdatetime": formObj.datetime + ' T ' + formObj.time,
                    "sitevisit_contactperson_name": formObj.personName,
                    "sitevisit_contactperson_mobile": formObj.personMobile,
                    "sitevisit_pickupaddress": formObj.personAddress,
                    "sitevisit_done": 2
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                alert('Site Visit Schedule Sucessfully.');
                console.log(data);
                $uibModalInstance.close();
            }).error(function() {
                alert('Something Went Wrong...');
                angular.element(".loader").hide();
            });
        }
    };
});
app.controller("addProspectCtrl", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Add Prospect";
    $scope.addLeadBtn = true;
    ($scope.getLeadSource = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/LeadSourceGet",
            ContentType: 'application/json',
            data: {
                "lead_source_compguid":"d0cb84c5-6b52-4dff-beb5-50b2f4af5398"
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.lead_source_list= data;
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
                    "user_type": 7,
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
                    "user_createdby": $cookieStore.get('user_id')
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
app.controller("editProspectCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Prospect";
    $scope.editLeadBtn = true;
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
                    leadStage: data.user_lead_status_id.toString()
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Prospects");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
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
                    "user_lead_status_id": parseInt(formObj.leadStage)
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/Prospects");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});

app.controller("prospectsUnitAllocationCtrl", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    ($scope.getProjectList = function() {
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

    $scope.getPhaseList = function(projectName) {
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/AllocByUserType",
                ContentType: 'application/json',
                data: {
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "Projusrtyp": 3,
                    "Phase_Id": obj.phase,
                    "Blocks_Id": obj.blocks
                }
            }).success(function(data) {
                console.log(data);
                $scope.unitAllocationData = [];
                for (h = 0; h < data.length; h++) {
                    if (data[h].userprojlist != null) {
                        for (i = 0; i < data[h].userprojlist.length; i++) {
                            if (data[h].userprojlist[i].ProjDtl_Status != 7) {
                                $scope.unitAllocationObj = {};

                                $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                                $scope.unitAllocationObj.email = data[h].user_email_address;
                                $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                                /*$scope.unitAllocationObj.projName = data[h].userprojlist[i].Proj_Name;
                                $scope.unitAllocationObj.phaseName = data[h].userprojlist[i].Phase_Name;
                                $scope.unitAllocationObj.phaseType = 'Temp Phase Type';
                                $scope.unitAllocationObj.blockName = data[h].userprojlist[i].Blocks_Name;*/
                                $scope.unitAllocationObj.unitObj = data[h].userprojlist[i];
                                $scope.unitAllocationObj.leadID = data[h].user_id;

                                $scope.unitAllocationData.push($scope.unitAllocationObj);
                            }
                        }
                    }
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }

    $scope.updateUnitAllocationStatus = function(unitData) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitStatusUpdate.html',
            controller: 'unitUpdateCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitData;
                }
            }
        });
    };
});
app.controller("unitUpdateCtrl", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.unit = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.updateStatus = function(formObj) {
        if (formObj.updateStatus != undefined && formObj.updateStatus != '') {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Id": $scope.unit.unitObj.UnitDtls_Id,
                    "UnitDtls_Status": formObj.updateStatus,
                    "UnitDtls_user_id": formObj.leadID
                }
            }).success(function(data) {
                console.log(data);
                $uibModalInstance.close();
                if (data[0].UnitDtls_ErrorDesc == '0') {
                    $uibModalInstance.close();
                    $state.go("/ConvertCustomer", {
                        "leadID": $scope.unit.leadID,
                        "action": 'addCustomer'
                    });
                } else {
                    alert('some error in changing unit status.');
                }
            }).error(function() {
                alert('some error!!');
            });
        } else {
            alert('Please select any option first.');
        }
    };
});
app.controller("updateProPageCtrl", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
      $scope.secondDropValues=[];
      $scope.myModel = "";
      $scope.firstDropValues=[{name:"Lead Staus", value:1},{name:"Sales Funnel", value:2},{name:"Assigned to", value:3}];

    
   $scope.onChangeSelectOption=function(val){
    $scope.checkOneValue=val.value};
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.SalesFunnelDetails = data;            
                for(var i=0; i<$scope.SalesFunnelDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.SalesFunnelDetails[i].salesfunnel_name;
                        $scope.obj.value = $scope.SalesFunnelDetails[i].salesfunnel_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }          
               // console.log($scope.secondDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
              //  console.log("something went wrong.");
            }); 
        };
    
    $scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            $scope.EmployeesDetails = data;
            for(var i=0; i<$scope.EmployeesDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.EmployeesDetails[i].user_first_name +" " + $scope.EmployeesDetails[i].user_last_name;
                        $scope.obj.value = $scope.EmployeesDetails[i].user_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }  
           // console.log($scope.secondDropValues);
            angular.element(".loader").hide();
            $scope.employees = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    
   $scope.action=function(){
     //  console.log(item);
      // console.log($scope.myModel);
       if($scope.myModel=="1"){
         $scope.secondDropValues.length=0;
        // console.log("something happened in Leads Status.");
         $scope.secondDropValues=[{name:"Hot", value:1},{name:"Warm", value:2},{name:"Cold", value:3}];
       }
      
       if($scope.myModel=="2"){   
         $scope.secondDropValues.length=0;
         $scope.getSalesFunnelDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModel=="3"){
         $scope.secondDropValues.length=0;
         $scope.getEmployeesDetails();
        // console.log("something happened in assigned to.");
       }
       
       
   };
    
    
        $scope.updateLeadStatus = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/leadStatus",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Lead Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
            //$scope.lead_source_list= data;
           // $scope.getLeads();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateUserFunnel = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/SalesFunnel",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Sales Funnel Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/AssignedTo",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.actionSecond=function(){
       
        if($scope.myModel=="1"){
            $scope.updateLeadStatus();
        }
        
        if($scope.myModel=="2"){
            $scope.updateUserFunnel();
        }
        
        if($scope.myModel=="3"){
            $scope.updateAssignedTo();
        } 
    };
    
    $scope.ok = function() {
    $uibModalInstance.close();
         //$state.go('/UpdateProspects');
        $window.location.reload();
    };

});