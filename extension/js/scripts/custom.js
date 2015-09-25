var gmail;

function refresh(f) {
  if( typeof Gmail === "undefined") {
    console.log("Gmail undefined");
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var main = function(){

  gmail = new Gmail();

  var collectEmails = false;

  document.addEventListener('collectEmails', function(){
    collectEmails = true;
  });

  console.log('Hello,', gmail.get.user_email())
  gmail.observe.on('save_draft', function(){
    console.log("draft was saved", arguments);
  });

  gmail.observe.on('send_message', function(){
    if(collectEmails){
      var email = arguments[2]
      console.log("email");
      gmail.tools.add_modal_window('Share your email', 'Why not share your email with the world?',
      function onClickOK() {
             var emailToSave = {
               emailAddress: email.from,
               subject: email.subject,
               content: email.body
             }
             console.log("save this email", emailToSave);
             var triggerSave = new CustomEvent('triggerSave',{detail: emailToSave});
             document.dispatchEvent(triggerSave);
             $('#gmailJsModalBackground').remove();
             $('#gmailJsModalWindow').remove();
         });
    }else{
      console.log("Do something");
    }
  });

  // gmail.observe.on("compose", function(){
  //
  //   chrome.runtime.sendMessage({message: 'composing'});
  //   // gmail.tools.add_modal_window('Clean inbox', 'Do you want to continue?',
  //   // function() {
  //   //   console.log("cleaned inbox");
  //   // });
  //
  // })

}


refresh(main);
