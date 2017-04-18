app.factory('httpSvc', function ($http){
    var Models = {
        'leads': {}
    };
    
    Models.leads.getAll = function(obj){
        var request = {
                method: 'POST',
                url: 'http://120.138.8.150/pratham/User/UserDtls/ByUserType',
                ContentType: 'application/json',
                data: obj
            };
        return $http(request);
    }
	
	Models.leads.leadToProspect = function(obj){
        var request = {
                method: 'POST',
                url: 'http://120.138.8.150/pratham/User/UserUpdt/leadToProspect',
                ContentType: 'application/json',
                data: obj
            };
        return $http(request);
    }
	
    return Models;
});



app.service('myService', function($http) {
    this.sampleFun = function(compId) {
        return compId;
    };

    this.getProjectList = function(compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": compId
            }
        }).success(function(data) {
            projectList = data;
            return projectList;
        }).error(function() {});
        return promise;
    };

    this.getPhaseList = function(compId,projectName) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": compId
            }
        }).success(function(data) {
            phaseList = data;
            return phaseList;
        }).error(function() {});
        return promise;
    };
    
    this.getBlockList = function(phase, compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": compId
            }
        }).success(function(data) {
            blockList = data;
            return blockList;
        }).error(function() {});
        return promise;
    };
    
    this.getUnitsByBlock = function(compId, blockId) {
        console.log("blockId: "+blockId);
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                  "UnitDtls_Block_Id":blockId,
                  "UnitDtls_comp_guid":compId
                }
        }).success(function(data) {
            units = data;
            return units;
        }).error(function() {});
        return promise;
    };
});