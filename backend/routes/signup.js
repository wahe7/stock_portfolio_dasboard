const {signup} = require("../controller/signup")
const express = require("express")
const router = express.Router()

router.post("/signup",signup)

module.exports = router