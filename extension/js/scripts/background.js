var bgApp = angular.module("BackgroundApp", [])

bgApp.controller("BackgroundCtrl", function($scope, EmailFactory){
  chrome.runtime.onMessage.addListener(function(message){
    if(message.message==="createEmail")
    {
      EmailFactory.createNewEmail(message.newEmail)
      .then(function(createdEmail){
        console.log("created new email:", createdEmail);
      });
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
  if(message.message === "sendEmails"){
    console.log("should send email.");
    chrome.tabs.query({active:true}, function(arrayOfTabs){
      var tab = arrayOfTabs[0];
      chrome.tabs.sendMessage(tab.id, {message: "sendEmailToBackend"});
    });
  }else if(message.message === "emailContent"){
    console.log("Email content ", message.emailContent);
    emails.push(message.emailContent);
    console.log(emails);
  }else if(message.message === "getEmails"){
    console.log(emails);
    chrome.runtime.sendMessage({message:"updatedEmails", emails: emails})
  }
});

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//   var custom = document.createElement('script');
//   custom.className+= " customScript"
//   custom.src = "js/scripts/custom.js";
//   chrome.tabs.sendMessage(tab.id,{command: 'backgroundGood', file: {node:custom}});
// });
