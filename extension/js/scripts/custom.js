var gmail;

var names = [];

function refresh(f) {
  if( typeof Gmail === "undefined") {
    console.log("Gmail undefined");
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var currentContent = null;

var main = function(){
  console.log("Cool main");
  gmail = new Gmail();
  document.addEventListener('collectEmails', function(){
    collectEmails = true;
    console.log(collectEmails);
  });
  document.addEventListener('doNotCollectEmails', function(){
    collectEmails = false;
  });
  console.log('Hello,', gmail.get.user_email())
  gmail.observe.on('save_draft', function(){
    console.log("draft was saved", arguments);
  });

  gmail.observe.on('send_message', function(){
    console.log("We hit save");
    if(collectEmails){
      var email = arguments[2];
      gmail.tools.add_modal_window('Share your email', 'Why not share your email with the world?',
      function onClickOK() {
             var emailToSave = {
               emailAddress: email.from,
               subject: email.subject,
               content: email.body.replace(/\<[^\>]*\>/g, "\n")
             };
             console.log('content', emailToSave.content);
             emailToSave.content = emailToSave.content.replace(/[\n]+/g, "\n");
             emailToSave.content = emailToSave.content.replace(/\u00a0/g, " ");
             console.log("save this email", emailToSave);
             console.log("email content", emailToSave.content);
             var triggerSave = new CustomEvent('triggerSave',{detail: emailToSave});
             document.dispatchEvent(triggerSave);
             $('#gmailJsModalBackground').remove();
             $('#gmailJsModalWindow').remove();
           });
    }else{
      console.log("saving emails is turned off");
    }
  });
}

refresh(main);
