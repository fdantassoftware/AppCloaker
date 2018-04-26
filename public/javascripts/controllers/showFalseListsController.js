var app = angular.module('CoffeeMateWebApp');


app.controller('showFalseListsController', ['$scope', '$location', '$http', function($scope, $location, $http) {



    findAll();


    function findAll() {

        console.log("We are trying to get all false lists");
        $http.get('/falselists')
            .success(function(data) {
                console.log("Exe");
                $scope.lists = data;
                console.log($scope.lists)

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }




    $scope.deleteList = function(id) {
        if (confirm("Are you sure you want to delete ?")) {
            console.log('Deleting id : ' + id);
            $http.delete('/falselist/' + id)
                .success(function(data) {
                    $scope.lists = data;
                    console.log(data);
                    findAll();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }

    $scope.addToList = function(id) {
        $location.path('/addToFalseList/' + id);

    }

}

]);
