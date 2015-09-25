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
    chrome.runtime.sendMessage({message:"updatedEmails", emails: emails})
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  var custom = document.createElement('script');
  custom.className+= " customScript"
  custom.src = "js/scripts/custom.js";
  chrome.tabs.sendMessage(tab.id,{command: 'backgroundGood', file: {node:custom}});
});
