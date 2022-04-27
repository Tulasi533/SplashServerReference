const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/faculty.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");


const router = express.Router();


//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.facultyid+ ".jpg");
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
  
router
.route("/add/image")
.patch(middleware.checkToken, upload.single("img"), (req, res) =>{
  Faculty.findOneAndUpdate(
    {facultyid: req.decoded.facultyid},
    {
      $set: {
        img: req.file.path,
      },
    },
    {new: true},
    (err, result) => {
      if(err) return res.status(500).send(err);
      const response = {
        message: "image added successfully updated",
        data: result,
      };
      return res.status(200).send(response);
    }
  );
});
  

router.route("/login").post((req, res) => {
    Faculty.findOne({ facultyid: req.body.facultyid }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (result === null) {
        return res.status(403).json("Faculty ID incorrect");
      }
      if (result.password === req.body.password) {
        // here we implement the JWT token functionality
        let token = jwt.sign({facultyid: req.body.facultyid}, config.key, {
          //expiresIn: "24h" // expires in 24 hours
        });
        res.json({
          token: token,
          msg: "success",
          type: "faculty"
        });
      } else {
        res.status(403).json("password is incorrect");
      }
    });
  });

router.route("/register").post((req, res) => {
    console.log("inside the register");
    const faculty = new Faculty({
      facultyid: req.body.facultyid,
      name: req.body.name,
      preferredname: req.body.preferredname,
      password: req.body.password,
      mobile: req.body.mobile,
      email: req.body.email,
      department: req.body.department,
      college: req.body.college,
      qualification: req.body.qualification,
      position: req.body.position,
    });
    faculty
      .save()
      .then(() => {
          console.log("Faculty data added");
          res.status(200).json("ok");
      })
      .catch((err) => {
          res.status(403).json({ msg: err });
      });
  });

router.route("/update/:facultyid").patch((req, res) => {
    console.log(req.params.facultyid);
    Faculty.findOneAndUpdate(
        { facultyid: req.params.facultyid },
        { $set: { password: req.body.password } },
        (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if(result == null) return res.status(403).json("Faculty ID not present");
        if (result != null) {
            console.log(result);
            const msg = {
            msg: "password successfully updated",
            rego: req.params.regno,
            };
            return res.json(msg);
        }
        else{
            return res.status(403).json("Something went wrong");
        }
        }
    );
});

router.route("/getData").get(middleware.checkToken, (req,res)=>{
    Faculty.findOne({facultyid: req.decoded.facultyid}, (err, result) =>{
      if(err) return res.json({err: err});
      if(result == null) return res.json({data: []})
      else return res.json({data: result});
    });
});

router.route("/getAllData").get((req,res)=>{
  Faculty.find({}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getFaculty/:facultyid").get((req, res) => {
  Faculty.find({ facultyid: req.params.facultyid }, (err, result) => {
    if (err) return res.json(err);
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/delete/:facultyid").delete((req, res) => {
    Faculty.findOneAndDelete({ facultyid: req.params.facultyid }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      const msg = {
        msg: "Faculty deleted",
        facultyid: req.params.facultyid,
      };
      return res.json(msg);
    });
});

module.exports = router;