app.config(function ($stateProvider) {
    $stateProvider
    .state('seeEmails', {
        url: '/seeEmails',
        templateUrl: 'js/seeEmails/seeEmails.html',
        resolve: {
          allEmails: function(EmailFactory){
            return EmailFactory.getAll();
          }
        },
        controller: "SeeEmailsCtrl"
    })
})

app.controller("SeeEmailsCtrl", ($scope, allEmails) => {
  $scope.allEmails = allEmails;
});
