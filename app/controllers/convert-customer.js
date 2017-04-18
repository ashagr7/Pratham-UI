app.controller("convertCustomerCtrl", function($scope, $http, $compile, $cookieStore, $stateParams, $filter, $state) {
    ($scope.convertCustomer = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $scope.action = $stateParams.action;

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            var dateArray = [];
            dateArray.push($filter('date')(data.user_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_spouse_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_wedanv, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_gpa_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child1_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child2_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child3_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child4_dob, 'MMM dd, yyyy'));

            for (var i = 0; i < dateArray.length; i++) {
                if (dateArray[i] == "Jan 01, 0001") {
                    dateArray[i] = "";
                }
            }

            var state = data.user_state;
            var city = data.user_city;

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }

            if (data.user_id != 0) {
                if ($scope.action == 'addCustomer') {
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dateArray[0],
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0
                    }
                } else if ($scope.action == 'editCustomer') {
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dateArray[0],
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0,
                        relationType: ((data.Cust_relationtype != 0) ? data.Cust_relationtype + '' : ''),
                        relationName: data.Cust_relationname,
                        residentType: ((data.Cust_status_type != 0 ? data.Cust_status_type + '' : '')),
                        address2: data.Cust_perm_add,
                        pan: data.Cust_pan,
                        aadhar: data.Cust_aadhar,
                        weddingAnniversary: dateArray[2],
                        alternateContact: data.Cust_alt_contactno,
                        qualification: data.Cust_qualification,
                        profession: data.Cust_Profession,
                        company: data.Cust_company,
                        designation: data.Cust_desig,
                        officeAddress: data.Cust_off_add,
                        officeEmailId: data.Cust_off_email,
                        spouseName: data.Cust_spouse_nm,
                        spouseDob: dateArray[1],
                        spousePan: data.Cust_spouse_pan,
                        spouseAadhar: data.Cust_spouse_aadhar,
                        childrenNo: data.Cust_noof_childrn + "",
                        child1Name: data.Cust_child1_nm,
                        child1Dob: dateArray[4],
                        child2Name: data.Cust_child2_nm,
                        child2Dob: dateArray[5],
                        child3Name: data.Cust_child3_nm,
                        child3Dob: dateArray[6],
                        child4Name: data.Cust_child4_nm,
                        child4Dob: dateArray[7],
                        bankloan: data.Cust_bankloan,
                        bankName: data.Cust_bankloan,
                        accountNumber: data.Cust_bankaccno,
                        ifscCode: data.Cust_bankifsccode,
                        bankAdress: data.Cust_bankadd,
                        bankEmailId: data.Cust_bankemailid,
                        gpaHolder: data.Cust_gpaholdr,
                        gpaRelation: ((data.Cust_gpa_relationtype != 0 ? data.Cust_gpa_relationtype + '' : '')),
                        gpaName: data.Cust_gpa_nm,
                        gpaDob: dateArray[3],
                        gpaAddress: data.Cust_gpa_add,
                        permanentAddress: data.Cust_gpa_permadd,
                        relationWithcustomer: data.Cust_gpa_reltnwithcusty,
                        gpaPan: data.Cust_gpa_pan,
                        gpaAadhar: data.Cust_gpa_aadhar
                    }
                    editAppendFields();
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Customers");
            }
        }).error(function() {});
    })();

    $scope.updateCustomer = function(formObj, formName) {
        alert("update customer");
    }

    $scope.addCustomer = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            angular.element(".loader").show();

            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var gpaRelation = 0;

            if (formObj.relationType != undefined && formObj.relationType != '') {
                relationType = formObj.relationType;
            }

            if (formObj.gpaRelation != undefined && formObj.gpaRelation != '') {
                gpaRelation = formObj.gpaRelation;
            }

            if (formObj.residentType != undefined && formObj.residentType != '') {
                statusType = formObj.residentType;
            }

            if (formObj.childrenNo != undefined && formObj.childrenNo != '') {
                noOfChildren = formObj.childrenNo;
            }

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Cust/SaveCust",
                ContentType: 'application/json',
                data: {
                    "user_id": $scope.leadId,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "Cust_User_Id_Assgnto": 1,
                    "Cust_relationtype": relationType,
                    "Cust_relationname": formObj.relationName,
                    "Cust_status_type": statusType,
                    "Cust_perm_add": formObj.address2,
                    "Cust_status_other": "Cust_status_other",
                    "Cust_pan": formObj.pan,
                    "Cust_aadhar": formObj.aadhar,
                    "Cust_alt_contactno": formObj.alternateContact,
                    "Cust_qualification": formObj.qualification,
                    "Cust_Profession": formObj.profession,
                    "Cust_company": formObj.company,
                    "Cust_desig": formObj.designation,
                    "Cust_off_add": formObj.officeAddress,
                    "Cust_off_email": formObj.officeEmailId,
                    "Cust_spouse_nm": formObj.spouseName,
                    "Cust_spouse_dob": formObj.spouseDob,
                    "Cust_spouse_pan": formObj.spousePan,
                    "Cust_spouse_aadhar": formObj.spouseAadhar,
                    "Cust_noof_childrn": noOfChildren,
                    "Cust_child1_nm": formObj.child1Name,
                    "Cust_child1_dob": formObj.child1Dob,
                    "Cust_child2_nm": formObj.child2Name,
                    "Cust_child2_dob": formObj.child2Dob,
                    "Cust_child3_nm": formObj.child3Name,
                    "Cust_child3_dob": formObj.child3Dob,
                    "Cust_child4_nm": formObj.child4Name,
                    "Cust_child4_dob": formObj.child4Dob,
                    "Cust_wedanv": formObj.weddingAnniversary,
                    "Cust_bankloan": formObj.bankloan,
                    "Cust_banknm": formObj.bankName,
                    "Cust_bankaccno": formObj.accountNumber,
                    "Cust_bankadd": formObj.bankAdress,
                    "Cust_bankifsccode": formObj.ifscCode,
                    "Cust_bankemailid": formObj.bankEmailId,
                    "Cust_gpaholdr": formObj.gpaHolder,
                    "Cust_gpa_nm": formObj.gpaName,
                    "Cust_gpa_relationtype": gpaRelation,
                    "Cust_gpa_dob": formObj.gpaDob,
                    "Cust_gpa_add": formObj.gpaAddress,
                    "Cust_gpa_permadd": formObj.permanentAddress,
                    "Cust_gpa_reltnwithcusty": formObj.relationWithcustomer,
                    "Cust_gpa_pan": formObj.gpaPan,
                    "Cust_gpa_aadhar": formObj.gpaAadhar
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Customers");
                angular.element(".loader").hide();
            }).error(function() {
                alert("Error in save customer");
                angular.element(".loader").hide();
            });
        }
    };
    $scope.appendFields = function() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div class="field"><label ng-show="customer.child' + i + 'Name" class="show-hide">Child ' + i + ' Name</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div class="field"><label ng-show="customer.child' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B.</label><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };

    function editAppendFields() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div class="field"><label ng-show="customer.child' + i + 'Name" class="show-hide">Child ' + i + ' Name</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div class="field"><label ng-show="customer.child' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B.</label><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
});