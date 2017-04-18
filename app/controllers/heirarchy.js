app.controller("heirarchyCtrl", function($scope, $http, $cookieStore, $state) {

    ($scope.heirarchyDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/DeptHeirarchy",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.dept_heirarchy = data[0];
            var datasource = $scope.dept_heirarchy;

            $('#chart-container').orgchart({
                'data': datasource,
                'depth': 999,
                'nodeContent': 'dept_head_name',
                'nodeId': 'dept_id'
            });

        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
});