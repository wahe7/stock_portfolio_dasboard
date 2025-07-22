const express = require("express")
const router = express.Router()
const {addPortfolio,getPortfolio,deleteStock} = require("../controller/portfolio")

router.post("/addPortfolio",addPortfolio)
router.get("/portfolio/:userId",getPortfolio)
router.delete("/portfolio/:userId/:stockId",deleteStock)

module.exports = router