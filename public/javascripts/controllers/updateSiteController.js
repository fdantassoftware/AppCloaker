var app = angular.module('CoffeeMateWebApp');
app.controller('updateSiteController', ['$route', '$scope', '$http', '$routeParams', '$location', function($route, $scope, $http, $routeParams, $location) {
        // create a message to display in our view
        $scope.message = 'Update a SITE';


        //Getting the ID of the route params ie: localhost:3000/19283y9bdfhgf83 
        var id = ($routeParams.id);

        // console.log(id + "id is shown");
        //calling the findOne method with id from the route to display data in the field

        var layout = findOneLayout(id);


        function findOneLayout(id) {
          
            $http.get('/layouts/' + id)
                .success(function(data) {
                    
                    $scope.layout = data;
                    $scope.layout.imageUrl = data[0].imageUrl;
                    $scope.layout.bonusText = data[0].bonusText;
                    $scope.layout.bonusTextLower = data[0].bonusTextLower;
                    $scope.layout.outLink = data[0].outLink;
                


  


                    return $scope.layout;

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

        }






        $scope.editDesign = function(id) {
            //$scope.casiono comes from last line in findOne *return $scope.casino each element is assigned to $scope.casino[0] and send to routes method *update
            $scope.layout[0].imageUrl = $scope.layout.imageUrl;
            $scope.layout[0].bonusText = $scope.layout.bonusText;
            $scope.layout[0].bonusTextLower = $scope.layout.bonusTextLower;
            $scope.layout[0].outLink = $scope.layout.outLink;
         

           
        console.log($scope.layout[0])
        $http.put('/layouts/' + $routeParams.id, $scope.layout[0])
            .success(function(data) {
                console.log(data);

                $location.path('/');

            })
            .error(function(data) {
                console.log('Error' + data);
            });
    }


}

]);
