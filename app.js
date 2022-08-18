const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://rakshit:chitkararakshit@cluster0.q0egtms.mongodb.net/todolistDB');

const workSchema = new mongoose.Schema({
  name: String
});

const Work = mongoose.model("Work", workSchema);

const id1 = new Work({
  name: "Welcome to my ToDo List"
});
const id2 = new Work({
  name: "Hit the + to add new work"
});
const id3 = new Work({
  name: "Check the checkbox to delete the specific work"
});




// GET FUNCTION

app.get("/", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);


  Work.find({}, function(err, works) {

    if (err) {
      console.log(err);
    } else {

      if (works.length == 0) {
        Work.insertMany([id1,id2,id3], function(err){
          if(err){
            console.log(err);
          } else {
            res.redirect("/");
          };
        });
      } else {
        res.render("list", {
          curday: day,
          newIems: works
        });
      }
    }
  });
});








// POST FUNCTION

app.post("/", function(req, res) {

  const newAdded = req.body.newItem;

  const inputed = new Work({
    name : newAdded
  });

  inputed.save();

  res.redirect("/");
});

app.post("/delete", function(req,res){

  const deleted = req.body.checkbox;
  Work.deleteOne({_id : deleted},function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  })
})


app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
