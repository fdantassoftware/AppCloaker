var app = angular.module('CoffeeMateWebApp');


app.controller('addispController', ['$scope', '$location', '$http', function($scope, $location, $http) {

    findAllApps()
    $scope.formData = {};
    //Reset our formData fields
    $scope.formData.ispstext = '';
    $scope.formData.appId = '';

    $scope.resize = function($event){
        $event.target.style.height = $event.target.scrollHeight + "px";
    };


    function findAll(id) {

        $http.post('/showisps', $scope.formData)
            .success(function(data) {
                if (data[0]) {
                    $scope.formData.ispstext = data[0].kws.join("\n")
                }


            })
            .error(function(data) {

            });
    }


    $scope.addIsps = function(){
        $http.post('/addisps', $scope.formData)
            .success(function(data) {
                $location.path('/showapps');

            })
            .error(function(data) {

            });
    };

    $scope.optionChanged = function() {
        findAll();

    }

    function findAllApps() {

        $http.get('/showapps')
            .success(function(data) {
                $scope.apps = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }


}

]);
