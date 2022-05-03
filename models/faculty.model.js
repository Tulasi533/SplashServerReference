const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Faculty = Schema({
  facultyid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  preferredname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  myevents: {
    type: Array,
    default: []
  },
  myparticipations: {
    type: Array,
    default: []
  },
  myachievements: {
    type: Array,
    default: []
  },
  mystudents: {
    type: Array,
    default: []
  },
  approvals: {
    type: Array,
    default: []
  },
  img: {
    type: String,
    default: "https://static.thenounproject.com/png/504708-200.png",
  },
});

module.exports = mongoose.model("Faculty", Faculty);