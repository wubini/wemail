var bgApp = angular.module("BackgroundApp", [])

var sendingEmails = false;

bgApp.controller("BackgroundCtrl", function($scope, EmailFactory, ContentFactory, $http){
  $http.get('https://shielded-forest-2803.herokuapp.com/api/names')
  .then(function(response) {
    $scope.allNames = response.data;
  })

  chrome.runtime.onMessage.addListener(function(message){

    if(message.message === "sendEmails"){
      sendingEmails = true;
      sendMessageFromTab({message: "sendEmails"});
    }

    else if(message.message === "doNotSendEmails"){
      sendingEmails = false;
      sendMessageFromTab({message: "doNotSendEmails"});
    }

    else if(message.message==="createEmail") {
      var beforeContent = message.newEmail.content;
      var afterContent = ContentFactory.transformPeopleNames(beforeContent, $scope.allNames, ContentFactory.anonymizeName);

      var emailToSave = {
        content: afterContent,
        subject: message.newEmail.subject
      }

      EmailFactory.createNewEmail(emailToSave);
    }

    else if(message.message === "extensionStatus"){
      chrome.runtime.sendMessage({message:"status", status: sendingEmails})
    }

    else if(message.message === "getCurrentStatus"){
      sendMessageFromTab({message: "currentStatus", currentStatus: sendingEmails})
    }

    else if(message.message==="addHighlights")
    {
      var beforeContent = message.unhighlighted;
      var afterContent = ContentFactory.transformPeopleNames(beforeContent, $scope.allNames, ContentFactory.highlightName);
      sendMessageFromTab({message: "highlightedDraft", highlightedDraft: afterContent});
    }

    function sendMessageFromTab(messageObj){
      chrome.tabs.query({active:true}, function(arrayOfTabs){
        var tab = arrayOfTabs[0];
        chrome.tabs.sendMessage(tab.id, messageObj);
      });
    }

  });
});

bgApp.factory("EmailFactory", function($http){
  return {
    getAll: function (){
      return $http.get("https://shielded-forest-2803.herokuapp.com/api/emails").then(function(response){
        return response.data;
      });
    },
    createNewEmail: function (newEmail){
      return $http.post("https://shielded-forest-2803.herokuapp.com/api/emails", newEmail).then(function(response){
        return response.data;
      });
    }
  }
});

bgApp.factory("ContentFactory", function(){

  return {
    transformPeopleNames: function(beforeContent, allNames, transform){
      var draft = beforeContent;
      var regex = /[A-Z]\w*/g, result, capitalizedWords= [];
      while ( (result = regex.exec(draft)) ) {
          capitalizedWords.push({word: result[0], index: result.index});
      }
      capitalizedWords = capitalizedWords.map(function(capitalizedWord){
        var nameArray = allNames[capitalizedWord.word[0]];
        capitalizedWord.oldWord = capitalizedWord.word;
        if(nameArray.indexOf(capitalizedWord.word)>-1){
          capitalizedWord.word = transform(capitalizedWord.word);
        }
        return capitalizedWord;
      });

      for (var i = capitalizedWords.length -1; i>=0; i--)
      {
        var capitalizedWord = capitalizedWords[i];
        var firstPart = draft.slice(0, capitalizedWord.index);
        var secondPart = draft.slice(capitalizedWord.index + capitalizedWord.oldWord.length);
        draft = firstPart + capitalizedWord.word + secondPart;
      }

      return draft;
    },
    highlightName: function(name) {
      return "<span style='background-color:limegreen;'>" + name + "</span>";
    },
    anonymizeName: function(name) {
      return name[0];
    }
  }
});
