var bgApp = angular.module("BackgroundApp", [])

var sendingEmails = false;


bgApp.controller("BackgroundCtrl", function($scope, EmailFactory){
  chrome.runtime.onMessage.addListener(function(message){
    if(message.message==="createEmail")
    {
      EmailFactory.createNewEmail(message.newEmail)
      .then(function(createdEmail){
        console.log("created new email: ", createdEmail);
      });
    }else if(message.message === "sendEmails"){
        console.log("should send email.");
        sendingEmails = true;
        chrome.tabs.query({active:true}, function(arrayOfTabs){
          var tab = arrayOfTabs[0];
          chrome.tabs.sendMessage(tab.id, {message: "sendEmailsToBackend"});
        });
    }else if(message.message === "doNotSendEmails"){
      console.log("should not send email");
      sendingEmails = false;
      chrome.tabs.query({active:true}, function(arrayOfTabs){
        var tab = arrayOfTabs[0];
        chrome.tabs.sendMessage(tab.id, {message: "doNotSendEmailsToBackend"})
      });
    }else if(message.message === "emailContent"){
        console.log("Email content ", message.emailContent);
        emails.push(message.emailContent);
        console.log(emails);
    }else if(message.message === "getEmails"){
        console.log(emails);
        chrome.runtime.sendMessage({message:"updatedEmails", emails: emails})
    }else if(message.message === "extensionStatus"){
      chrome.runtime.sendMessage({message:"status", status: sendingEmails})
    }
  });
});

bgApp.factory("EmailFactory", function($http){
  factory = {};
  factory.getAll = function (){
    return $http.get("http://127.0.0.1:1337/api/emails").then(function(response){
      return response.data;
    })
  }

  factory.createNewEmail = function (newEmail){
    return $http.post("http://127.0.0.1:1337/api/emails", newEmail).then(function(response){
      return response.data;
    })
  }
  return factory;
})

var emails = [];
chrome.runtime.onMessage.addListener(function(message, sender){

});
