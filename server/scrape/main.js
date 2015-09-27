var $ = require('cheerio');
var request = require("request");
var fs = require("fs");
var Promise = require('bluebird')


var names = [];

var domains = []
var allDomains = []
var letters = ["A","B","C","D",""]

for(var i = 0; i < 26; i++){
  var letter = String.fromCharCode(i+65)
  var domain = "http://www.babynames.com/Names/" + letter
  domains.push(domain);
}


function getSubDomains(err,resp,html){
  if(err) return console.log(err);
  var parsedHTML = $.load(html);
  parsedHTML(".pagelink").map(function(i,pageLink){
    pageLink = $(pageLink)
    var names = pageLink.text().split("–");
    var domain = "http://www.babynames.com/Names/" +names[0][0] +"?starts="+names[0][0]+"&namestart="+names[0]+"&namestop="+names[1]
    allDomains.push(domain);
  })
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
  parsedHTML(".E").map(function(i,name){
    name = $(name);
    var text = name.text()
    names.push(text)
  });
}

var allDomains = [];

domains.forEach(function(domain){
  allDomains.push(domain);
  request(domain, getSubDomains);
});

var lastLength = null
var count = 0;
var allDomainsInterval = setInterval(function(){
  console.log(allDomains.length);
  console.log(lastLength);
  if(lastLength === allDomains.length){
    count++;
    console.log("Count ", count);
  }else{
    lastLength = allDomains.length;
  }

  if(count === 10){
    allDomainsGot = true;
    clearInterval(allDomainsInterval);
    allDomains.forEach(function(domain){
      request(domain,getAllNames);
    });
    var nameCount = 0;
    var newCount = 0;
    var allNames = setInterval(function(){
      if(nameCount === names.length){
        newCount++
        console.log("Second Count ", newCount);
      }else{
        nameCount = names.length;
      }
      if(newCount === 20){
        console.log("Here")
        var sorted = names.sort();
        var namesObj = {};
        sorted.forEach(function(name){
          var firstLetter = name[0];
          if(namesObj[firstLetter] === undefined){
            namesObj[firstLetter] = [];
          }
          namesObj[firstLetter].push(name);
        })
        console.log(namesObj)
        fs.writeFile("./names.txt", JSON.stringify(namesObj), function(err) {
          if(err) return console.err
          clearInterval(allNames);
          clearInterval(allDomainsInterval);
        });
      }
      console.log(names.length);
    },1000);
  }
},1000);



// Promise.all(subDomainsPromises).then(function(subDomainsHTMLs){
//   var allDomains = [];
//   domains.forEach(function(domain){
//     allDomains.push(domain);
//   });
//   subDomainsHTMLs.forEach(function(html){
//     allDomains = getSubDomains(allDomains,html)
//   });
//   console.log(allDomains.length);
// })

// allDomains.forEach(function(domain,index){
//   request(domain,getAllNames);
// });



// request(domain, getNames)
