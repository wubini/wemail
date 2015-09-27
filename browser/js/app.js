var app = angular.module('FrontPageApp', ['ui.router', 'ui.bootstrap'])

app.run(function ($rootScope){
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
