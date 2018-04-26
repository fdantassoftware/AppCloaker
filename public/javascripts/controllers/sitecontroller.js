var app = angular.module('CoffeeMateWebApp');


app.controller('siteController', ['$scope', '$location', '$http', function($scope, $location, $http) {
    
// findAllLayout();

    var dateOptions =  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $scope.date = (new Date()).toLocaleDateString("en-US",dateOptions);




    $scope.formData = {};

    $scope.message = 'Layout Page';





}

 ]);
