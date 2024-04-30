require("dotenv").config()
const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { requireAuth, checkUser } = require("./middlewares/authMiddleWare.js")
const db = mongoose.connection;
const fs = require("fs")
const path = require("path")

//models
const Genre = require("./models/Genre.js")
const authRoutes = require("./routes/AuthRoutes.js")
const blogRoutes = require("./routes/blogRoutes.js")

const app = express()
const dbURI = process.env.dbURI
console.log("db URI key: ", dbURI)

mongoose.connect(dbURI)
  .then(res => {
    app.listen(3000)
    console.log("listening to port 3k")
  })
  .catch(err => console.log(err))

app.set("view engine", "ejs")

//middleware && static files
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//protects some routes from unauthorised users
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

//page middlgiven eware
app.use("/blogs", blogRoutes)

//routes
app.get("*", checkUser)
app.get("/", (req, res) => res.render("Pages/index"))
app.get("/contact", (req, res) => res.render("Pages/contact"))
app.get("/create", (req, res) => res.render("Pages/create"))
app.get("/edit-profile", (req, res) => res.render("Pages/editProfile"))

const genresFilePath = path.join(__dirname, './data/genres.json');
const genreArray = JSON.parse(fs.readFileSync(genresFilePath, 'utf-8'));
app.get("/categories", (req, res) => res.render("Pages/categories", {
  genres: genreArray
}))

//user profile
app.use(authRoutes)

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("Pages/dashboard", {
    message: `Welcome to the dashboard`
  })
})

