'use strict';
var router = require('express').Router();
var fs = require('fs');
var mongoose = require("mongoose");
var path = require('path');
module.exports = router;

router.get("/", function(req,res){
  var namesFile = fs.readFileSync(path.join(__dirname,'names.txt'), 'utf-8');
  res.json(JSON.parse(namesFile));
});
