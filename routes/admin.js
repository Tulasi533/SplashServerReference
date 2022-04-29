const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
 


const router = express.Router();


//multer configuration
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.adminid+ ".jpg");
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
  
const upload1 = multer({
  storage: storage1,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter
});
  
router
.route("/add/image")
.patch(middleware.checkToken, upload1.single("img"), (req, res) =>{
  Admin.findOneAndUpdate(
    {adminid: req.decoded.adminid},
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
  Admin.insertMany(
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
  Admin.findOne({ adminid: req.body.adminid }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result === null) {
      return res.status(403).json("Admin ID incorrect");
    }
    if (result.password === req.body.password) {
      // here we implement the JWT token functionality
      let token = jwt.sign({adminid: req.body.adminid}, config.key, {
        //expiresIn: "24h" // expires in 24 hours
      });
      res.json({
        token: token,
        msg: "success",
        type: "admin"
      });
    } else {
      res.status(403).json("password is incorrect");
    }
  });
});

router.route("/register").post((req, res) => {
  console.log("inside the register");
  const admin = new Admin({
    adminid: req.body.adminid,
    name: req.body.name,
    password: req.body.password,
    mobile: req.body.mobile,
    email: req.body.email,
    college: req.body.college
  });
  admin
    .save()
    .then(() => {
        console.log("Admin data added");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err });
    });
});

router.route("/update/:adminid").patch((req, res) => {
  console.log(req.params.adminid);
  Admin.findOneAndUpdate(
    { adminid: req.params.adminid },
    { $set: { password: req.body.password } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Admin ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "password successfully updated",
          adminid: req.params.adminid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
});


router.route("/updateAdmin/:adminid").patch((req, res) => {
  console.log(req.params.adminid);
  Admin.findOneAndUpdate(
    { adminid: req.params.adminid },
    { $set: { name: req.body.name, email:req.body.email, mobile: req.body.mobile, college: req.body.college } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Admin ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "ADMIN DATA successfully updated",
          adminid: req.params.adminid,
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
  Admin.findOne({adminid: req.decoded.adminid}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getAllData").get((req,res)=>{
  Admin.find({}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getOtherData").get(middleware.checkToken, (req,res)=>{
  Admin.find({ adminid: { $ne: req.decoded.adminid }}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/getAdmin/:adminid").get((req, res) => {
  Admin.find({ adminid: req.params.adminid }, (err, result) => {
    if (err) return res.json(err);
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

router.route("/delete/:adminid").delete((req, res) => {
  Admin.findOneAndDelete({ regno: req.params.regno }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    const msg = {
      msg: "Admin deleted",
      regno: req.params.regno,
    };
    return res.json(msg);
  });
});



module.exports = router;