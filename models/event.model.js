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
    type: Date,
    required: true,
  },
  regenddate: {
    type: Date,
    required: true,
  },
  eventstartdate: {
    type: Date,
    required: true
  },
  eventenddate: {
    type: Date,
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
  participants: {
    type: Array,
    default: []
  },
  winners: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Event", Event);