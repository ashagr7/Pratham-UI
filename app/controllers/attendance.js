app.controller("attendanceCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal) {
    $scope.title = "Attendance";
    $scope.attendanceCodes = ['', 'P', 'A', 'L', 'H'];
    var d = new Date();
    var cMonth = d.getMonth();
    cMonth = cMonth.toString();
    var cYear = d.getFullYear();
    cYear = cYear.toString();

    $scope.attendance = {
        year: cYear,
        month: cMonth
    };

    $scope.months = [{
        name: 'January',
        value: 0,
        days: 31
    }, {
        name: 'February',
        value: 1,
        days: 28
    }, {
        name: 'March',
        value: 2,
        days: 31
    }, {
        name: 'April',
        value: 3,
        days: 30
    }, {
        name: 'May',
        value: 4,
        days: 31
    }, {
        name: 'Jun',
        value: 5,
        days: 30
    }, {
        name: 'July',
        value: 6,
        days: 31
    }, {
        name: 'August',
        value: 7,
        days: 31
    }, {
        name: 'September',
        value: 8,
        days: 30
    }, {
        name: 'October',
        value: 9,
        days: 31
    }, {
        name: 'November',
        value: 10,
        days: 30
    }, {
        name: 'December',
        value: 11,
        days: 31
    }];
    $scope.getDaysArray = function(obj) {
        var y = parseInt(obj.year);
        var m = parseInt(obj.month);
        var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var firstDay = new Date(y, m, 1);
        var firstDayNumber = firstDay.getDay();
        var noOfDays = $scope.months[m].days;
        $scope.monthDays = [];
        for (i = 1; i <= noOfDays; i++) {
            if (firstDayNumber > 6) {
                firstDayNumber = 0;
            }
            var dateNumber = i;
            if (dateNumber < 10) {
                dateNumber = "0" + dateNumber;
            }
            $scope.monthDays.push({
                date: dateNumber,
                day: days[firstDayNumber]
            })
            firstDayNumber++;
        }

        var attnMonth = y + '-' + (m + 1);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/Attendance/Get",
            ContentType: 'application/json',
            data: {
                "attendance_compguid": $cookieStore.get('comp_guid'),
                "attendance_date": attnMonth
            }
        }).success(function(data) {
            /*console.log(JSON.stringify(data));*/
            $scope.attendanceData = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
        $scope.showCalender = true;
    }

    $scope.markAttendanceModal = function(obj) {
        if (obj.attendance_status == 4) {
            return;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'markAttendance.html',
            controller: 'markAttendance',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return obj;
                }
            }
        });
    }
});
app.controller("markAttendanceCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $uibModalInstance, $location, item) {
    $scope.empAttn = item;
    $scope.saveAttn = function(formName, formObj) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var attnArr = [];
            formObj.attendance_employeeId = item.attendance_employeeId;
            formObj.attendance_compguid = $cookieStore.get('comp_guid');
            formObj.attendance_date = item.attendance_date;
            attnArr.push(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/Attendance/Save",
                ContentType: 'application/json',
                data: attnArr
            }).success(function(data) {
                /*console.log(data);*/
                $uibModalInstance.close();
                $scope.getDaysArray($scope.attendance);
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.ok = function() {
        $uibModalInstance.close();
    }

});