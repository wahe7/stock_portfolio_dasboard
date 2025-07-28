const express = require("express")
const router = express.Router()
const {addPortfolio,getPortfolio,deleteStock,editStock} = require("../controller/portfolio")

router.post("/portfolio/addPortfolio",addPortfolio)
router.get("/portfolio/:userId",getPortfolio)
router.delete("/portfolio/:userId/:stockId",deleteStock)
router.put("/portfolio/:userId/:stockId",editStock)

module.exports = router