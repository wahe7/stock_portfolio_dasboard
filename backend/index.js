const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors());
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limit);

app.get("/",(req,res)=>{
  res.send("Hello World")
})
app.use("/api",require("./routes/signup.js"))
app.use("/api",require("./routes/login.js"))
app.use("/api",require("./routes/portfolio.js"))

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
