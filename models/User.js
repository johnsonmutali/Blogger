const mongoose = require("mongoose")
const { isEmail } = require("validator")
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: [String, "A valid username should include atleast 1 letter"],
    required: [true, "Username needed"],
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "password must have a minimum of 6 characters"]
  }
})

module.exports = mongoose.model("user", userSchema)