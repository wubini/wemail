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
    .state('emailsView', {
      url: "/emails",
      controller: 'emailsViewController',
      templateUrl: 'js/scripts/app/emailsView/emails.html'
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

app.controller('emailsViewController', function($scope, $state, EmailFactory){
  $scope.emails = [];
  chrome.runtime.sendMessage({message:"getEmails"})
  chrome.runtime.onMessage.addListener(function(message,sender){
    if(message.message === "updatedEmails"){
      console.log("Word emailss");
      console.log(message.emails);
      $scope.emails = message.emails
    }
  });
  $scope.activate = function(){
    console.log("Activate works");
    chrome.runtime.sendMessage({message:"sendEmails"});
  }
  $scope.sendEmailsToDataBase = function(){
    var emailPromises = []
    $scope.emails.forEach(function(email){
      emailPromises.push(EmailFactory.createNewEmail(email));
    })
    console.log(emailPromises);
  }
});

app.factory("EmailFactory", function($http){
  factory = {};
  factory.getAll = function (){
    return $http.get("/api/emails").then(function(response){
      return response.data;
    })
  }

  factory.createNewEmail = function (newEmail){
    return $http.post("/api/emails", newEmail).then(function(response){
      return response.data;
    })
  }
  return factory;
})


app.directive('navbar', function(){
  return {
    restrict: 'E',
    templateUrl: 'js/scripts/app/common/directives/navbar/navbar.html'
  }
});
