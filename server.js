require("dotenv").config();

const express = require("express");
const mongoose = require("./databse/db");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const routers = require("./routes/routers.js");

const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());
// Define the list of allowed origins
const allowedOrigins = [
  'https://attendance-ahtvwkkq6-saurabh9323.vercel.app',
  'http://localhost:5173'
];

// CORS middleware function
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the list of allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // If the request origin is not in the list, use the default origin
      callback(null, false);
    }
  },
  credentials: true // Enable credentials (cookies, authorization headers) to be sent cross-origin
};

// Use the CORS middleware
app.use(cors(corsOptions
            app.use(cookieParser());

app.use("/api", routers);

mongoose.connection.once("open", () => {
  console.log("connected to database");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
