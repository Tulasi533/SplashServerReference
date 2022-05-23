const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/faculty.model");
const Student = require("../models/students.model");
const Winner = require("../models/winner.model");
const Approval = require("../models/approval.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const date = require("date-and-time");
const Event = require("../models/event.model");
const router = express.Router();

router.route("/addApproval").post((req, res) => {
  console.log("inside the register");
  const approval = new Approval({
    regno: req.body.regno,
    eventid: req.body.eventid,
    eventname: req.body.eventname,
    facultyid: req.body.facultyid
  });
  approval
    .save()
    .then(() => {
        console.log("Approval added!!");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err });
    });
});

router.route("/checkapproval/:regno/:eventid").get((req, res) => {
  Approval.findOne({ 
    regno: req.params.regno,
    eventid: req.params.eventid
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if(result == null) return res.json({ Status: null});
    if (result.status == "True") {
      return res.json({
        Status: true,
      });
    } else if(result.status == "False") {
      return res.json({
        Status: false,
      });
    }
    else{
      return res.json({
        Status: "still"
      });
    }
  });
});

router.route("/getAllData").get((req,res)=>{
  Approval.find({}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getUnapprovedData").get(middleware.checkToken, (req,res)=>{
  Approval.find(
    {status: {$eq: ""}, facultyid: req.decoded.facultyid}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});


router.route("/setStatus/:id/:value").patch(middleware.checkToken, (req, res) => {
  Approval.findOneAndUpdate({_id: req.params.id},
    { $set: { status: req.params.value } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Faculty removed from student successfully",
          id: req.params.id
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

module.exports = router;
