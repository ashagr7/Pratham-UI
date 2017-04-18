app.controller("salesFunnelCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $rootScope) {

    ($scope.getSalesFunnelDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
            ContentType: 'application/json',
            data: {
                "salesfunnel_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $rootScope.salesFunnelDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.addSalesFunnel = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalesFunnel.html',
            controller: 'addSalesFunnelController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return 0;
                }
            }
        });
    };

    $scope.editSalesFunnel = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalesFunnel.html',
            controller: 'editSalesFunnelController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $rootScope.salesFunnelDetails[selectedItem];
                }
            }
        });
    };
});

app.controller("addSalesFunnelCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Add Sales Funnel";
    $scope.addSalesFunnelBtn = true;

    $scope.addSalesFunnel = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelInsert",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_name": formObj.salesFunnelName,
                    "salesfunnel_compguid": $cookieStore.get('comp_guid'),
                    "salesfunnel_sortorder": formObj.salesFunnelSortOrder
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalesFunnelDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getSalesFunnelDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
            ContentType: 'application/json',
            data: {
                "salesfunnel_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $rootScope.salesFunnelDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("editSalesFunnelCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Edit Sales Funnel";
    $scope.editSalesFunnelBtn = true;

    ($scope.getSalesFunnelDetail = function() {
        $scope.addSalesFunnel = {
            salesFunnelName: item.salesfunnel_name,
            salesFunnelSortOrder: item.salesfunnel_sortorder
        };
    })();

    $scope.editSalesFunnel = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelUpdate",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_id": item.salesfunnel_id,
                    "salesfunnel_name": formObj.salesFunnelName,
                    "salesfunnel_compguid": $cookieStore.get('comp_guid'),
                    "salesfunnel_sortorder": formObj.salesFunnelSortOrder
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalesFunnelDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getSalesFunnelDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
            ContentType: 'application/json',
            data: {
                "salesfunnel_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $rootScope.salesFunnelDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});