const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const app = express();
const date = require("date-and-time");
/*
    https://damp-ridge-81846.herokuapp.com/
    
    "regno": "18PA1A0533",
    "name": "Chinthalapudi Satya Rama Tulasi",
    "preferredname": "Ch.Tulasi",
    "password": "18PA1A0533",
    "mobile": "8332834979",
    "email": "18pa1a0533@vishnu.edu.in",
    "branch": "Computer Science and Engineering",
    "college": "Vishnu Institute of Technology",
    "academicstart": "2018",
    "academicend": "2022",
    "facultyid": "2018202203"

    "facultyid": "2018202201",
    "name": "Bonthu Sridevi",
    "preferredname": "B.Sridevi",
    "password": "2018202201",
    "mobile": "9885880382",
    "email": "sridevi.b@vishnu.edu.in",
    "department": "Computer Science and Engineering",
    "college": "Vishnu Institute of Technology",
    "qualification": "M.Tech(CSE), B.Tech(CSE) in JNTUK",
    "position": "Assistant Professor"

    "name": "Datathon2022",
    "eligibility": "All Year Students of CSE/IT/ECE",
    "regstartdate": "Sat Apr 09 2022 13:14:39 GMT+0530 (India Standard Time)",
    "regenddate": "Sun Apr 10 2022 23:59:59 GMT+0530 (India Standard Time)",
    "eventstartdate": "Mon Apr 11 2022 09:00:00 GMT+0530 (India Standard Time)",
    "eventenddate": "Mon Apr 11 2022 16:00:00 GMT+0530 (India Standard Time)",
    "venue": "Academic Excellence, 2nd floor",
    "winnercriteria": "Top Three teams who will get more accuracy will get prizes and gifts.",
    "discription": "In this Datathon we will form teams, each team of 4members. Each team has to develop a model for the given data set to find y values of data set.",
    "scope": "VIT, SVECW",
    "organizer": "B.Sridevi, Associate Dean, Dept of CSE, VIT"

    "adminid": "SPLASH01",
    "password": "SPLASH01",
    "name": "Anand Gona",
    "mobile": "9948678654",
    "email": "anandgona1234@gmail.com",
    "college": "VIT"

    "userid": "18PA1A0533",
    "place": "1st Prize",
    "eventid": "627614b07a39fdd5b7e06496"
*/
// heroku link: https://aqueous-forest-17404.herokuapp.com/
// mongodb://localhost:27017/AppDB
mongoose.connect("mongodb+srv://Tulasi533:Tulasi_533@cluster0.xttup.mongodb.net/SplashDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});

const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDB connected");
});

app.use("/uploads", express.static("uploads"));
app.use(express.json());
const studentRoute = require("./routes/student");
app.use("/student",studentRoute);

const facultyRoute = require("./routes/faculty");
app.use("/faculty",facultyRoute);

const eventRoute = require("./routes/event");
app.use("/event", eventRoute);

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);

const approvalRoute = require("./routes/approval");
app.use("/approval", approvalRoute);

const winnerRoute = require("./routes/winner");
app.use("/winner", winnerRoute);

app.route("/").get((req, res) => res.json("This is my splash API"));

// t = "17-Apr-2022, 07:29";
// d = new Date(t);
// console.log(d.getDate());
// now = new Date();
// console.log(now)
// v = date.format(now, "DD-MMM-YYYY, H:mm");
// v1 = new Date(v)
// f1 = t < v;
// console.log(f1);
// f = d < v1
// console.log(f);
// console.log(v);
// f2 = "30-April-2022, 16:38"
// console.log(f2 > v)
// f3 = new Date(f2)
// console.log(f3 > v1)
// UtcToIst("2022-05-01T00:30:00.000+00:00")
// function UtcToIst(d) {
//   var dateUTC = new Date(d);
//   var dateUTC = dateUTC.getTime() 
//   var dateIST = new Date(dateUTC);
//   //date shifting for IST timezone (+5 hours and 30 minutes)
//   dateIST.setHours(dateIST.getHours() + 5); 
//   dateIST.setMinutes(dateIST.getMinutes() + 30);
//   console.log(dateIST);
//   date2 = date.format(dateIST, "DD-MMM-YYYY, H:mm");
//   console.log(date2);
// }

// var d = new Date('2022-04-30T00:30:00.000+00:00');
// console.log(d.getUTCHours()); // Hours
// console.log(d.getUTCMinutes());
// console.log(d.getUTCSeconds());
now = new Date();
console.log(now);
v = date.format(now, "DD-MMM-YYYY, H:mm");
console.log(v);

UtcToIst("2022-05-01T00:30:00.000+00:00")
function UtcToIst(d) {
  var dateUTC = new Date(d);
  v1 = dateUTC.toLocaleString();
  v2 = new Date(v1);
  v3 = date.format(v2, "DD-MMM-YYYY, H:mm");
  v4 = new Date(v3)
  console.log(v3);
  console.log(v4);

  
}


app.listen(port, () => console.log(`Welcome, you are listening to port ${port}`));