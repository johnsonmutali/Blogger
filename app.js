const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const db = mongoose.connection;
const fs = require("fs")
const path = require("path")

//models
const Genre = require("./models/Genre.js")
const authRoutes = require("./routes/AuthRoutes.js")
const blogRoutes = require("./routes/blogRoutes.js")
const UserCredentials = require("./models/UserCredentials.js")

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

//middleware && static files
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))

//protects some routes from unauthorised users
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

//page middleware
app.use("/blogs", blogRoutes)

//gets 
app.get("/", (req, res) => {
  res.render("Pages/index")
})

app.get("/contact", (req, res) => {
  res.render("Pages/contact")
})

app.get("/create", (req, res) => {
  res.render("Pages/create")
})

const genresFilePath = path.join(__dirname, './data/genres.json');
const genreArray = JSON.parse(fs.readFileSync(genresFilePath, 'utf-8'));

app.get("/categories", (req, res) => {
  res.render("Pages/categories", { genres: genreArray })
})



//user profile
app.use(authRoutes)

app.get("/dashboard", isAuthenticated, (req, res) => {
  console.log(req.session.user)
  res.render("Pages/dashboard", {
    message: `Welcome to the dashboard ${req.session.user.username}`
  })
})

