window.app = angular.module("GmailApp",[]);

app.controller("")






document.addEventListener("DOMContentLoaded", function(){
  var checkPageButton = document.getElementById("checkPage");
  checkPageButton.addEventListener('click', function(e){
    console.log("We ran"ry);
    chrome.runtime.sendMessage({message:"sendEmails"});
  });
  // chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  //   console.log("Woot ", message);
  // });
});
