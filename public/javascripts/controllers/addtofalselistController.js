'use strict';

var app = angular.module('CoffeeMateWebApp');


app.controller('addtofalselistController', ['$scope', '$http', '$location', '$routeParams', '$window', function($scope, $http, $location, $routeParams, $window) {

    $scope.listActiveItems =[];

    $scope.formData = {};
    $scope.formData.id = $routeParams.id;




    var id  = ($routeParams.id);


    findAllCards();
    findOneList(id);

    var cardIdsArray = [];


    function findAllCards() {


        $http.get('/cards')
            .success(function(data) {
                $scope.cards = data;
                console.log(data);
                // console.log("One new Object(value?: any)" + $scope.cards[0]._id)
                for(var i =0;i<$scope.cards.length;i++)
                {

                    cardIdsArray.push($scope.cards[i]._id);

                }


            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }



    function findOneList(id) {
        $http.get('/falselists/'+id)
            .success(function (data) {
                $scope.list = data;
                // console.log(data[0]);
                if (data[0] !== undefined) {
                    $scope.list.name = data[0].name;
                    $scope.list.category = data[0].category;
                    $scope.list.icon = data[0].icon;
                    $scope.list.description = data[0].description;
                    $scope.list.cardIds = data[0].cardIds;
                    for(var i=1; i<$scope.list.cardIds.length;i++)
                    {
                        // console.log('Cards inside list ids are :' + $scope.list.cardIds[i]);
                        if($scope.list.cardIds[i] == "")
                        {
                            // console.log('The list currently does not hold any cards');
                        }
                        else {
                            console.log("--------------------------- " + $scope.list.cardIds[i]);
                            $scope.listActiveItems.push(i);
                            findOne($scope.list.cardIds[i], i);

                        }

                    }

                    // console.log('scope list ' + JSON.stringify($scope.list));
                    // console.log('Active list ' + JSON.stringify($scope.listActiveItems));
                    return $scope.list;

                }

                // console.log('card ids are ' + $scope.list.cardIds.length);
                // console.log('Items inside this list are ' + JSON.stringify(data[0].cardIds));


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }


    function findOne(id, position) {
        $http.get('/cards/'+id)
            .success(function (data) {
                // console.log("in Find One");
                // console.log("---------------------------- HERE " + JSON.stringify(data));
                $scope.card = data;
                $scope.card.logo = data[0].logo;
                $scope.card.bonusTop = data[0].bonusTop;
                $scope.card.bonusMiddle = data[0].bonusMiddle;
                $scope.card.bonusLower = data[0].bonusLower;
                $scope.card.badgeType = data[0].badgeType;
                $scope.card.name = data[0].name;
                // console.log("adding this casino to the list " +  );
                $scope.listActiveItems[position-1]=$scope.card;


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    $scope.move = function(array, index, increment) {
        var newArray = [];
        console.log(index + increment);

        if(index + increment ==0){
            newArray.push(array[index]);
        }

        for(var i = 0; i < array.length; i++){


            if(i != index){
                newArray.push(array[i]);
                console.log(' add position ' + (newArray.length - 1) );
            }
            if(newArray.length == index + increment){

                newArray.push(array[index]);
                console.log('index add position ' + (newArray.length - 1) );
            }


        }

        // console.log('array ' + JSON.stringify(array));
        // console.log('new array ' + JSON.stringify(newArray));
        /*
        console.log('the first element in the array before moving is ' + array[0].name);

        var target = array[from];
        var increment = to < from ? -1 : 1;

        for(var k = from; k != to; k += increment){
          array[k] = array[k + increment];
        }
        array[to] = target;
        console.log('the first element in the array after moving is  ' + array[0].name);
        */
        array = newArray;
        $scope.listActiveItems = array;
        return array;
    }


    $scope.deletFromList = function(id) {
        console.log("id is " + id );

        for (var i = 0; i < $scope.list.cardIds.length; i++){
            if(id == $scope.list.cardIds[i])
            {
                $scope.list[0].cardIds.splice(i,1);


                $http.put('/falselists/'+$routeParams.id, $scope.list[0])
                    .success(function(data){
                        // console.log(data);

                        $location.path('/showfalselists');


                    })
                    .error(function(data){
                        console.log('Error' + data);
                    });
            }
            else {
                console.log('Item not in the list');
            }

        }

    }


    $scope.deleteList = function(id) {
        if (confirm("Are you sure you want to delete ?")) {
            // console.log('Deleting id : ' + id);
            $http.delete('/falselist/' + id)
                .success(function(data) {
                    $scope.lists = data;
                    // console.log(data);
                    findAll();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }


    $scope.saveListOrder = function(){

        $scope.list[0].name = $scope.list.name;
        $scope.list[0].icon = $scope.list.icon;
        $scope.list[0].description = $scope.list.description;
        $scope.list[0].cardIds.length = 0;
        $scope.list[0].cardIds.push("");
        for(var i = 0; i <= $scope.listActiveItems.length-1;i++){

            $scope.list[0].cardIds.push($scope.listActiveItems[i][0]._id);
            // console.log( $scope.listActiveItems[i][0]._id);
            console.log("route params are " + $routeParams.id);


        }
        console.log("route params are " + $routeParams.id);


        $http.put('/falselists/'+$routeParams.id, $scope.list[0])
            .success(function(data){
                // console.log(data);

                $location.path('/showfalselists');



            })
            .error(function(data){
                console.log('Error' + data);
            });
    }


    $scope.deleteCard = function(id) {
        console.log("GO HERE " + $routeParams.id);
        if (confirm("Are you sure you want to delete ?")) {
            // console.log('Deleting id : ' + id[0]._id);




            $http.delete('/cards/' + id)
                .success(function(data) {
                    $scope.cards = data;
                    // console.log(data);
                    findAllCards();

                    $scope.formData.casinoId = id


                    $http.post('/updateFalseListId', $scope.formData)
                        .success(function(data) {

                            $scope.list = data[0];
                            $location.path('/showfalselists');

                        })
                        .error(function(data) {
                            // console.log('Error: ' + data);
                        });




                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }



    $scope.addToList = function(id) {
        // console.log($scope.card[0])

        $scope.list[0].name = $scope.list.name;
        $scope.list[0].icon = $scope.list.icon;
        $scope.list[0].description = $scope.list.description;
        $scope.list[0].cardIds.push(id);


        $http.put('/falselists/'+$routeParams.id, $scope.list[0])
            .success(function(data){
                // console.log(data);

                $location.path('/showfalselists');



            })
            .error(function(data){
                console.log('Error' + data);
            });
    }


}

]);
