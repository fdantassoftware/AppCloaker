
var app = angular.module('CoffeeMateWebApp');

app.controller('updateAppController', ['$route', '$scope', '$http','$routeParams', '$location', function($route, $scope, $http ,$routeParams, $location ) {


    findApp($routeParams.id);


    $scope.appId = '';

    $scope.formData = {};

    $scope.formData.name = '';
    $scope.formData.id = $routeParams.id;

    function findApp(id) {

        $http.get('/app/'+id)
            .success(function (data) {

                $scope.appId = data[0].name;


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });


    }



    $scope.updateApp = function() {

        console.log('HERE I AM');

        $http.post('/updateapp', $scope.formData)
            .success(function(data) {
                $location.path('/showapps');

            })
            .error(function(data) {
                console.log('Error: ' + data);

            });

    }






}

]);
