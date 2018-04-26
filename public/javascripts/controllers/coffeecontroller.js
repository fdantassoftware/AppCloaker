var app = angular.module('CoffeeMateWebApp');


app.controller('coffeeController', ['$scope', '$location', '$http', function($scope, $location, $http) {

    findAll();
    $scope.casinoImageName = '';
    $scope.casinoCarouselImageName = '';
    $scope.formData = {};
    $scope.orderByField = 'bonus';
    $scope.message = 'Cards Page';
    //Reset our formData fields
    $scope.formData.logo = '';
    $scope.formData.bonusTop = '';
    $scope.formData.bonusMiddle = '';
    $scope.formData.bonusLower = '';
    $scope.formData.badgeType = '';
    $scope.formData.name='';
    $scope.formData.rank = 0;
    $scope.formData.customerRating ='';
    $scope.formData.reputationRating ='';
    $scope.formData.coverageRating ='';
    $scope.formData.easeRating ='';
    $scope.formData.reviewContent ='';
    $scope.formData.carouselImageUrl = '';
    $scope.formData.path = '';
    $scope.formData.appId = '';
    $scope.sum = 0.0;
    // $scope.formData.cardType = '';
    $scope.htmlContent = '';
  
    $scope.badgeType = [
        {type : "Best Offer"},
        {type : "Best Banking" },
        {type : "Best Bonus"},
        {type : "Best Slots"},
        {type : "Best Casino"},
        {type : "Best Desktop"},
        {type : "Players Choice"},
        {type : "Newest Casino"},
        {type : "Best Mobile"}
        
    ];

    $scope.paths = [
        {type : "True"},
        {type : "False" }

    ];

    $scope.apps = [];



    $scope.pickClicked = function(){

        console.log('clicked');
        const client = filestack.init('Ae7gKlLgRUCpWhP7lsoCQz');

        client.pick({
            accept: ['image/*']

        }).then(function(result) {
            console.log(result.filesUploaded[0].url.toString());
            $scope.formData.logo = result.filesUploaded[0].url.toString();
            $scope.casinoImageName =  result.filesUploaded[0].filename.toString();
            $scope.$apply()
        })

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

    $scope.calculateTotalRating = function(item){
        if (item !== "") {
            var numberFromString = parseFloat(item);
            if ($scope.sum < 20) {

                $scope.sum =  $scope.sum + numberFromString;
                console.log($scope.sum);
            }
            $scope.formData.rank = $scope.sum / 4;
        }


    }

    $scope.updateSum = function(data) {
        let numberFromString = parseFloat(data);
        $scope.sum =  $scope.sum - numberFromString
        console.log($scope.sum);
        $scope.formData.rank = $scope.sum / 4;
    }


    function findAll() {

        $http.get('/showapps')
            .success(function(data) {
                $scope.apps = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }


    $scope.addCard = function(){
       $http.post('/cards', $scope.formData)
            .success(function(data) {
                $scope.cards = data;
                $location.path('/cards');
                
            })
            .error(function(data) {
                console.log('Error: ' + data);
              });
            };


}

 ]);
