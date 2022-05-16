const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Winner = Schema({
  userid: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  eventid: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Winner", Winner);