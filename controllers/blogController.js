const fs = require("fs")
const path = require("path")
let Blog = require("../models/Blogs.js")

const blogsFilePath = path.join(__dirname, "../data/blogs.json")
const blogsArray = JSON.parse(fs.readFileSync(blogsFilePath, "utf-8"))
Blog.insertMany(blogsArray)
  .then(() => {
    console.log("blogController working")
  })
  .catch(err => console.log(err))

const blog_index = (req, res) => {
  Blog.find()
    .then(result => {
      res.render("../views/Pages/blogs.ejs", { blogs: result })
    })
    .catch(err => {
      console.log(err)
    })
}

const blog_create = (req, res) => {
  const blog = new Blog(req.body)
  blog.save()
    .then(result => res.redirect("/blogs"))
    .catch(err => console.log(err))
}

const blog_details = (req, res) => {
  const id = req.params.id
  console.log(id)
  Blog.findById(id)
    .then(result => {
      res.render("../views/Pages/blogDetails", { blog: result })
    })
    .catch(err => console.log(err))
}

module.exports = {
  blog_index,
  blog_create,
  blog_details,
}