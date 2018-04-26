var app = angular.module('CoffeeMateWebApp');
app.controller('updateCoffee', ['$route', '$scope', '$http','$routeParams', '$location', function($route, $scope, $http ,$routeParams, $location ) {
// create a message to display in our view
    $scope.message = 'Update a Card';
 
   
   //Getting the ID of the route params ie: localhost:3000/19283y9bdfhgf83 
    var id  = ($routeParams.id);
     $scope.badgeType = [
        {type : "Best Offer"},
        {type : "Best Banking" },
        {type : "Best Bonus"},
        {type : "Best Slots"},
        {type : "Best Casino"},
        {type : "Best Desktop"},
        {type : "PLayers Choice"},
        {type : "Newes Casino"},
        {type : "Best Mobile"}
        
    ];

    // console.log(id + "id is shown");
    //calling the findOne method with id from the route to display data in the field
  
  var card = findOne(id);

    function findOne(id) {
        $http.get('/cards/'+id)
            .success(function (data) {
                $scope.card = data;

            $scope.card.logo = data[0].logo;
                $scope.card.bonusTop = data[0].bonusTop;
                $scope.card.bonusMiddle = data[0].bonusMiddle;
                $scope.card.bonusLower = data[0].bonusLower;
                $scope.card.badgeType = data[0].badgeType;
                $scope.card.name = data[0].name;


                

                return $scope.card;

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }
 

   



    $scope.editCard = function(id){
           
                //$scope.casiono comes from last line in findOne *return $scope.casino each element is assigned to $scope.casino[0] and send to routes method *update
                $scope.card[0].position = $scope.card.position;
                $scope.card[0].logo = $scope.card.logo;
                $scope.card[0].bonusTop = $scope.card.bonusTop;
                $scope.card[0].bonusMiddle = $scope.card.bonusMiddle;
                $scope.card[0].bonusLower = $scope.card.bonusLower;
                $scope.card[0].badgeType = $scope.card.badgeType;
                $scope.card[0].cardType = $scope.card.cardType;
             

               


                console.log($scope.card[0])
        $http.put('/cards/'+$routeParams.id, $scope.card[0])
            .success(function(data){
                console.log(data);

                $location.path('/cards');

            })
            .error(function(data){
                console.log('Error' + data);
            });
    }


}

]);
