var bgApp = angular.module("BackgroundApp", [])

var sendingEmails = false;


bgApp.controller("BackgroundCtrl", function($scope, EmailFactory, $http){
  $http.get('http://127.0.0.1:1337/api/names')
  .then(function(response) {
    $scope.allNames = response.data;
    console.log($scope.allNames.A);
  })
  //.then(null, console.error.bind(console));

  chrome.runtime.onMessage.addListener(function(message){
    console.log("bg got message", message)
    if(message.message==="createEmail")
    {
      EmailFactory.createNewEmail(message.newEmail)
      .then(function(createdEmail){
        console.log("created new email: ", createdEmail);
      });
    }
    else if(message.message === "savedDraft"){
      var draft = message.savedDraft;

      var regex = /[A-Z]\w*/g, result, capitalizedWords= [];
      while ( (result = regex.exec(draft)) ) {
          capitalizedWords.push({word: result[0], index: result.index});
      }

      capitalizedWords = capitalizedWords.map(function(capitalizedWord){
        var nameArray = $scope.allNames[capitalizedWord.word[0]];
        if(nameArray.indexOf(capitalizedWord.word)>0){
          return {
            oldWord: capitalizedWord.word,
            word: "<span style='background-color:pink;'>"+capitalizedWord.word+"</span>",
            index: capitalizedWord.index
          };
        }
        else {
          capitalizedWord.oldWord = capitalizedWord.word;
          return capitalizedWord;
        }
      });

      console.log("styled text", capitalizedWords);

      for (var i = capitalizedWords.length -1; i>=0; i--)
      {
        var capitalizedWord = capitalizedWords[i];
        console.log("inserting styled capitalizedWord", capitalizedWord);
        var firstPart = draft.slice(0, capitalizedWord.index);
        var secondPart = draft.slice(capitalizedWord.index + capitalizedWord.oldWord.length);
        draft = firstPart + capitalizedWord.word + secondPart;
      }
      console.log("background styledDraft", draft);
      chrome.tabs.query({active:true}, function(arrayOfTabs){
        var tab = arrayOfTabs[0];
        chrome.tabs.sendMessage(tab.id, {message: "styledDraft", styledDraft: draft})
      });
    }
    else if(message.message === "sendEmails"){
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
