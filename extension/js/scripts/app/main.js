window.app = angular.module('GmailApp', ['ui.router', 'ui.bootstrap'])

app.config(function ($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: 'js/scripts/app/home/home.html',
    })
    .state('about', {
      url: '/about',
      controller: 'aboutController',
      templateUrl: 'js/scripts/app/about/about.html'
    })
    .state('active', {
      url: '/active',
      controller: 'activeController',
      templateUrl: 'js/scripts/app/active/active.html'
    })
});

app.controller("homeController", function($scope, $state){
  $scope.goToAbout = function(){
    $state.go('about');
    console.log("Home controller");
  }
});

app.controller("aboutController", function($scope, $state){
  $scope.goToActiveState = function(){
    $state.go('active');
    console.log("active controller");
  }
});

app.controller('activeController', function($scope, $state){
  $scope.activate = function(){
    console.log("Activate works");
    chrome.runtime.sendMessage({message:"sendEmails"});
  }
});

app.directive('navbar', function(){
  return {
    restrict: 'E',
    templateUrl: 'js/scripts/app/common/directives/navbar/navbar.html'
  }
});
