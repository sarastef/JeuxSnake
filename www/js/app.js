// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

 .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('noMenu', {
              "url" : "/noMenu",
              abstract : true,
              templateUrl : "templates/menu.html"
            })
        
            .state("noMenu.home", {
              "url" : "/home",
              views : {
                "noMenuView" : {
                  templateUrl : "templates/start.html"
                }
              }
            })

        
            .state("noMenu.game1", {
              "url" : "/game1",
              views : {
                "noMenuView" : {
                  templateUrl : "templates/game.html"
                }
              }
            }) 
            .state("noMenu.game", {
              "url" : "/game",
              views : {
                "noMenuView" : {
                  templateUrl : "templates/snake.html",
                  controller: 'gameCtrl',
                }
              }

            })  
          
       
        $urlRouterProvider.otherwise('/noMenu/home');
    })
 .controller('GameCtrl', function($scope,canvas){
    $scope.init=canvas.init();

  });

    

    
