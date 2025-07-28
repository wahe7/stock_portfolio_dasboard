const express = require("express")
const router = express.Router()
const {addPortfolio,getPortfolio,deleteStock,editStock} = require("../controller/portfolio")

// Portfolio routes with /portfolio prefix (matching frontend expectations)
router.post("/portfolio", addPortfolio)  // POST /api/portfolio
router.get("/portfolio/:userId", getPortfolio)  // GET /api/portfolio/2
router.delete("/portfolio/:userId/:stockId", deleteStock)  // DELETE /api/portfolio/2/1
router.put("/portfolio/:userId/:stockId", editStock)  // PUT /api/portfolio/2/1

module.exports = router