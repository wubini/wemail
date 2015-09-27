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
  // gmail.observe.on('compose', function(){
  //   names = [];
  //   console.log("We composing");
  //   var compose_ref = gmail.dom.composes()[0];
  //   var end = ["San Serif", "Serif", "Fixed Width", "Wide", "Narrow", "Comic Sans MS", "Garamond", "Georgia", "Tahoma", "Trebuchet MS", "Verdana"]
  //   gmail.tools.add_compose_button(compose_ref, 'Anonymize', function() {
  //       var current = gmail.dom.composes()[0];
  //       var email = current.$el[0].innerText.split("\n")
  //       var content = current.$el[0].innerText.split("\n")[2].split(" ");
  //       console.log(email);
  //       names.push(content[content.length-1]);
  //     }, 'mdl-button mdl-js-button mdl-button--accent');
  // });
  gmail.observe.on('send_message', function(){
    console.log("We hit save");
    if(collectEmails){

      var email = arguments[2];
      // var current = gmail.dom.composes()[0];
      // var email = current.$el[0].innerText.split("\n")
      // var text = [];
      // email.forEach(function(content,index){
      //   if(content === "SendANONYMIZE"){
      //     text.pop()
      //     return;
      //   }else{
      //     if(index !== 0 && content !== "" && content !== " "){
      //       console.log(content);
      //       text.push(content);
      //     }
      //   }
      // });
      // var index = text.indexOf(text[text.length-1])
      // var content = text.slice(0,index-2);
      gmail.tools.add_modal_window('Share your email', 'Why not share your email with the world?',
      function onClickOK() {
             var emailToSave = {
               emailAddress: email.from,
               subject: email.subject,
               content: email.body.replace(/\<[^\>]*\>/g, "\n")
             }
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
