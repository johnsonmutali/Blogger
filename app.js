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
console.log(blogsArray)
Blog.insertMany(blogsArray)
  .then(() => {
    console.log("added data")
    db.close()
  })
  .catch(err => console.log(err))

app.get("/blogs", (req, res) => {
  res.render("Pages/blogs", { blogs: blogsArray })
})

app.post("/blogs", (req, res) => {
  console.log(req.body)
  const blog = new Blog(req.body)

  blog.save()
    //.then(result => res.redirect("/blogs"))
    .catch(err => console.log(err))
})

app.get("/blogs/:", (req, res) => {
  res.render("Pages/blogs", { blogs: blogsArray })
})

app.get("/create", (req, res) => {
  res.render("Pages/create")
})

const genresFilePath = path.join(__dirname, './data/genres.json');
const genreArray = JSON.parse(fs.readFileSync(genresFilePath, 'utf-8'));

Genre.insertMany(blogsArray)
  .then(() => {
    console.log("added data")
    db.close()
  })
  .catch(err => console.log(err))

app.get("/categories", (req, res) => {
  res.render("Pages/categories", { genres: genreArray })
})