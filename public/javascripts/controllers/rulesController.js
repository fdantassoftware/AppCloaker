var app = angular.module('CoffeeMateWebApp');


app.controller('rulesController', ['$scope', '$location', '$http', function($scope, $location, $http) {


    findAllApps();

    $scope.apps = [];

    $scope.formData = {};
    $scope.formData.countryCheck = '';
    $scope.formData.timeCheck = '';
    $scope.formData.ispCheck = '';

    $scope.formData.appId = '';


    $scope.saveConfig = function() {

        if  ($scope.formData.appId !== '') {

            console.log("LOG DATA IS " + JSON.stringify( $scope.formData));

            $http.post('/addrule', $scope.formData)
                .success(function(data) {
                    $location.path('/showapps');

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });



        } else {
            console.log("Please select an app Id");
            // Show Error
        }

        // Get values of Checks,
       // Send on post

    }


    $scope.optionChanged = function(req, res) {

        findAllRules();



    }


    function findAllRules() {

        $http.post('/showrules', $scope.formData)
            .success(function(data) {


                data.forEach(function(ele) {
                    $scope.formData.countryCheck = ele.country;
                    $scope.formData.timeCheck = ele.time;
                    $scope.formData.ispCheck = ele.isp;

                })
            })

            .error(function(data) {
                console.log('Error: ' + data);
            });

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
