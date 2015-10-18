app.directive("email", function(){
  return{
    restrict: "E",
    templateUrl: "js/common/directives/email/email.html",
    scope: {
      email: '='
    }
})
