const express = require("express");
const Event = require("../models/event.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const date = require("date-and-time");

const router = express.Router();


//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id+ ".jpg");
  }
});
  
const fileFilter = (req, file, cb) => {
  if(file.mimetype == "image/jpeg" || IdleDeadline.mimetype == "image/png") {
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}
  
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter
});

router.route("/add/coverImage/:id")
.patch(middleware.checkToken, upload.single("img"), (req, res) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        coverImage: req.file.path,
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    }
  );
});

router.route("/getUpcomingEvents").get((req, res) => {
  now = new Date();
  v = date.format(now, "DD-MMM-YYYY, H:mm");
  v1 = new Date(v)
  Event.find({
    regenddate: {$gte: v1}}, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "upcoming"});
  });
});

router.route("/getOngoingEvents").get((req, res) => {
  now = new Date();
  v = date.format(now, "DD-MMM-YYYY, H:mm");
  v1 = new Date(v)
  Event.find({
    $and: [
      {eventstartdate: {$lt: v1}},
      {eventenddate: {$gt: v1}}
    ]
    }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "ongoing"});
  });
});

router.route("/getPastEvents").get((req, res) => {
  now = new Date();
  v = date.format(now, "DD-MMM-YYYY, H:mm");
  v1 = new Date(v)
  Event.find({eventenddate: {$lt: v1}}, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "past" });
  });
});

router.route("/getAllEvents").get((req, res) => {
  Event.find({}, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "all" });
  });
});

router.route("/getEvent/:id").get((req, res) => {
  Event.find({ _id: req.params.id }, (err, result) => {
    if (err) return res.json(err);
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/addParticipant/:id/:user").patch(middleware.checkToken, (req, res) => {
  Event.findOneAndUpdate({_id: req.params.id},
    { $push: { participants: req.params.user  } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Event not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Faculty added to Participants list",
          
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

router.route("/addEvent").post(middleware.checkToken, (req, res) => {
  console.log("inside the register");
  const event = new Event({
    facultyid: req.decoded.facultyid,
    name: req.body.name,
    eligibility: req.body.eligibility,
    regstartdate: new Date(req.body.regstartdate),
    regenddate: new Date(req.body.regenddate),
    eventstartdate: new Date(req.body.eventstartdate),
    eventenddate: new Date(req.body.eventenddate),
    venue: req.body.venue,
    discription: req.body.discription,
    scope: req.body.scope,
    organizer: req.body.organizer,
    winnercriteria: req.body.winnercriteria
  });
  event
    .save()
    .then((result) => {
      res.json({ data: result["_id"]});
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

module.exports = router;