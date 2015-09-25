var jq = document.createElement('script');
jq.src = chrome.extension.getURL('js/dependencies/jquery-1.11.3.min.js');
document.getElementsByTagName('body')[0].appendChild(jq);

var g = document.createElement('script');
g.src = chrome.extension.getURL('js/dependencies/gmail.js');
(document.head || document.documentElement).appendChild(g);

// var ang = document.createElement('script');
// ang.src = chrome.extension.getURL("js/dependencies/angular.min.js")
// (document.head || document.documentElement).appendChild(ang);

// var ui = document.createElement('script');
// ui.src = chrome.extension.getURL("js/dependencies/angular-ui-router.min.js")
// (document.head || document.documentElement).appendChild(ang);

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/scripts/custom.js');
(document.head || document.documentElement).appendChild(s);

var forwardingMail = false;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.message==='sendEmailToBackend'){
        forwardingMail = true;
        var sendEvent = new Event('send');
        document.dispatchEvent(sendEvent);
  }
})

document.addEventListener('triggerSave', function(e){
  console.log("content got triggerSave with", e.detail);
  var email = e.detail;
  chrome.runtime.sendMessage({message: 'emailContent',emailContent: email});
});
      // chrome.runtime.onMessage.addListener(function(message, sender,sendResponse){
      //   console.log("Message on Gmail ", message);
      //   document.getElementsByTagName('body')[0].appendChild(message.file.node);
      // });
      // gmail.observe.on("send_message",function(obj){
      //   chrome.runtime.sendMessage({message: "emailSent", payload: obj}, function(response){
      //     console.log("response?", response);
      //   });
      // });
