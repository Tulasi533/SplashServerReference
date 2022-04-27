const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Event = Schema({
  facultyid: String,
  name: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true,
  },
  regstartdate: {
    type: String,
    required: true,
  },
  regenddate: {
    type: String,
    required: true,
  },
  eventstartdate: {
    type: String,
    required: true
  },
  eventenddate: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    default: "",
  },
  winnercriteria: {
    type: String,
    default: "",
  },
  scope: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Event", Event);