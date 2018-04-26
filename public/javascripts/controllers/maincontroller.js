var app = angular.module('CoffeeMateWebApp');


app.controller('mainController', ['$scope', function($scope) {
    
    $scope.active = 0;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.date = new Date();
    
    $scope.slides = [
        {image: 'http://www.pixolo.it/wp-content/uploads/2012/07/wallpaper-1867190.jpg',
            id: 0},
        {image: 'http://www.pixolo.it/wp-content/uploads/2012/07/wallpaper-1667348.jpg',
            id: 1}
    ];
    // create a message to display in our view
      $scope.message = 'Top 5 Casinos';
    function NavBarCtrl($scope) {
    $scope.isCollapsed = true;
  }
     }

  ]);



