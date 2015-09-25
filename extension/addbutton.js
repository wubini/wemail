console.log("adding button");
var button = document.createElement('h1');
button.className += " secretButton";
button.appendChild(document.createTextNode("I WORK"));
document.getElementsByTagName('body')[0].appendChild(button);
