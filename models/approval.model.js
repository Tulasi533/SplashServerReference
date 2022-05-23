const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Approval = Schema({
  regno: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "",
  },
  eventid: {
    type: String,
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  facultyid: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Approval", Approval);