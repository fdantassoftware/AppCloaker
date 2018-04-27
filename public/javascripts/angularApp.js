var app = angular.module('CoffeeMateWebApp', ['ngRoute','ui.bootstrap','ngAnimate','mp.colorPicker','ngAnimate', 'textAngular']);


app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.ejs',
                controller  : 'mainController'
            })

            .when('/updateList/:id/', {
                templateUrl: 'pages/editlist.ejs',
                controller : 'editListController'
            })


            .when('/addToFalseList/:id/', {
                templateUrl: 'pages/addtofalselist.ejs',
                controller : 'addtofalselistController'
            })

            // Rule
            .when('/rules', {
                templateUrl : 'pages/rules.ejs',
                controller  : 'rulesController'
            })

                // country

            // isp
            .when('/addcountry', {
                templateUrl : 'pages/addcountry.ejs',
                controller  : 'addcountryController'
            })

            // isp
            .when('/addisp', {
                templateUrl : 'pages/addisp.ejs',
                controller  : 'addispController'
            })


            .when('/addapp', {
                templateUrl : 'pages/app.ejs',
                controller  : 'addappController'
            })

            .when('/showapps', {
            templateUrl : 'pages/showapps.ejs',
            controller  : 'showappsController'
            })

            .when('/updateapp/:id', {
                templateUrl: 'pages/updateApp.ejs',
                controller : 'updateAppController'
            })


            .when('/falselist', {
                templateUrl : 'pages/falselist.ejs',
                controller  : 'AddFalseListController'
            })

            .when('/showfalselists', {
                templateUrl : 'pages/showFalseLists.ejs',
                controller  : 'showFalseListsController'
            })


            //Card-----------------------------------------------------
             // route for the coffee page
            .when('/card', {
                templateUrl : 'pages/coffee.ejs',
                controller  : 'coffeeController'
            })


             // route for the coffees page
            .when('/cards', {
                templateUrl : 'pages/coffees.ejs',
                controller  : 'addToListsController'
            })
            .when('/updatecard/:id', {
                templateUrl: 'pages/updatecard.ejs',
                controller : 'updateCardController'
            })
            //List-----------------------------------------------------
               // route for the coffee page
            .when('/list', {
                templateUrl : 'pages/list.ejs',
                controller  : 'listController'
            })

              // route for the coffee page
            .when('/lists', {
                templateUrl : 'pages/lists.ejs',
                controller  : 'listsController'
            })

            .when('/addToList/:id/', {
                templateUrl: 'pages/addToList.ejs',
                controller : 'addToListsController'
            })

            ///Layout-----------------------------------------------------
            // route for setting up the site
            .when('/layouts', {
                templateUrl: 'pages/design.ejs',
                controller : 'siteController'
            })
             // route for updating up t5he site
            .when('/layouts/:id', {
                templateUrl: 'pages/updateDesign.ejs',
                controller : 'updateSiteController'
            })
              // route for showing site designs
            .when('/layouts', {
                templateUrl: 'pages/designs.ejs',
                controller : 'siteController'
            })
             /// Carousel items (cItems)-------------------------------
            // Route for create a cItem
            .when('/cItem', {
                templateUrl: 'pages/cItem.ejs',
                controller: 'cItemController'
            })
            // route for all cItems
            .when('/cItems', {
                templateUrl : 'pages/cItems.ejs',
                controller  : 'cItemsController'
            })
            //Route for updating the carousel item
            .when('/updateCItem/:id', {
                templateUrl: 'pages/updateCItems.ejs',
                controller : 'updateCItems'
            })


            //Rest -----------------------------------------------------
            //route for user login
            .when('/login', {
                templateUrl: '*/views/login.ejs'

            })

            //route for signup
            .when('/signup', {
                templateUrl: 'pages/signup.ejs'

            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.ejs',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.ejs',
                controller  : 'contactController'
            });
    });
