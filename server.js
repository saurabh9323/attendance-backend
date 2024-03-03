require("dotenv").config();

const express = require("express");
const mongoose = require("./databse/db");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const routers = require("./routes/routers.js");

const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(bodyparser.json());
app.use(
  cors({
    origin: "http://localhost:5173/",
  })
);

app.use("/api", routers);

mongoose.connection.once("open", () => {
  console.log("connected to database");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});