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

  document.addEventListener('styledDraft', function(styledDraft){
    console.log("in custom with styled draft", styledDraft.detail);
    document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = styledDraft.detail;
  })

  console.log('Hello,', gmail.get.user_email())
  gmail.observe.on('save_draft', function(){
    var contents = arguments[2].body;
    var draft = new CustomEvent('savedDraft', {detail: contents});
    document.dispatchEvent(draft);
    console.log("draft was saved", arguments);
  });


  gmail.observe.on('compose', function(){
   names = [];
   var compose_ref = gmail.dom.composes()[0];
   var end = ["San Serif", "Serif", "Fixed Width", "Wide", "Narrow", "Comic Sans MS", "Garamond", "Georgia", "Tahoma", "Trebuchet MS", "Verdana"]
   gmail.tools.add_compose_button(compose_ref, 'Anonymize', function() {
       //var current = gmail.dom.composes()[0];

       var contentHTML = document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML;
       console.log("contentHTML", contentHTML);
       //var email = current.$el[0].innerText.split("\n")
       var text = [];

       contentHTML = contentHTML.replace(/\<span[^\>]*\>/g,"").replace(/\<\/span[^\>]*\>/g,"");

      console.log("unstyled contentHTML", contentHTML);
       document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = contentHTML;
     }, 'mdl-button mdl-js-button mdl-button--accent');
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
             var modifyEmail = new CustomEvent("anonymize", {email:emailToSave.content});
             document.dispatchEvent(modifyEmail);
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
