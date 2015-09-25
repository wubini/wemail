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
  var button = document.createElement('button');
  //var sendButton = $('.T-I J-J5-Ji aoO T-I-atl L3');
  //console.dir(sendButton);
  if(message.message==='sendEmailToBackend'){
        forwardingMail = true;
        var sendEvent = new Event('send');
        document.dispatchEvent(sendEvent);
  }
})
      // chrome.runtime.onMessage.addListener(function(message, sender,sendResponse){
      //   console.log("Message on Gmail ", message);
      //   document.getElementsByTagName('body')[0].appendChild(message.file.node);
      // });
      // gmail.observe.on("send_message",function(obj){
      //   chrome.runtime.sendMessage({message: "emailSent", payload: obj}, function(response){
      //     console.log("response?", response);
      //   });
      // });
