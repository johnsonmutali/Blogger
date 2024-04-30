const mongoose = require("mongoose")
const { isEmail } = require("validator")
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: [String, "A valid username should include atleast 1 letter"],
    required: [true, "Username required"],
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
  },
  posts: {
    blogs: [],
    media:[]
  }
})
const checkPassword = (a, b) => { return a === b }


userSchema.statics.login = async function (username, email, password) {
  const user = await this.findOne({ username, email })

  if (user) {
    const auth = await checkPassword(password, user.password)
    if (auth) return user

    throw Error("Ivalid password")
  }
  throw Error("Incorrect username or email")
}

module.exports = mongoose.model("user", userSchema)