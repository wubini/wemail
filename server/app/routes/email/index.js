'use strict';
var router = require('express').Router();
var mongoose = require("mongoose");
var Email = mongoose.model("Email");
module.exports = router;

router.get("/", function(req,res){
  Email.find({}).then(function(emails){
    res.json(emails);
  })
});

router.get("/:id", function(req,res){
  Email.findOne({_id: req.params.id}).then(function(email){
    res.json(email);
  })
});

router.post("/", function(req,res){
  Email.create(req.body).then(function(createdEmail){
    res.json(createdEmail);
  });
});
