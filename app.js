const express = require("express")
const mongoose = require("mongoose")

const app = express()
const dbURI =
  "mongodb+srv://mutali:0700390330@h-clusters.orif1ql.mongodb.net/h_blogs?retryWrites=true&w=majority&appName=h-clusters"


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

app.get("/create", (req, res) => {
  res.render("Pages/create")
})

app.get("/categories", (req, res) => {
  res.render("Pages/categories")
})