var app = angular.module('CoffeeMateWebApp');

app.controller('listsController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {
    // create a message to display in our view
    $scope.message = 'Top 5 Casinos';


 
    findAll(); // call to find all casinos method
 
    //findOne();
    $scope.edit = function(id) {
        $location.path('/edit/' + id);

    };


        //Get all casinos 
    function findAll() {
      
        $http.get('/lists')
            .success(function(data) {
                $scope.lists = data;
                console.log($scope.lists)

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    



    //Delete a casino
    $scope.deleteList = function(id) {
        if (confirm("Are you sure you want to delete ?")) {
            console.log('Deleting id : ' + id);
            $http.delete('/lists/' + id)
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
    //Update a casino
    $scope.updateList = function(_id) {
            $location.path('/updateList/' + _id);

        }
 $scope.addToList = function(id) {
            $location.path('/addToList/' + id);

        }


}]);
