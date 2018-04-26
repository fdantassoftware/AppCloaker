var app = angular.module('CoffeeMateWebApp');

app.controller('updateCardController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {

    findCard();
    findAll();
    $scope.casinoImageName = '';
    $scope.casinoCarouselImageName = '';
    $scope.formData = {};
    $scope.formData.id = $routeParams.id;
    $scope.orderByField = 'bonus';
    $scope.message = 'Cards Page';
    //Reset our formData fields
    $scope.formData.logo = '';
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
    $scope.formData.bonus = '';
    $scope.sum = 0.0;
    // $scope.formData.cardType = '';
    $scope.htmlContent = '';

    var casinoToUpdate;

    $scope.paths = [
        {type : "True"},
        {type : "False" }

    ];

    $scope.apps = [];


    console.log("------------------------- " + $scope.formData.id);


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
        $http.post('/updatecard', {'form':$scope.formData, 'casino':casinoToUpdate})
            .success(function(data) {
               console.log("We saved it!");

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    function findCard() {
        $http.post('/getcard', {'id':$routeParams.id})
            .success(function(data) {
                casinoToUpdate = data;
                updateUI(data);

            })
            .error(function(data) {


            });
    }


    function updateUI(data) {
        $scope.formData.name = data.name;
        $scope.formData.rank = data.rank;
        $scope.formData.reviewContent = data.reviewContent;
        $scope.formData.bonus = data.bonus;
        data.ratings.forEach(function(ele) {
            console.log("My element is " + JSON.stringify(ele));
            if (ele.name === 'Customer Service') {
                $scope.formData.customerRating = ele.rate;
            }
            if (ele.name === 'Reputation') {
                $scope.formData.reputationRating = ele.rate;
            }
            if (ele.name === 'Coverage') {
                $scope.formData.coverageRating = ele.rate;
            }

            if (ele.name === 'Ease of use') {
                $scope.formData.easeRating = ele.rate;
            }


        });

    }

}]);
