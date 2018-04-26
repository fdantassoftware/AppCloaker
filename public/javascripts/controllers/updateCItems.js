var app = angular.module('CoffeeMateWebApp');

app.controller('updateCItems', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {
    // create a message to display in our view
    $scope.message = 'Carousel Items';
   var id  = ($routeParams.id);


  var cItem = findOneCItem(id);
  $scope.category = [
        {type : "Featured"},
        {type : "A-Z" },
        {type : "Live"},
        {type : "No Deposit"},
        {type : "New"}
        
    ];
  
    //deep linking
    $scope.linkModelFunc = function(url) {
        console.log('link model function');
        $window.open(url);
    }

    //scroll to element function
  

    //findOne();
    $scope.edit = function(id) {
        $location.path('/edit/' + id);

    };
  
 

    function findOneCItem(id) {
        $http.get('/cItems/'+id)
            .success(function (data) {
                $scope.cItem = data;

            $scope.cItem.link = data[0].link;
                $scope.cItem.category = data[0].category;
                $scope.cItem.image = data[0].image;
                $scope.cItem.offerTitle = data[0].offerTitle;
                $scope.cItem.offerDesc = data[0].offerDesc;

    
                

                return $scope.card;

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }
 

   



    $scope.editCItem = function(id){
           
                //$scope.casiono comes from last line in findOne *return $scope.casino each element is assigned to $scope.casino[0] and send to routes method *update
                $scope.cItem[0].link = $scope.cItem.link;
                $scope.cItem[0].category = $scope.cItem.category;
                $scope.cItem[0].image = $scope.cItem.image;
                $scope.cItem[0].offerTitle = $scope.cItem.offerTitle;
                $scope.cItem[0].offerDesc = $scope.cItem.offerDesc;
             

               


                console.log($scope.cItem[0])
        $http.put('/cItems/'+$routeParams.id, $scope.cItem[0])
            .success(function(data){
                console.log(data);

                $location.path('/cItems');

            })
            .error(function(data){
                console.log('Error' + data);
            });
    }


}



]);
