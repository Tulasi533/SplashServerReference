const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Student = Schema({
  regno: {
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
  branch: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  academicstart: {
    type: String,
    required: true,
  },
  academicend: {
    type: String,
    required: true,
  },
  facultyid: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: "https://static.thenounproject.com/png/504708-200.png",
  },
});

module.exports = mongoose.model("Student", Student);