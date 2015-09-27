var $ = require('cheerio');
var request = require("request");
var fs = require("fs");
var Promise = require('bluebird')
var request = Promise.promisify(request);

var names = [];

var domains = []
var allDomains = []
var letters = ["A","B","C","D",""]

for(var i = 0; i < 26; i++){
  var letter = String.fromCharCode(i+65)
  var domain = "http://www.babynames.com/Names/" + letter
  domains.push(domain);
}


function getSubDomains(allDomains,html){
  var parsedHTML = $.load(html);
  console.log("Here");
  console.log(parsedHTML);
  parsedHTML(".pagelink").map(function(i,pageLink){
    console.log("Here");
    pageLink = $(pageLink)
    var names = pageLink.text().split("–");
    var domain = "http://www.babynames.com/Names/" +names[0][0] +"?starts="+names[0][0]+"&namestart="+names[0]+"&namestop="+names[1]
    console.log(domain)
    allDomains.push(domain);
  })
  return allDomains;
}

function getAllNames(err,resp,html){
  if(err) return console.err(err);
  var parsedHTML = $.load(html);
  parsedHTML(".F").map(function(i,name){
    name = $(name);
    var text = name.text()
    names.push(text)
  });
  parsedHTML(".M").map(function(i,name){
    name = $(name);
    var text = name.text()
    names.push(text)
  });
}

var subDomainsPromises = [];

domains.forEach(function(domain){
  subDomainsPromises.push(request(domain));
});

Promise.all(subDomainsPromises).then(function(subDomainsHTMLs){
  var allDomains = [];
  domains.forEach(function(domain){
    allDomains.push(domain);
  });
  subDomainsHTMLs.forEach(function(html){
    allDomains = getSubDomains(allDomains,html)
  });
  console.log(allDomains.length);
})

// allDomains.forEach(function(domain,index){
//   request(domain,getAllNames);
// });



// request(domain, getNames)
