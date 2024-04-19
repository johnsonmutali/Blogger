const express = require("express")
const router = express.Router()
const blogController = require("../controllers/blogController.js")
console.log(blogController.blog_index)
router.get("/", blogController.blog_index)
router.post("/", blogController.blog_create)
router.get("/:id", blogController.blog_details)

module.exports = router