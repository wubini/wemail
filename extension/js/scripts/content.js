var jq = document.createElement('script');
jq.src = chrome.extension.getURL('js/dependencies/jquery-1.11.3.min.js');
document.getElementsByTagName('body')[0].appendChild(jq);

var g = document.createElement('script');
g.src = chrome.extension.getURL('js/dependencies/gmail.js');
(document.head || document.documentElement).appendChild(g);

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/scripts/custom.js');
(document.head || document.documentElement).appendChild(s);

var forwardingMail = false;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  var button = document.createElement('button');
  if(message.message==='sendEmailToBackend'){
        forwardingMail = true;
        var sendEvent = new Event('send');
        document.dispatchEvent(sendEvent);
  }
})
