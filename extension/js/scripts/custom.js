var gmail;

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
    $("#icon").attr("src", "https://i.imgur.com/Zom1i7L.png");
    console.log(collectEmails);
  });
  document.addEventListener('doNotCollectEmails', function(){
    collectEmails = false;
    $("#icon").attr("src","https://i.imgur.com/uc6ktOc.png");
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
   var compose_ref = gmail.dom.composes()[0];
   var showingHighlights = false;
   var src = ""
   if(collectEmails){
     src = "http://i.imgur.com/Zom1i7L.png";
   }else{
     src = "http://i.imgur.com/uc6ktOc.png";
   }
   gmail.tools.add_compose_button(compose_ref, '<div><img id = "icon" style = "width: 60px;height:50px;vertical-align: middle" src = "http://i.imgur.com/uc6ktOc.png";></img></div>', function() {
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
     }, 'mdl-button mdl-js-button mdl-button--accent normal-wemail-button');
 });


  gmail.observe.on('send_message', function(){
    console.log("We hit send");

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
    }
    else {
      console.log("saving emails is turned off");
    }
  });
}

refresh(main);
