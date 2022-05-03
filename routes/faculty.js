const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/faculty.model");
const Student = require("../models/students.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");

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


router.route("/checkusername/:facultyid").get((req, res) => {
  Faculty.findOne({ facultyid: req.params.facultyid }, (err, result) => {
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

router.route("/getStudents").get(middleware.checkToken, (req, res) => {
  Student.find({
    $or: [{facultyid: req.decoded.facultyid}, {facultyid: ""}]
  },(err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  })
});

router.route("/getMyStudents").get(middleware.checkToken, (req, res) => {
  Student.find({facultyid: req.decoded.facultyid}
  ,(err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  })
});

router.route("/addStudent/:regno").patch(middleware.checkToken, (req, res) => {
  Faculty.findOneAndUpdate({facultyid: req.decoded.facultyid},
    { $push: { mystudents: req.params.regno  } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Faculty ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Student assigned to faculty",
          facultyid: req.decoded.facultyid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

router.route("/removeStudent/:regno").patch(middleware.checkToken, (req, res) => {
  Faculty.findOneAndUpdate({facultyid: req.decoded.facultyid},
    { $pull: { mystudents: req.params.regno  } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Faculty ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Student removed from faculty",
          facultyid: req.decoded.facultyid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

router.route("/addFaculty/:regno").patch(middleware.checkToken, (req, res) => {
  Student.findOneAndUpdate({regno: req.params.regno},
    { $set: { facultyid: req.decoded.facultyid  } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Faculty ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Faculty added to student successfully",
          facultyid: req.decoded.facultyid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

router.route("/removeFaculty/:regno").patch(middleware.checkToken, (req, res) => {
  Student.findOneAndUpdate({regno: req.params.regno},
    { $set: { facultyid: "" } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Faculty ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "Faculty removed from student successfully",
          facultyid: req.decoded.facultyid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
})

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
  Faculty.insertMany(
    data
  ).then(function(){
    console.log("Data inserted");
    res.status(200).json("ok"); // Success
  }).catch(function(err){
    console.log(err);
    res.status(403).json({ msg: err });      // Failure
  });
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


router.route("/updateFaculty/:facultyid").patch((req, res) => {
  console.log(req.params.facultyid);
  Faculty.findOneAndUpdate(
    { facultyid: req.params.facultyid },
    { $set: { name: req.body.name, email:req.body.email, mobile: req.body.mobile, college: req.body.college, department: req.body.department, position: req.body.position, qualification: req.body.qualification } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Faculty ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "FACULTY DATA successfully updated",
          facultyid: req.params.facultyid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
});

router.route("/getOtherData").get(middleware.checkToken, (req,res)=>{
  Admin.find({ facultyid: { $ne: req.decoded.facultyid }}, (err, result) =>{
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