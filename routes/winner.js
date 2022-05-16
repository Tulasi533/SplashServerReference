const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/faculty.model");
const Student = require("../models/students.model");
const Winner = require("../models/winner.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const date = require("date-and-time");
const Event = require("../models/event.model");
const router = express.Router();


router.route("/addWinner").post((req, res) => {
  console.log("inside the register");
  const winner = new Winner({
    userid: req.body.userid,
    place: req.body.place,
    eventid: req.body.eventid
  });
  winner
    .save()
    .then(() => {
        console.log("Winner added!!");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err });
    });
});

router.route("/getWinners").get((req, res) => {
  Winner.find({}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  })
});

module.exports = router;