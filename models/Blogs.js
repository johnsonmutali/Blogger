const mongoose = require("mongoose")
const Schema = mongoose.Schema

const blogsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
})

const Blog = mongoose.model("Blog", blogsSchema)

module.exports = Blog