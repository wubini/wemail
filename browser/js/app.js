var app = angular.module('FrontPageApp', ['ui.router'])

app.run(function ($rootScope){
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
