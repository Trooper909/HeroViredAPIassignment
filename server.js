const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require('md5');

///////set up ////////////////
const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static("public"));

key = "gfchvjbknafsrfwwwwryeyerh";
hashedKey = md5(key);
////////////////////////Procedural Block///////////////////


///mongoose-mongoDB connection
const connectionUrl = "mongodb+srv://whypayforserver200:getfree,mongodb$@cluster0.qqxtqll.mongodb.net/";
const dbName = "coursesDB"
mongoose.connect(`${connectionUrl}${dbName}`, { useNewurlParser: true })

///Schema and model creation
const courseSchema = {
  courseId: {type: Number, required: true},
  courseName: {type: String, required: true},
  imgUrl: String, 
  university: {type: String, required: true},
  facultyProfileUrl: String, 
  duration: {type: Number, required: true},
  price: {type: Number , required: true},
  cetificateDiplomaUrl: {type: String, required: true},
  eligibility: String
}

const Course = mongoose.model("Course", courseSchema);

///http verbs 
app.route("/courses")
  .get(function (req, res) {
    if(md5(req.query.appid) == hashedKey){
    Course.find(function (err, foundCourses) {
      if (!err) {
        res.send(foundCourses);
      }
      else {
        res.send(err);
      }
      ;
    });
    }else{
      res.send("access denied, use correct appId")
    }
  })

  .post(function (req, res) {
    if(md5(req.query.appid) == hashedKey){
    const newCourse = new Course(
      {
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      imgUrl: req.body.imgUrl,
      university: req.body.university,
      facultyProfileUrl: req.body.facultyProfileUrl,
      duration: req.body.duration,
      price: req.body.price,
      cetificateDiplomaUrl: req.body.cetificateDiplomaUrl,
      eligibility: req.body.eligibility

    });

    newCourse.save(function (err) {
      if (!err) {
        res.send("course is successfully added to the database");
      } else {
        res.send(err);
      }
    })
  }else{
    res.send("access denied, use correct appId")
  }
  });



////////////////////////////specific route methods////////////////////////////////
app.route('/courses/:paramCourseId')
  .get(function (req, res) {
    if(md5(req.query.appid) == hashedKey){
    Course.findOne(
      { courseId: req.params.paramCourseId },
      function (err, foundCourse) {
        if (foundCourse) {
          res.send(foundCourse);
        } else {
          res.send("no such course found.");
        }
      });
    }else{
      res.send("access denied, use correct appId")
    }
  })

  .put(function (req, res) {
    if(md5(req.query.appid) == hashedKey){
    Course.updateOne(
      { courseId: req.params.paramCourseId },
      {
        courseId: req.body.courseId,
        courseName: req.body.courseName,
        imgUrl: req.body.imgUrl,
        university: req.body.university,
        facultyProfileUrl: req.body.facultyProfileUrl,
        duration: req.body.duration,
        price: req.body.price,
        cetificateDiplomaUrl: req.body.cetificateDiplomaUrl,
        eligibility: req.body.eligibility
  
      },

      function (err) {
        if (!err) {
          res.send("successful update");
        } else {
          res.send(err);
        }
      }
    )
    }else{
      res.send("access denied, use correct appId")
    }
  })

  .delete(function (req, res) {
    if(md5(req.query.appid) == hashedKey){
    Course.deleteOne(
      { courseId: req.params.paramCourseId },
      function (err) {
        if (!err) {
          res.send("Deletion Successful");
        } else {
          res.send(err);
        }
      }
    )
    }else{
      res.send("access denied, use correct appId")
    }
  })


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})