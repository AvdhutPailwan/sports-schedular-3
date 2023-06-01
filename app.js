const express = require("express");
const app = express();
// const { Session } = require('./models')
const path = require("path");
const bodyParser = require("body-parser");

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;
