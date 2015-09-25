var mongoose = require('mongoose');

var schema =  new mongoose.Schema({
    emailAddress: {
        type: String
    },
    content: {
      type: String
    },
    subject: {
      type: String
    }
});

mongoose.model('Email', schema);
