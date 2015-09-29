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

    if(message.message==='sendEmails'){
      document.dispatchEvent(new Event('sendEmails'));
    }

    else if(message.message === "doNotSendEmails"){
      document.dispatchEvent(new Event('doNotSendEmails'));
    }

    else if(message.message === "highlightedDraft"){
      var highlightedDraft = new CustomEvent('highlightedDraft', {detail: message.highlightedDraft});
      document.dispatchEvent(highlightedDraft);
    }

    else if(message.message === "currentStatus"){
      var currentStatus = new CustomEvent("currentStatus", {detail: message.currentStatus})
      document.dispatchEvent(currentStatus);
    }
});

document.addEventListener('getCurrentStatus', function(){
  chrome.runtime.sendMessage({message: 'getCurrentStatus'});
});

document.addEventListener('triggerSave', function(e){
  var email = e.detail;
  chrome.runtime.sendMessage({message: 'createEmail', newEmail: email});
});

document.addEventListener('addHighlights', function(e){
  var contentHTML = e.detail;
  chrome.runtime.sendMessage({message: 'addHighlights', unhighlighted: contentHTML});
});
