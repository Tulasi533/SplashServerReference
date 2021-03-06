const express = require("express");
const Student = require("../models/students.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const Faculty = require("../models/faculty.model");
const xlsx = require("xlsx");

const router = express.Router();

//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.regno+ ".jpg");
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
    Student.findOneAndUpdate(
      {regno: req.decoded.regno},
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

router.route("/getData").get(middleware.checkToken, (req,res)=>{
  Student.findOne({regno: req.decoded.regno}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

var storage2 = multer.diskStorage({  
  destination: (req, file, cb)=>{  
      cb(null, './uploads');  
  },  
  filename: (req, file, cb)=>{  
      cb(null, file.originalname);  
  }  
});  

var upload2 = multer({
  storage:storage2
});  
//https://www.youtube.com/watch?v=1XUJgdFRK2M
router.route('/uploadfile').post(upload2.single("uploadfile"), (req, res) =>{
  const wb = xlsx.readFile(req.file.path);
  console.log(wb.SheetNames);
  const ws = wb.Sheets["Sheet1"];
  console.log(ws);
  const data = xlsx.utils.sheet_to_json(ws);
  console.log(data);
  Student.insertMany(
    data
  ).then(function(){
    console.log("Data inserted");
    res.status(200).json("ok"); // Success
  }).catch(function(err){
    console.log(err);
    res.status(403).json({ msg: err });      // Failure
  });
});

router.route("/login").post((req, res) => {
  Student.findOne({ regno: req.body.regno }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result === null) {
      return res.status(403).json("Register Number incorrect");
    }
    if (result.password === req.body.password) {
      // here we implement the JWT token functionality
      let token = jwt.sign({regno: req.body.regno}, config.key, {
        //expiresIn: "24h" // expires in 24 hours
      });
      res.json({
        token: token,
        msg: "success",
        type: "student"
      });
    } else {
      res.status(403).json("password is incorrect");
    }
  });
});

router.route("/register").post((req, res) => {
  console.log("inside the register");
  const student = new Student({
    regno: req.body.regno,
    name: req.body.name,
    preferredname: req.body.preferredname,
    password: req.body.password,
    mobile: req.body.mobile,
    email: req.body.email,
    branch: req.body.branch,
    college: req.body.college,
    academicstart: req.body.academicstart,
    academicend: req.body.academicend,
    facultyid: req.body.facultyid,
  });
  student
    .save()
    .then(() => {
        console.log("Student data added");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err });
    });
});

router.route("/checkusername/:regno").get((req, res) => {
  Student.findOne({ regno: req.params.regno }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result !== null) {
      return res.json({
        Status: true,
      });
    } else
      return res.json({
        Status: false,
      });
  });
});

router.route("/update/:regno").patch((req, res) => {
  console.log(req.params.regno);
  Student.findOneAndUpdate(
    { regno: req.params.regno },
    { $set: { password: req.body.password } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Register Number not present");
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

router.route("/updateStudent/:regno").patch((req, res) => {
  console.log(req.params.regno);
  Student.findOneAndUpdate(
    { regno: req.params.regno },
    { $set: { name: req.body.name, email:req.body.email, mobile: req.body.mobile, college: req.body.college, branch: req.body.branch, facultyid: req.body.facultyid} },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Reg No not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "STUDENT DATA successfully updated",
          regno: req.params.regno,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
});

router.route("/delete/:regno").delete((req, res) => {
  Student.findOneAndDelete({ regno: req.params.regno }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    const msg = {
      msg: "Student deleted",
      regno: req.params.regno,
    };
    return res.json(msg);
  });
});

router.route("/getAllData").get((req,res)=>{
  Student.find({}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getOtherData").get(middleware.checkToken, (req,res)=>{
  Admin.find({ regno: { $ne: req.decoded.regno }}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getStudent/:regno").get((req, res) => {
  Student.find({ regno: req.params.regno }, (err, result) => {
    if (err) return res.json(err);
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});


router.route("/getMentor/:facultyid").get((req, res) => {
  Faculty.find({ facultyid: req.params.facultyid }, (err, result) => {
    if (err) return res.json(err);
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

module.exports = router;