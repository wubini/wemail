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
  var collectEmails = false;
  console.log("Cool main");
  gmail = new Gmail();
  document.addEventListener('collectEmails', function(){
    collectEmails = true;
    console.log(collectEmails);
  });
  document.addEventListener('doNotCollectEmails', function(){
    collectEmails = false;
  });

  document.addEventListener('highlightedDraft', function(e){
    var highlightedHTML = e.detail;
    console.log("in custom with styled draft", highlightedHTML);
    document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = highlightedHTML;
  })

  console.log('Hello,', gmail.get.user_email())
  // gmail.observe.on('save_draft', function(){
  //   var contents = arguments[2].body;
  //   var draft = new CustomEvent('savedDraft', {detail: contents});
  //   document.dispatchEvent(draft);
  //   console.log("draft was saved", arguments);
  // });


  gmail.observe.on('compose', function(){
   names = [];
   var compose_ref = gmail.dom.composes()[0];
   var mostRecentContentHTML = "";
   var showingHighlights = false;
   var end = ["San Serif", "Serif", "Fixed Width", "Wide", "Narrow", "Comic Sans MS", "Garamond", "Georgia", "Tahoma", "Trebuchet MS", "Verdana"]
   gmail.tools.add_compose_button(compose_ref, 'Highlight Names', function() {
       //var current = gmail.dom.composes()[0];
       var contentHTML = document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML;

       showingHighlights = !showingHighlights;
       if(showingHighlights) {
         var addHighlights = new CustomEvent('addHighlights', {detail: contentHTML});
         document.dispatchEvent(addHighlights);
       }
       else {
         contentHTML = contentHTML.replace(/\<span[^\>]*\>/g,"").replace(/\<\/span[^\>]*\>/g,"");
       }
       console.log("updated contentHTML", contentHTML);

       document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = contentHTML;
     }, 'mdl-button mdl-js-button mdl-button--accent');
 });


  gmail.observe.on('send_message', function(){
    console.log("We hit save");

    if(collectEmails){
      console.log("1. collecting emails");
      var email = arguments[2];
      console.log("2. trying to show modal window...");
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
    }
    else {
      console.log("saving emails is turned off");
    }
  });
}

refresh(main);
