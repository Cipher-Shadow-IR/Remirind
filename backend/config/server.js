require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});