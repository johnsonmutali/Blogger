const User = require("../models/User.js")
const jwt = require("jsonwebtoken")

const handleError = (err) => {
  let error = {
    username: "",
    email: "",
    password: "",
    message: ""
  }
  if (err.message == "Incorrect username or email") {
    error.message = "Please enter a valid email or username"
    return error
  }
  if (err.message == "Ivalid password") {
    error.password = "Please enter a valid password"
    return error
  }


  if (err.code === 11000) {
    error.message = "The email or username provided is already taken"
    return error.message
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message
    })
  }
  return error
}


const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = id => {
  return jwt.sign({ id }, "house harkonnen", {
    expiresIn: maxAge
  })
}
module.exports.signup_get = (req, res) => {
  res.render("Pages/signup")
}
module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })
    const token = createToken(user._id)
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge
    })
    res.status(201).json({ user })
  } catch (err) {
    const errors = handleError(err)
    res.status(400).json({ errors })
  }
}

module.exports.login_get = (req, res) => {
  res.render("Pages/login")
}
module.exports.login_post = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const user = await User.login(username, email, password)
    const token = createToken(user._id)
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge
    })
    res.status(200).json({ user })
  } catch (err) {
    const errors = handleError(err)
    res.status(400).json({ errors })
  }
}
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 })
  res.redirect("/")
}