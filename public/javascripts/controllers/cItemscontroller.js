var app = angular.module('CoffeeMateWebApp');

app.controller('cItemsController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {
    // create a message to display in our view
    $scope.message = 'Listing all carusel items';

 


    findAllCItems(); // call to find all casinos method
    //findOne();
    $scope.edit = function(id) {
        $location.path('/edit/' + id);

    };
    //Read more section
    $scope.lions = false;
    $scope.onItemClicked = function(item) {
        item.isVisible = true;
    };

    //deep linking x2
    $scope.myFunction = function(link) {
            $window.location.href = link;
        }
        //Get all casinos 
    function findAllCItems() {
      
        $http.get('/cItems')
            .success(function(data) {
                $scope.cItems = data;
                console.log($scope.cItems[0]._id)

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }



    //Delete a casino
    $scope.deleteCItem = function(id) {
        if (confirm("Are you sure you want to delete ?")) {
            console.log('Deleting id : ' + id);
            $http.delete('/cItems/' + id)
                .success(function(data) {
                    $scope.cItems = data;
                    console.log(data);
                    findAllCItems();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };
    //Update a casino
    $scope.updatecItem = function(id) {
            $location.path('/updateCItem/' + id);

        }
  

}]);
