const User = require("../models/User.js")


const handleError = (err) => {
  console.log("message: ", err.message)
  console.log("code: ", err.code)
  let error = {
    username: "",
    email: "",
    password: "",
    message: ""
  }

  if (err.code === 11000) {
    error.message = "That email or username is already taken"
    return error.message
  }

  if (err.message.includes("user validation failed:")) {
    //console.log(Object.values(err))
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message
    })
  }

  return error
}
module.exports.signup_get = (req, res) => {
  res.render("Pages/signup")
}
module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })
    res.status(201).json(user)
  } catch (err) {
    const errors = handleError(err)
    res.status(400).send({ errors })
  }
}
module.exports.login_get = (req, res) => {
  res.render("Pages/login")
}
module.exports.login_post = (req, res) => {
  const { username, email, password } = req.body
  res.send("signup")
}