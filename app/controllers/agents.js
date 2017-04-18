app.controller("addAgentCtrl", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Agent";
    $scope.addAgentBtn = true;

    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.addAgent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);

            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_type": formObj.type,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_createdby": $cookieStore.get('user_id'),
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "user_password": formObj.password,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "user_role_id": formObj.agentRole,
                    "user_code": formObj.agentCode
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/Agents");
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid!");
        }
    };
});
app.controller("agentsCtrl", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.searchAgents = ''; // set the default search/filter term
    $scope.selected=[];
    $scope.roleIdValues=[];
    $scope.roleIdDetails=[];
    
    $scope.getRoleIdDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/RoleGet",
                ContentType: 'application/json',
                data: {
                    "role_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.roleIdDetails = data;            
                for(var i=0; i<$scope.roleIdDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.roleIdDetails[i].role_name;
                        $scope.obj.value = $scope.roleIdDetails[i].role_id;
                        $scope.roleIdValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }          
//                console.log($scope.roleIdValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };

    $scope.exist=function(item){
        return $scope.selected.indexOf(item)>-1;
    }
    $scope.toggleSelection=function(item){
        var idx =$scope.selected.indexOf(item);
        if(idx > -1){
            $scope.selected.splice(idx, 1);
             console.log($scope.selected);
        }
        else{
            $scope.selected.push(item);
             console.log($scope.selected);
        }
    }
    $scope.checkAll = function(){
        if($scope.selectAll){
            angular.forEach($scope.agents,function(item){
                    idx=$scope.selected.indexOf(item.user_id);
                    if(idx>=0){
                        return true;
                    }
                    else{
                        $scope.selected.push(item.user_id);
                         console.log($scope.selected);
                    }
            })
        }
        else{
            $scope.selected = [];
             console.log($scope.selected);
        }
    };
    
    $scope.roleUpdate = function(userids) {
        var str2=""+$scope.selected;
        //console.log("the real slim:"+str2);
        var modalInstance = $uibModal.open({
            templateUrl: 'updateRoleId.html',
            controller: 'updateRoleIdAndAssignedTo',
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

    ($scope.getDesignationDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/Designations",
            ContentType: 'application/json',
            data: {
                "designation_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.designationList = [];
            for (var i = 0; i < data.length; i++) {
                $scope.designationList[data[i].designation_id] = data[i].designation;
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    ($scope.getAgents = function() {
        $scope.getRoleIdDetails();
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/AgentDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_type": 5,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            for(var i=0;i<data.length;i++)
                {     
                    for(var j=0;j<$scope.roleIdValues.length;j++){
                    if (data[i].user_role_id == $scope.roleIdValues[j].value)
                        {
                           data[i].user_role_name=$scope.roleIdValues[j].name;
                        }
                     if (data[i].user_role_id == "0")
                        {
                           data[i].user_role_name="Not Assigned";
                        }
                    }
                }
            console.log(data);
            angular.element(".loader").hide();
            $scope.agents = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.agentDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'agentDetail.html',
            controller: 'agentsDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.agents[selectedItem];
                }
            }
        });
    };
});
app.controller("agentsDetailCtrl", function($scope, $http, $cookieStore, $uibModalInstance, item) {
    $scope.agentDetail = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});
app.controller("editAgentCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Agent";
    $scope.editAgentBtn = true;

    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getAgentDetail = function() {
        $scope.agentId = $stateParams.agentID;

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/AgentUserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.agentId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);

            if (data.Agents_User_Id != 0) {
                $scope.addAgent = {
                    type: data.user_type + "",
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    firmName: data.Agents_firmname,
                    emailId: data.user_email_address,
                    address: data.Agents_add,
                    mobileNumber: data.user_mobile_no,
                    password: data.user_password,
                    pan: data.Agents_pan,
                    aadhar: data.Agents_aadhar,
                    alternateContactNumber: data.Agents_alt_contactno,
                    alternameEmailId: data.Agents_alt_email,
                    contactPerson: data.Agents_contactperson,
                    serviceTaxDetails: data.Agents_servicetaxdtls,
                    yearsInBusiness: data.Agents_noofyrsinbsns,
                    totalYearOfExp: data.Agents_totalyrsofexp,
                    totCtc: data.Agent_ctc,
                    bankName: data.Agents_banknm,
                    accountNumber: data.Agents_bankacno,
                    bankAddress: data.Agents_bankadd,
                    accountType: data.Agents_banktypeofacn,
                    ifscCode: data.Agents_bankifsccode,
                    agentRole: data.user_role_id + '',
                    agentCode: data.user_code
                }
            } else {
                $state.go("/Agents");
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.updateAgent = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUserAgent",
                ContentType: 'application/json',
                data: {
                    "Agents_comp_guid": $cookieStore.get('comp_guid'),
                    "Agents_User_Id": $scope.agentId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "user_role_id": formObj.agentRole,
                    "user_code": formObj.agentCode
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Agents");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            console.log($scope[formName].$error);
            alert("Not valid!");
        }
    };
});

app.controller("updateRoleIdAndAssignedToCtrl", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
    $scope.firstDropValues=[];
    $scope.repotingDetails =[];
    $scope.roleIdDetails =[];
    $scope.updateTypeValues=[{name:"Role", value:1},{name:"Reporting to", value:2}];
    

        $scope.onChangeSelectOption=function(val){
        $scope.checkOneValue=val.value};
    
        $scope.selectUpdate=function(){
//      console.log(item);
//      console.log($scope.myModelFirst);
      
       if($scope.myModelFirst=="1"){   
         $scope.firstDropValues.length=0;
         $scope.getRoleIdDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModelFirst=="2"){
         $scope.firstDropValues.length=0;
         $scope.getReportingToDetails();
        // console.log("something happened in assigned to.");
       }
       
       
   };
   

        $scope.getRoleIdDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/RoleGet",
                ContentType: 'application/json',
                data: {
                    "role_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.roleIdDetails = data;            
                for(var i=0; i<$scope.roleIdDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.roleIdDetails[i].role_name;
                        $scope.obj.value = $scope.roleIdDetails[i].role_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }               
                //console.log("myitem:"+item);
                //console.log($scope.firstDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
            
        };
        

        $scope.getReportingToDetails = function() {
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
                $scope.repotingDetails = data;            
                for(var i=0; i<$scope.repotingDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.repotingDetails[i].user_first_name +" " + $scope.repotingDetails[i].user_last_name;
                        $scope.obj.value = $scope.repotingDetails[i].user_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }          
                //console.log($scope.firstDropValues);               
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
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
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
//            console.log("start");
//            console.log(item);
//            console.log($scope.myModel);
//            console.log("finish");
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
    $scope.updateRoleFunction= function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/RoleId",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
            
            alert("Role Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.action=function(){
       
        if($scope.myModelFirst=="1"){
            console.log(item);
            console.log("kuch hua 1");
            $scope.updateRoleFunction();
        }
        
        if($scope.myModelFirst=="2"){
            console.log(item);
            console.log("kuch hua 2");
            $scope.updateAssignedTo();
        }
    };

    
    $scope.ok = function() {
    $uibModalInstance.close();
    $window.location.reload();
    };


});