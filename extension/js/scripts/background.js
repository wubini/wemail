console.log("im the background page!");


chrome.runtime.onMessage.addListener(function(message, sender){
  if(message.message === "sendEmails"){
    console.log("should send email.");

    chrome.tabs.query({active:true}, function(arrayOfTabs){
      var tab = arrayOfTabs[0];
      chrome.tabs.sendMessage(tab.id, {message: "sendEmailToBackend"});
    });
  }
  if(message.message === "emailContent"){
    console.log("content in background",message.emailContent)
  }
});


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//   var custom = document.createElement('script');
//   custom.className+= " customScript"
//   custom.src = "js/scripts/custom.js";
//   console.log("custom logging from background", custom);
//   chrome.tabs.sendMessage(tab.id,{command: 'backgroundGood', file: {node:custom}});
// });
