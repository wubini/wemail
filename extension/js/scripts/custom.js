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

  var sendEmails = false;

  document.addEventListener('send', function(){
    sendEmails = true;
  });

  console.log('Hello,', gmail.get.user_email())
  gmail.observe.on('save_draft', function(){
    console.log("draft was saved", arguments);
  });

  gmail.observe.on('send_message', function(){
    var content = arguments[2].body
    gmail.tools.add_modal_window('Share your email', 'Why not share your email with the world?',
    function() {
      if(sendEmails){

        console.log("message body", content);
      }
      $('#gmailJsModalBackground').remove();
      $('#gmailJsModalWindow').remove();
    });
  });

  gmail.observe.on("compose", function(){

    chrome.runtime.sendMessage({message: 'composing'});
    // gmail.tools.add_modal_window('Clean inbox', 'Do you want to continue?',
    // function() {
    //   console.log("cleaned inbox");
    // });

  })

}


refresh(main);
