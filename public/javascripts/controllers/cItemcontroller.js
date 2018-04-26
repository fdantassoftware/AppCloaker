var app = angular.module('CoffeeMateWebApp');


app.controller('cItemController', ['$scope', '$location', '$http', function($scope, $location, $http) {
    
    $scope.formData = {};

    $scope.message = 'Carousel Items Page';

    

   //Reset our formData fields
    $scope.formData.link = '';
    $scope.formData.image = '';
    $scope.formData.offerTitle = '';
    $scope.formData.offerDesc='';

   $scope.category = [
        {type : "Featured"},
        {type : "A-Z" },
        {type : "Live"},
        {type : "No Deposit"},
        {type : "New"}
        
    ];

    $scope.addCItem = function(){
        console.log('Inside controleler the data is: ' + JSON.stringify($scope.formData) );
       $http.post('/cItem', $scope.formData)
            .success(function(data) {
                $scope.cItems = data;
                $location.path('/cItems');
                
            })
            .error(function(data) {
                console.log('Error: ' + data);
              });
            };





}

 ]);
