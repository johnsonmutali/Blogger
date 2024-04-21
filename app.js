const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const db = mongoose.connection;
const fs = require("fs")
const path = require("path")

//models
const Genre = require("./models/Genre.js")
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
//pages
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

app.get("/dashboard", (req, res) => {
  res.render("Pages/dashboard", { genres: genreArray })
})

//user profile

app.use(session({
  secret: "dark",
  resave: false,
  saveUninitialized: true
}))

app.get("/signup", (req, res) => {
  res.render("Pages/signup")
})

app.get("/login", (req, res) => {
  res.render("Pages/login")
})

app.post("/signup", (req, res) => {
  UserCredentials.find()
    .then(result => {
      const credentials = new UserCredentials(req.body)
      const users = result

      if (users.some(user => user.username === credentials.username)) {
        res.send("this name is already taken")
      }
      else if (users.some(user => user.email === credentials.email)) {
        res.send("this email already exists in our database")
      } else {
        credentials.save()
          .then(result => {
            console.log("credentials saved", result)
            req.session.user = credentials;
            res.redirect('/dashboard');
          })
      }
    })
})

app.post("/login", async (req, res) => {
  const newUserSession = req.body
  UserCredentials.find()
    .then(users => {
      const targetObject = newUserSession

      const isSimilar = (obj1, obj2) => {
        return obj1.username === obj2.username &&
          obj1.email === obj2.email &&
          obj1.password === obj2.password
      };

      const similarObject = users.find(user => isSimilar(user, newUserSession));

      if (similarObject) {
        console.log('A similar object was found:', similarObject);
        console.log("before declaring session: ", req.session)
        req.session.user = similarObject
        console.log("after: ", req.session)
        res.redirect('/dashboard')
      } else {
        console.log('No similar object was found');
      }

    })
    .catch(err => {
      console.log(err)
    })

})