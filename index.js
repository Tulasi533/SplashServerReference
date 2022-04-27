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

app.route("/").get((req, res) => res.json("This is my splash API"));

t = "17-Apr-2022, 07:29";
d = new Date(t);
console.log(d.getDate());
now = new Date();
v = date.format(now, "DD-MMM-YYYY, hh:mm");
v1 = new Date(v)
f1 = t < v;
console.log(f1);
f = d < v1
console.log(f);
console.log(v);

app.listen(port, () => console.log(`Welcome, you are listening to port ${port}`));