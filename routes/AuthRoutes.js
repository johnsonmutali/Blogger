const authController = require("../controllers/AuthController.js")
const { Router } = require("express")
const router = Router()

router.get("/signup", authController.signup_get)
router.get("/login", authController.login_get)
router.post("/signup", authController.signup_post)
router.post("/login", authController.login_post)
router.get("/logout", authController.logout_get)

module.exports = router