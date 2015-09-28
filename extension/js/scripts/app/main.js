window.app = angular.module('GmailApp', ['ui.router', 'ui.bootstrap'])

app.config(function ($stateProvider) {
    $stateProvider
    .state('activate', {
      url: '/activate',
      controller: 'activateController',
      templateUrl: 'js/scripts/app/activate/activate.html'
    })
    .state('login', {
      url: '/login',
      controller: 'LoginController',
      templateUrl: 'js/scripts/app/login/login.html'
    })
});

app.controller('mainController', function($scope, $state){

  chrome.runtime.sendMessage({message:"extensionStatus"});
  chrome.runtime.onMessage.addListener(function(message){
    if(message.message === 'status'){
      console.log(message);
      $scope.activated = message.status
      if($scope.activated){
        $scope.src = "https://i.imgur.com/Zom1i7L.png";
      }else{
        $scope.src = "https://i.imgur.com/uc6ktOc.png";
      }
    }
  });
  $scope.activate = function(){
    $scope.activated = true;
    chrome.runtime.sendMessage({message:"sendEmails"});
    $("#hImage").attr("src", "https://i.imgur.com/Zom1i7L.png");
    $scope.src = "https://i.imgur.com/Zom1i7L.png"
  }
  $scope.deactivate = function(){
    console.log("deactivate");
    $scope.activated = false;
    chrome.runtime.sendMessage({message:"doNotSendEmails"});
    $("#hImage").attr("src","https://i.imgur.com/uc6ktOc.png")
    $scope.src = "https://i.imgur.com/uc6ktOc.png";
  }
});
