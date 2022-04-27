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
  Event.find({
    regenddate: {$gte: date.format(new Date(), "DD-MMM-YYYY, H:mm")}}, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "upcoming"});
  });
});

router.route("/getOngoingEvents").get((req, res) => {
  Event.find({
    $and: [
      {eventstartdate: {$lt: date.format(new Date(), "DD-MMM-YYYY, H:mm")}},
      {eventenddate: {$gt: date.format(new Date(), "DD-MMM-YYYY, H:mm")}}
    ]
    }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result, type: "ongoing"});
  });
});

router.route("/getPastEvents").get((req, res) => {
  Event.find({eventenddate: {$lt: date.format(new Date(), "DD-MMM-YYYY, H:mm")}}, (err, result) => {
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

router.route("/addEvent").post(middleware.checkToken, (req, res) => {
  console.log("inside the register");
  const event = new Event({
    facultyid: req.decoded.facultyid,
    name: req.body.name,
    eligibility: req.body.eligibility,
    regstartdate: req.body.regstartdate,
    regenddate: req.body.regenddate,
    eventstartdate: req.body.eventstartdate,
    eventenddate: req.body.eventenddate,
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