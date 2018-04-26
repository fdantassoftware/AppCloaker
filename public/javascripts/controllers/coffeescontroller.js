var app = angular.module('CoffeeMateWebApp');

app.controller('coffeesController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {
    // create a message to display in our view
    $scope.message = 'Top 5 Casinos';

    //deep linking
    $scope.linkModelFunc = function(url) {
        console.log('link model function');
        $window.open(url);
    }

    //scroll to element function
    $scope.scrollTo = function(id) {

            // Pass the 'id' as the parameter here, the page will scroll 
            // to the correct place and the URL will remain intact.
            $anchorScroll(id);
        }
        //Rating set up
    $scope.rate = 5;
    $scope.max = 5;
    $scope.isReadonly = true;

    //hover over rating to set it
    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };


    findAll(); // call to find all casinos method
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
    function findAll() {
      
        $http.get('/cards')
            .success(function(data) {
                $scope.cards = data;
                console.log($scope.cards)

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }



    //Delete a casino
    $scope.deleteCard = function(id) {
        if (confirm("Are you sure you want to delete ?")) {
            console.log('Deleting id : ' + id);
            $http.delete('/cards/' + id)
                .success(function(data) {
                    $scope.cards = data;
                    console.log(data);
                    findAll();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };
    //Update a casino
    $scope.updateCard = function(id) {

            $location.path('/updateCard/' + id);

        }
        //Rating states setup
    $scope.ratingStates = [
        { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
        { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
        { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
        { stateOn: 'glyphicon-heart' },
        { stateOff: 'glyphicon-off' }
    ];

}]);
