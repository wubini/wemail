var jq = document.createElement('script');
jq.src = chrome.extension.getURL('js/dependencies/jquery-1.11.3.min.js');
document.getElementsByTagName('body')[0].appendChild(jq);

var g = document.createElement('script');
g.src = chrome.extension.getURL('js/dependencies/gmail.js');
(document.head || document.documentElement).appendChild(g);

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/scripts/custom.js');
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("message in content.js", message);

    if(message.message==='sendEmailsToBackend'){
          console.log("sendEmailToBackend");
          var sendEvent = new Event('collectEmails');
          document.dispatchEvent(sendEvent);
    }


    else if(message.message === "doNotSendEmailsToBackend"){
      var sendEvent = new Event('doNotCollectEmails');
      document.dispatchEvent(sendEvent);
    }


    else if(message.message === "highlightedDraft"){
      console.log("in content with highlighted draft", message.highlightedDraft);
      var highlightedDraft = new CustomEvent('highlightedDraft', {detail: message.highlightedDraft});
      document.dispatchEvent(highlightedDraft);
    }

    else if(message.message === "currentStatus"){
      var currentStatus = new CustomEvent("currentStatus", {detail: message.currentStatus})
      document.dispatchEvent(currentStatus);
    }
})

document.addEventListener('triggerSave', function(e){
  console.log("content got triggerSave with", e.detail);
  var email = e.detail;
  console.log(email);
  console.log("We here are ", email);
  chrome.runtime.sendMessage({message: 'createEmail', newEmail: email});
});

// document.addEventListener('savedDraft', function(e){
//   var draft = e.detail;
//   console.log("content got draft", draft);
//   chrome.runtime.sendMessage({message: 'savedDraft', savedDraft: draft});
// });

document.addEventListener('addHighlights', function(e){
  var contentHTML = e.detail;
  console.log("content got unhighlighted version", contentHTML);
  chrome.runtime.sendMessage({message: 'addHighlights', unhighlighted: contentHTML});
})

document.addEventListener('getCurrentStatus', function(){
  chrome.runtime.sendMessage({message: 'getCurrentStatus'});
});
