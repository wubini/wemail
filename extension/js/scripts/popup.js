// window.app = angular.module("GmailApp",[]);
//
// app.controller("")






document.addEventListener("DOMContentLoaded", function(){
  var activateButton = document.getElementsByTagName("button")[0];
  activateButton.addEventListener('click', function(e){
    console.log("Activated sending emails to database");
    chrome.runtime.sendMessage({message:"sendEmails"});
  });

});
