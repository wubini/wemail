var gmail;

function refresh(f) {
  if( typeof Gmail === "undefined") {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var main = function(){
  var collectEmails = false;
  var showingHighlights = false;
  gmail = new Gmail();

  var getCurrentStatus = new Event("getCurrentStatus");
  document.dispatchEvent(getCurrentStatus);

  document.addEventListener('currentStatus', function(e){
    collectEmails = e.detail;
  });

  document.addEventListener('collectEmails', function(){
    collectEmails = true;
    $("#toggleDiv").css("display","inline");
  });

  document.addEventListener('doNotCollectEmails', function(){
    collectEmails = false;
    $("#toggleDiv").css("display","none");
  });

  document.addEventListener('highlightedDraft', function(e){
    var highlightedHTML = e.detail;
    document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = highlightedHTML;
  })


  gmail.observe.on('compose', function(){

   var compose_ref = gmail.dom.composes()[0];

   gmail.tools.add_compose_button(compose_ref, '<div id="toggleDiv"><img id = "toggle" src="https://pbs.twimg.com/media/CQCcuqdUsAENToa.png"></img></div>', function() {
       var contentHTML = document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML;
       showingHighlights = !showingHighlights;
       if(showingHighlights) {
         $("#toggle").removeAttr('src');
         $("#toggle").attr("src", "https://pbs.twimg.com/media/CQCbh3bUEAAZajd.png");
         $('#toggle').css('background-color','black');
         var addHighlights = new CustomEvent('addHighlights', {detail: contentHTML});
         document.dispatchEvent(addHighlights);
       }
       else {
         $("#toggle").removeAttr('src');
         $("#toggle").attr("src", "https://pbs.twimg.com/media/CQCcuqdUsAENToa.png");
         $('#toggle').css('background-color','skyblue');
         contentHTML = contentHTML.replace(/\<span[^\>]*\>/g,"")
            .replace(/\<\/span[^\>]*\>/g,"");
         document.getElementsByClassName("Am Al editable LW-avf")[0].innerHTML = contentHTML;
       }

     }, 'mdl-button mdl-js-button mdl-button--accent');
     if(collectEmails){
       $('#toggleDiv').css('display', 'inline');
     }
     else{
       $('#toggleDiv').css('display', 'none');
     }
     $("#toggle").css('width', '60px')
     $('#toggle').css('height','50px');
     $("#toggle").css('vertical-align','middle');
     $("#toggle").css('background-color','skyblue');
     $("#toggle").css('border-radius', '5px');
 });


  gmail.observe.on('send_message', function(){

    if(collectEmails){
      var email = arguments[2];

      gmail.tools.add_modal_window('Share your email', 'Why not share your email with the world?',
      function onClickOK() {
         var emailToSave = {
           emailAddress: email.from,
           subject: email.subject,
           content: email.body
         };
         emailToSave.content = emailToSave.content.replace(/\<[^\>]*\>/g, "\n")
            .replace(/[\n]+/g, "\n")
            .replace(/\u00a0/g, " ");

         var modifyEmail = new CustomEvent("anonymize", {email:emailToSave.content});
         document.dispatchEvent(modifyEmail);

         var triggerSave = new CustomEvent('triggerSave',{detail: emailToSave});
         document.dispatchEvent(triggerSave);
         $('#gmailJsModalBackground').remove();
         $('#gmailJsModalWindow').remove();
      });
    }
  });
}

refresh(main);
