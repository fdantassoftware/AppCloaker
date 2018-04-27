var app = angular.module('CoffeeMateWebApp');


app.controller('editListController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {

  findAll();
  getOneList();
  $scope.imageName = '';
  $scope.formData = {};
    $scope.orderByField = 'bonus';

  $scope.message = 'List Page';
  //Reset our formData fields
  $scope.formData.name = '';
  $scope.formData.category = '';
  $scope.formData.icon = '';
  $scope.formData.description = '';
  $scope.formData.appId = '';
  $scope.casinoCarouselImageName = '';
  $scope.formData.carouselImageUrl = '';
  $scope.formData.nameOfCarouselItem = '';
  // $scope.formData.cardType = '';
  $scope.category = [
      {type : "IOS"},
      {type : "Android" }

  ];

  $scope.apps = [];


  $scope.pickClicked = function(){


      const client = filestack.init('Ae7gKlLgRUCpWhP7lsoCQz');

      client.pick({
          accept: ['image/*']

      }).then(function(result) {
          $scope.formData.icon = result.filesUploaded[0].url.toString();
          $scope.imageName =  result.filesUploaded[0].filename.toString();
          $scope.$apply()
      })

  }

  $scope.addList = function(){
    $scope.formData.id = $routeParams.id;
     $http.post('/editlist', $scope.formData)
          .success(function(data) {
              console.log("We got it");

          })
          .error(function(data) {


            });
          };

  function findAll() {

      $http.get('/showapps')
          .success(function(data) {
              $scope.apps = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  }

  function updateUI(data) {

    $scope.formData.name = data.name;
    $scope.formData.description = data.description;
  }

  $scope.pickCarouselImage = function(){

      console.log('clicked');
      const client = filestack.init('Ae7gKlLgRUCpWhP7lsoCQz');

      client.pick({
          accept: ['image/*']

      }).then(function(result) {
          console.log(result.filesUploaded[0].url.toString());
          $scope.formData.carouselImageUrl = result.filesUploaded[0].url.toString();
          $scope.casinoCarouselImageName =  result.filesUploaded[0].filename.toString();
          $scope.$apply()
      })

  }

  function getOneList() {
    $scope.formData.id = $routeParams.id;
    $http.post('/getOneList', $scope.formData)
         .success(function(data) {
           updateUI(data[0]);

         })
         .error(function(data) {

           });
       };
  }



]);
