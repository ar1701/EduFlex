if(process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
  }
  
  const express = require("express");
  const app = express();
  const path = require("path");
  const ejsMate = require("ejs-mate");
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/views"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
  app.engine("ejs", ejsMate);


let port = 8080;
app.listen(port, ()=>{
    console.log("listening to the port " + port);
})

app.get("/index", (req,res)=>{
    res.render("index.ejs");
})

app.get("/about", (req,res)=>{
    res.render("about.ejs");
})

app.get("/contact", (req,res)=>{
    res.render("contact.ejs");
})

app.get("/team", (req,res)=>{
    res.render("team.ejs");
})

app.get("/testimonial", (req,res)=>{
    res.render("testimonial.ejs");
})

app.get("/courses", (req,res)=>{
    res.render("courses.ejs");
})

