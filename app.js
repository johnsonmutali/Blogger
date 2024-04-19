const express = require("express")
const mongoose = require("mongoose")
const db = mongoose.connection;
const fs = require("fs")
const path = require("path")

//models
const Genre = require("./models/Genre.js")
const Blog = require("./models/Blogs.js")


const app = express()
const dbURI = "mongodb+srv://mutali:0700390330@h-clusters.orif1ql.mongodb.net/Blogger?retryWrites=true&w=majority&appName=h-clusters"

mongoose.connect(dbURI)
  .then(res => {
    app.listen(3000)
    console.log("listening to port 3k")
  })
  .catch(err => {
    console.log(err)
  })

app.set("view engine", "ejs")

//middleware
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

//gets 
app.get("/", (req, res) => {
  res.render("Pages/index")
})

app.get("/contact", (req, res) => {
  res.render("Pages/contact")
})

const blogsFilePath = path.join(__dirname, "./data/blogs.json")
const blogsArray = JSON.parse(fs.readFileSync(blogsFilePath, "utf-8"))
Blog.insertMany(blogsArray)
  .then(() => {
    console.log("added data")
  })
  .catch(err => console.log(err))

app.get("/blogs", (req, res) => {
  Blog.find()
    .then(result => {
      res.render("Pages/blogs", { blogs: result })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body)
  console.log(req.body)
  blog.save()
    .then(result => res.redirect("/blogs"))
    .catch(err => console.log(err))
})

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id
  console.log(id)
  Blog.findById(id)
    .then(result => {
      res.render("Pages/blogDetails", { blog: result })
    })
    .catch(err => console.log(err))
})

app.get("/create", (req, res) => {
  res.render("Pages/create")
})

const genresFilePath = path.join(__dirname, './data/genres.json');
const genreArray = JSON.parse(fs.readFileSync(genresFilePath, 'utf-8'));

Genre.insertMany(blogsArray)
  .then(() => {
    //console.log("added data")
  })
  .catch(err => console.log(err))

app.get("/categories", (req, res) => {
  res.render("Pages/categories", { genres: genreArray })
})