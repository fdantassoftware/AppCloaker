var app = angular.module('CoffeeMateWebApp');


app.controller('showappsController', ['$scope', '$location', '$http', function($scope, $location, $http) {

    findAll();


    function findAll() {

        $http.get('/showapps')
            .success(function(data) {
                console.log("Exe");
                $scope.apps = data;
                console.log($scope.apps)

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }



    //Delete an app



    $scope.deleteApp = function(id) {

        if (confirm("Are you sure you want to delete ?")) {
            console.log('Deleting id : ' + id);
            $http.delete('/app/' + id)
                .success(function(data) {
                    $scope.apps = data;
                    console.log(data);
                    findAll();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }

    }

    //Update an app

    $scope.updateApp = function(id) {

        $location.path('/updateapp/' + id);
    }

}

]);
