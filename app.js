const express = require("express");
const app = express();
const { Session } = require("./models");
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

app.get("/sportSession", async (req, res) => {
  const allSessions = await Session.getAllSessions();

  console.log(allSessions);
  if (req.accepts("html")) {
    res.render("index", {
      allSessions,
    });
  } else {
    res.json({
      allSessions,
    });
  }
});

app.post("/sportSession", async (req, res) => {
  try {
    await Session.createSession(req.body);
    res.redirect("/sportSession");
  } catch (err) {
    console.error(err);
    res.status(402).json(err);
  }
});

module.exports = app;
