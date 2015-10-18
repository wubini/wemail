var mongoose = require('mongoose');

var schema =  new mongoose.Schema({
    content: {
      type: String
    },
    subject: {
      type: String
    },
    tags: [String],
    location: {
      latitude: Number,
      longitude: Number
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    length: {
      type: Number
    },
    words: [String],
    gender:{
      type: String
    }
});

mongoose.model('Email', schema);
