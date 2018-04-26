var app = angular.module('CoffeeMateWebApp');


app.controller('addcountryController', ['$scope', '$location', '$http', function($scope, $location, $http) {

    findAllApps()
    $scope.formData = {};
    //Reset our formData fields
    $scope.formData.countryText = '';
    $scope.formData.appId = '';

    $scope.resize = function($event){
        $event.target.style.height = $event.target.scrollHeight + "px";
    };


    function findAll() {

        $http.post('/showcountries', $scope.formData)
            .success(function(data) {
                if (data[0]) {
                    $scope.formData.countryText = data[0].name.join("\n")
                }


            })
            .error(function(data) {

            });
    }


    $scope.addCountries = function(){
        $http.post('/addcountries', $scope.formData)
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
